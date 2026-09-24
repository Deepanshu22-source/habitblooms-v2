const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

code = code.replace(
  "  plantHealth,\\n  profileId\\n}: DashboardClientProps) {",
  "  plantHealth,\\n  profileId,\\n  equippedPlant: initialEquippedPlant = 'default',\\n  unlockedPlants: initialUnlockedPlants = ['default']\\n}: DashboardClientProps) {"
)

// Also fix the dummy profile object at line 444
code = code.replace(
  "plant_health: localPlantHealth,",
  "plant_health: localPlantHealth,\\n                equipped_plant: equippedPlant,\\n                unlocked_plants: unlockedPlants,"
)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed destructuring.')
