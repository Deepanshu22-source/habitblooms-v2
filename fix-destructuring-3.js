const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

code = code.replace(
  "  plantHealth,\\n  profileId\\n}: DashboardClientProps) {",
  "  plantHealth,\\n  profileId,\\n  equippedPlant: initialEquippedPlant = 'default',\\n  unlockedPlants: initialUnlockedPlants = ['default']\\n}: DashboardClientProps) {"
)
fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
