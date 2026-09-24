const fs = require('fs')

// 1. Update VirtualPlant.tsx
let vpCode = fs.readFileSync('components/dashboard/VirtualPlant.tsx', 'utf8')
vpCode = vpCode.replace('freezes: number    // Active streak freezes', 'freezes: number\\n  equippedPlant?: string')
vpCode = vpCode.replace('freezes = 0 }: VirtualPlantProps) {', "freezes = 0, equippedPlant = 'default' }: VirtualPlantProps) {")

const getGraphicOld = `  // Determine plant visual based on stage
  const getPlantGraphic = () => {
    if (health <= 0) return '🥀' // Dead/Wilted
    switch (stage) {
      case 1: return '🌰' // Seed
      case 2: return '🌱' // Sprout
      case 3: return '🌿' // Growing
      case 4: return '🌸' // Bloom (matches the logo!)
      default: return '🌱'
    }
  }`

const getGraphicNew = `  // Determine plant visual based on stage
  const getPlantGraphic = () => {
    if (health <= 0) return '🥀' // Dead/Wilted

    if (equippedPlant === 'bonsai') {
      switch (stage) {
        case 1: return '🪵' 
        case 2: return '🪴' 
        case 3: return '⛩️' 
        case 4: return '🌲'
        default: return '🪴'
      }
    }
    if (equippedPlant === 'cactus') {
      switch (stage) {
        case 1: return '🏜️'
        case 2: return '🌵'
        case 3: return '🌵✨'
        case 4: return '🌸🌵'
        default: return '🌵'
      }
    }
    if (equippedPlant === 'monstera') {
      switch (stage) {
        case 1: return '🪴'
        case 2: return '🌿'
        case 3: return '🌴'
        case 4: return '🌺🌴'
        default: return '🌿'
      }
    }
    if (equippedPlant === 'golden') {
      switch (stage) {
        case 1: return '✨🌱'
        case 2: return '✨🌿'
        case 3: return '✨🌳'
        case 4: return '🌟🌳🌟'
        default: return '✨🌳'
      }
    }
    
    // Default Sprout
    switch (stage) {
      case 1: return '🌰' // Seed
      case 2: return '🌱' // Sprout
      case 3: return '🌿' // Growing
      case 4: return '🌸' // Bloom (matches the logo!)
      default: return '🌱'
    }
  }`

vpCode = vpCode.replace(getGraphicOld, getGraphicNew)
fs.writeFileSync('components/dashboard/VirtualPlant.tsx', vpCode)

// 2. Update TodayTab.tsx
let ttCode = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')
ttCode = ttCode.replace('profileId?: string', 'profileId?: string\\n  equippedPlant?: string')
ttCode = ttCode.replace('profileId\\n}: DashboardClientProps', 'profileId,\\n  equippedPlant = "default"\\n}: DashboardClientProps')
ttCode = ttCode.replace('<VirtualPlant stage={plantStage} health={localPlantHealth} freezes={streakFreezes} />', '<VirtualPlant stage={plantStage} health={localPlantHealth} freezes={streakFreezes} equippedPlant={equippedPlant} />')

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', ttCode)

console.log('VirtualPlant and TodayTab updated.')
