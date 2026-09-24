const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

code = code.replace(
  /  plantHealth,\n  profileId\n\}: DashboardClientProps\) \{/,
  "  plantHealth,\n  profileId,\n  equippedPlant: initialEquippedPlant = 'default',\n  unlockedPlants: initialUnlockedPlants = ['default']\n}: DashboardClientProps) {"
)

// Check StoreModal profile
code = code.replace(
  /plant_health: localPlantHealth,\n                referred_by: null,/,
  "plant_health: localPlantHealth,\n                equipped_plant: equippedPlant,\n                unlocked_plants: unlockedPlants,\n                referred_by: null,"
)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed destructuring 4.')
