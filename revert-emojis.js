const fs = require('fs')

function revertModal(filepath) {
  let code = fs.readFileSync(filepath, 'utf8')
  
  // Replace ICONS
  code = code.replace(
    /const ICONS = Object\.keys\(HABIT_ICONS\)/,
    "const ICONS = ['🌸', '💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '🌿', '🍎', '😴', '🎵', '🧠', '❤️', '⭐']"
  )

  // Replace default state
  code = code.replace(/useState\('Target'\)/g, "useState('🌸')")
  code = code.replace(/useState<string>\('Target'\)/g, "useState<string>('🌸')")

  // Replace JSX
  const newJsx = `{ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={\`w-12 h-12 shrink-0 rounded-xl text-2xl flex items-center justify-center transition-all \${
                    icon === i ? 'bg-violet-500/30 ring-2 ring-violet-500 scale-110 shadow-lg' : 'bg-[#131b2f] hover:bg-white/10 border border-white/5'
                  }\`}
                >
                  {i}
                </button>
              ))}`

  code = code.replace(/\{ICONS\.map\(\(iconName\) => \{.*?\}\)\}/s, newJsx)
  fs.writeFileSync(filepath, code)
}

function revertCard() {
  let code = fs.readFileSync('components/dashboard/HabitCard.tsx', 'utf8')
  
  // Replace JSX
  code = code.replace(
    /\{[\s\S]*?const Icon = HABIT_ICONS\[habit\.icon\];[\s\S]*?\}\)\(\)\}/s,
    "{habit.icon}"
  )
  fs.writeFileSync('components/dashboard/HabitCard.tsx', code)
}

revertModal('components/dashboard/AddHabitModal.tsx')
revertModal('components/dashboard/EditHabitModal.tsx')
revertCard()

console.log('Emojis restored.')
