const fs = require('fs')

function upgradeModal(filepath) {
  let code = fs.readFileSync(filepath, 'utf8')
  
  // Imports
  const importMatch = code.match(/import.*?from 'lucide-react'/)
  if (importMatch && !code.includes('HABIT_ICONS')) {
    code = code.replace(
      importMatch[0],
      importMatch[0] + "\nimport { HABIT_ICONS } from '@/lib/icons'"
    )
  }

  // Replace default states
  code = code.replace(/const ICONS = \[.*\]/, "const ICONS = Object.keys(HABIT_ICONS)")
  code = code.replace(/useState\('🌸'\)/, "useState('Target')")
  code = code.replace(/useState<string>\('🌸'\)/, "useState<string>('Target')")
  
  // For EditHabitModal specifically, it might initialize from habit.icon
  // which is already handled via props, so the above replace won't break it if it's dynamic.

  // In the JSX, the icons map renders strings. We need to render the Lucide components.
  const oldIconJsx = `              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {ICONS.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    className={\`w-12 h-12 shrink-0 rounded-xl text-2xl flex items-center justify-center transition-all \${
                      icon === i ? 'bg-violet-500 text-white scale-110 shadow-lg' : 'bg-black/30 hover:bg-black/50'
                    }\`}
                  >
                    {i}
                  </button>
                ))}
              </div>`

  const newIconJsx = `              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {ICONS.map(iconName => {
                  const Icon = HABIT_ICONS[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setIcon(iconName)}
                      className={\`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all \${
                        icon === iconName ? 'bg-violet-500 text-white scale-110 shadow-lg' : 'bg-black/30 hover:bg-black/50 text-gray-400'
                      }\`}
                    >
                      <Icon size={24} />
                    </button>
                  )
                })}
              </div>`

  // EditModal might have a slightly different indentation or classes.
  // I will just use regex to replace the inner map function safely.
  
  const mapRegex = /\{ICONS\.map\((.*?)\)\}/s
  
  code = code.replace(/\{ICONS\.map\([^\}]+\}\)\}/s, `{ICONS.map(iconName => {
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
                })}`)
                
  fs.writeFileSync(filepath, code)
}

upgradeModal('components/dashboard/AddHabitModal.tsx')
upgradeModal('components/dashboard/EditHabitModal.tsx')

console.log('Modals upgraded.')
