const fs = require('fs')

let code = fs.readFileSync('components/dashboard/HabitCard.tsx', 'utf8')

code = code.replace("import { HABIT_ICONS } from '@/lib/icons'\n", "")

const oldJsx = `{(() => {
          const Icon = HABIT_ICONS[habit.icon];
          return Icon ? <Icon size={24} style={{ color: habit.color }} /> : habit.icon;
        })()}`

code = code.replace(oldJsx, "{habit.icon}")

fs.writeFileSync('components/dashboard/HabitCard.tsx', code)
console.log('Fixed HabitCard!')
