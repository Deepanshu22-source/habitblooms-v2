const fs = require('fs');
const path = './components/dashboard/HabitCard.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const handleToggle = async \(\) => \{[\s\S]*?catch \(err\) \{/m;

const replacement = `const handleToggle = async () => {
    setLoading(true)
    try {
      const today = getTodayString()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (completed) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('user_id', user.id)
          .eq('completed_at', today)
        
        if (!error) {
          onToggle(habit.id, false)

          const penalty = getReward(Math.max(0, completedCount - 1))
          const { data: profile } = await supabase.from('profiles').select('score, seeds').eq('id', user.id).maybeSingle()
          
          const newSeeds = Math.max(0, (profile?.seeds || 0) - penalty)
          const newScore = Math.max(0, (profile?.score || 0) - penalty)
          
          await supabase.from('profiles').update({
            score: newScore,
            seeds: newSeeds,
          }).eq('id', user.id)

          if (onReward) {
            onReward(-penalty, 0)
          }
        }
      } else {
        const { error } = await supabase.from('habit_completions').insert({
          habit_id: habit.id,
          user_id: user.id,
          completed_at: today,
        })
        if (!error) {
          playSound()
          onToggle(habit.id, true)

          const reward = getReward(completedCount)
          const { data: profile } = await supabase.from('profiles').select('score, seeds, plant_health, plant_stage').eq('id', user.id).maybeSingle()
          
          const newSeeds = (profile?.seeds || 0) + reward
          const newScore = (profile?.score || 0) + reward
          let newHealth = (profile?.plant_health ?? 100) + 5
          let newStage = profile?.plant_stage || 1

          if (newHealth >= 100) {
            newHealth = 100
            if (newStage < 4) newStage += 1
          }

          await supabase.from('profiles').update({
            score: newScore,
            seeds: newSeeds,
            plant_health: newHealth,
            plant_stage: newStage
          }).eq('id', user.id)
          
          if (onReward) {
            onReward(reward, newHealth)
          }

          const examGoal = user.user_metadata?.exam_goal
          if (examGoal) {
            await supabase.from('activity_feed').insert({
              user_id: user.id,
              exam_goal: examGoal,
              habit_name: habit.name,
              action: 'completed',
            }).then(() => {}) 
          }
        }
      }
    } catch (err) {`;

content = content.replace(regex, replacement);
fs.writeFileSync(path, content);
