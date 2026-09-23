const fs = require('fs');
const path = './components/dashboard/HabitCard.tsx';

let content = fs.readFileSync(path, 'utf8');

const newProps = `interface Props {
  habit: Habit
  completed: boolean
  completedCount: number
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onEdit?: (habit: Habit) => void
  onReward?: (seeds: number, health: number) => void
  index: number
}

// DIMINISHING RETURNS MATH
const getReward = (count: number) => {
  if (count < 10) return 10;
  if (count < 20) return 5;
  return 1;
};

export default function HabitCard({ habit, completed, completedCount, onToggle, onDelete, onEdit, onReward, index }: Props) {`;

content = content.replace(/interface Props {[\s\S]*?export default function HabitCard\([^)]+\) {/, newProps);

const newToggleLogic = `
      if (completed) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habit.id)
          .eq('user_id', user.id)
          .eq('completed_at', today)
        
        if (!error) {
          onToggle(habit.id, false)

          // Delete Penalty / Undo math
          const penalty = getReward(Math.max(0, completedCount - 1))
          const { data: profile } = await supabase.from('profiles').select('score, seeds, plant_health').eq('id', user.id).maybeSingle()
          
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

          // Diminishing Returns Economy
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
            seeds: newSeeds,`;

content = content.replace(/if \(completed\) \{[\s\S]*?seeds: newSeeds,/m, newToggleLogic);

const newDeleteLogic = `const handleDelete = async () => {
    if (!confirm(\`Delete "\${habit.name}"? This cannot be undone.\`)) return
    
    // STRICT DELETE PENALTY: If deleted while completed today, subtract the seeds they just farmed!
    if (completed) {
      const penalty = getReward(Math.max(0, completedCount - 1))
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('score, seeds').eq('id', user.id).maybeSingle()
        if (profile) {
          await supabase.from('profiles').update({
            score: Math.max(0, (profile.score || 0) - penalty),
            seeds: Math.max(0, (profile.seeds || 0) - penalty),
          }).eq('id', user.id)
          onReward?.(-penalty, 0)
        }
      }
    }

    const { error } = await supabase.from('habits').delete().eq('id', habit.id)
    if (!error) onDelete(habit.id)
  }`;

content = content.replace(/const handleDelete = async \(\) => \{[\s\S]*?if \(!error\) onDelete\(habit\.id\)\n  \}/, newDeleteLogic);

fs.writeFileSync(path, content);
console.log('HabitCard updated!');
