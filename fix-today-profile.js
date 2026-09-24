const fs = require('fs')

// 1. Update page.tsx to fetch unlocked_plants
let pageCode = fs.readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8')
pageCode = pageCode.replace(
  "equipped_plant: 'default' }", 
  "equipped_plant: 'default', unlocked_plants: ['default'] }"
)
pageCode = pageCode.replace(
  "plant_health, streak_at_risk, equipped_plant')", 
  "plant_health, streak_at_risk, equipped_plant, unlocked_plants')"
)
pageCode = pageCode.replace(
  "equippedPlant: profileData.equipped_plant", 
  "equippedPlant: profileData.equipped_plant,\\n    unlockedPlants: profileData.unlocked_plants || ['default']"
)
fs.writeFileSync('app/(dashboard)/dashboard/page.tsx', pageCode)

// 2. Update TodayTab.tsx to track and pass unlocked_plants and equipped_plant state
let ttCode = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')
ttCode = ttCode.replace(
  "profileId?: string\\n  equippedPlant?: string",
  "profileId?: string\\n  equippedPlant?: string\\n  unlockedPlants?: string[]"
)
ttCode = ttCode.replace(
  'profileId,\\n  equippedPlant = "default"\\n}: DashboardClientProps',
  'profileId,\\n  equippedPlant: initialEquippedPlant = "default",\\n  unlockedPlants: initialUnlockedPlants = ["default"]\\n}: DashboardClientProps'
)

ttCode = ttCode.replace(
  'const [localPlantHealth, setLocalPlantHealth] = useState(plantHealth)',
  'const [localPlantHealth, setLocalPlantHealth] = useState(plantHealth)\\n  const [equippedPlant, setEquippedPlant] = useState(initialEquippedPlant)\\n  const [unlockedPlants, setUnlockedPlants] = useState(initialUnlockedPlants)'
)

// Pass to StoreModal
ttCode = ttCode.replace(
  "plant_health: localPlantHealth,",
  "plant_health: localPlantHealth,\\n                equipped_plant: equippedPlant,\\n                unlocked_plants: unlockedPlants,"
)

ttCode = ttCode.replace(
  "setStreakFreezes(updatedProfile.streak_freezes)",
  "setStreakFreezes(updatedProfile.streak_freezes)\\n                if (updatedProfile.equipped_plant) setEquippedPlant(updatedProfile.equipped_plant)\\n                if (updatedProfile.unlocked_plants) setUnlockedPlants(updatedProfile.unlocked_plants)"
)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', ttCode)

console.log('TodayTab and page.tsx updated for dynamic shop state.')
