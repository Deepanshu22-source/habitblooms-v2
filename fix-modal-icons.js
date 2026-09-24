const fs = require('fs')

function fixModal(file) {
  let code = fs.readFileSync(file, 'utf8')

  const oldJsx = `{ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={\`w-10 h-10 rounded-xl text-xl transition-all \${
                    icon === i ? 'bg-violet-500/30 ring-2 ring-violet-500' : 'bg-white/5 hover:bg-white/10'
                  }\`}
                >
                  {i}
                </button>
              ))}`

  const newJsx = `{ICONS.map((iconName) => {
                const Icon = HABIT_ICONS[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={\`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all \${
                      icon === iconName ? 'bg-violet-500 text-white scale-110 shadow-lg' : 'bg-[#131b2f] hover:bg-white/10 text-gray-400 border border-white/5'
                    }\`}
                  >
                    <Icon size={24} />
                  </button>
                )
              })}`

  code = code.replace(oldJsx, newJsx)
  fs.writeFileSync(file, code)
}

fixModal('components/dashboard/AddHabitModal.tsx')
fixModal('components/dashboard/EditHabitModal.tsx')

console.log('Fixed!')
