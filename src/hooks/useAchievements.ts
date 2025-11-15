import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
}

interface UserStats {
  id: string;
  level: number;
  xp: number;
  total_questions_answered: number;
  streak_days: number;
  last_activity_date: string | null;
}

export const useAchievements = (userId: string | undefined) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadUnlockedAchievements()]);
    setLoading(false);
  };

  const loadStats = async () => {
    if (!userId) return;

    let { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Create initial stats
      const { data: newStats, error: insertError } = await supabase
        .from('user_stats')
        .insert({ user_id: userId })
        .select()
        .single();

      if (!insertError) data = newStats;
    }

    if (data) setStats(data);
  };

  const loadUnlockedAchievements = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from('user_achievements')
      .select('achievement_id, achievements(key)')
      .eq('user_id', userId);

    if (data) {
      const keys = data.map((item: any) => item.achievements?.key).filter(Boolean);
      setUnlockedAchievements(keys);
    }
  };

  const checkAchievements = async (statsData: UserStats, testsCompleted: number = 0) => {
    if (!userId) return;

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    if (!allAchievements) return;

    for (const achievement of allAchievements) {
      if (unlockedAchievements.includes(achievement.key)) continue;

      let shouldUnlock = false;

      switch (achievement.requirement_type) {
        case 'questions_answered':
          shouldUnlock = statsData.total_questions_answered >= achievement.requirement_value;
          break;
        case 'tests_completed':
          shouldUnlock = testsCompleted >= achievement.requirement_value;
          break;
        case 'streak_days':
          shouldUnlock = statsData.streak_days >= achievement.requirement_value;
          break;
      }

      if (shouldUnlock) {
        await unlockAchievement(achievement);
      }
    }
  };

  const unlockAchievement = async (achievement: Achievement) => {
    if (!userId) return;

    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
      });

    if (!error) {
      setUnlockedAchievements(prev => [...prev, achievement.key]);
      setNewAchievement(achievement);
      await addXP(achievement.xp_reward);
    }
  };

  const addXP = async (amount: number) => {
    if (!userId || !stats) return;

    const newXP = stats.xp + amount;
    const xpForNextLevel = stats.level * 100;
    let newLevelValue = stats.level;

    if (newXP >= xpForNextLevel) {
      newLevelValue = stats.level + 1;
      setNewLevel(newLevelValue);
      setShowLevelUp(true);
    }

    const { data, error } = await supabase
      .from('user_stats')
      .update({ xp: newXP, level: newLevelValue })
      .eq('user_id', userId)
      .select()
      .single();

    if (data) setStats(data);
  };

  const incrementQuestions = async () => {
    if (!userId || !stats) return;

    const newTotal = stats.total_questions_answered + 1;
    const today = new Date().toISOString().split('T')[0];
    
    let newStreak = stats.streak_days;
    if (stats.last_activity_date !== today) {
      const lastDate = stats.last_activity_date ? new Date(stats.last_activity_date) : null;
      const daysDiff = lastDate ? Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;
      
      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
    }

    const { data, error } = await supabase
      .from('user_stats')
      .update({
        total_questions_answered: newTotal,
        streak_days: newStreak,
        last_activity_date: today,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (data) {
      setStats(data);
      await checkAchievements(data);
    }
  };

  return {
    stats,
    loading,
    unlockedAchievements,
    newAchievement,
    setNewAchievement,
    showLevelUp,
    setShowLevelUp,
    newLevel,
    incrementQuestions,
    checkAchievements,
    addXP,
  };
};
