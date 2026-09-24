const fs = require('fs')

let code = fs.readFileSync('components/dashboard/HabitCard.tsx', 'utf8')

// Add import
const importMatch = code.match(/import.*?from 'lucide-react'/)
code = code.replace(
  importMatch[0],
  importMatch[0] + "\nimport { HABIT_ICONS } from '@/lib/icons'"
)

// Add rendering logic
const oldIconRender = `{habit.icon}`

const newIconRender = `(() => {
          const Icon = HABIT_ICONS[habit.icon];
          return Icon ? <Icon size={24} style={{ color: habit.color }} /> : habit.icon;
        })()`

code = code.replace(oldIconRender, newIconRender)

fs.writeFileSync('components/dashboard/HabitCard.tsx', code)
console.log('HabitCard updated.')
