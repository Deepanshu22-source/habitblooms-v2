const fs = require('fs')

let code = fs.readFileSync('components/dashboard/HabitCard.tsx', 'utf8')

code = code.replace(
  "(() => {\n          const Icon = HABIT_ICONS[habit.icon];\n          return Icon ? <Icon size={24} style={{ color: habit.color }} /> : habit.icon;\n        })()",
  "{(() => {\n          const Icon = HABIT_ICONS[habit.icon];\n          return Icon ? <Icon size={24} style={{ color: habit.color }} /> : habit.icon;\n        })()}"
)

fs.writeFileSync('components/dashboard/HabitCard.tsx', code)
console.log('Fixed HabitCard jsx.')
