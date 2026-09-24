const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

code = code.replace(
  "  plantHealth,\\n  profileId\\n}: DashboardClientProps) {",
  "  plantHealth,\\n  profileId,\\n  equippedPlant: initialEquippedPlant = 'default',\\n  unlockedPlants: initialUnlockedPlants = ['default']\\n}: DashboardClientProps) {"
)

// Let's replace exactly at profileId
code = code.replace(
  '  plantHealth,\\n  profileId\\n}: DashboardClientProps)',
  "  plantHealth,\\n  profileId,\\n  equippedPlant: initialEquippedPlant = 'default',\\n  unlockedPlants: initialUnlockedPlants = ['default']\\n}: DashboardClientProps)"
)

// Let's replace exactly in the StoreModal
const badStoreModal = `                plant_stage: plantStage,
                plant_health: localPlantHealth,
                equipped_plant: equippedPlant,
                unlocked_plants: unlockedPlants,
                equipped_plant: equippedPlant,
                unlocked_plants: unlockedPlants,
                referred_by: null,`

const goodStoreModal = `                plant_stage: plantStage,
                plant_health: localPlantHealth,
                equipped_plant: equippedPlant,
                unlocked_plants: unlockedPlants,
                referred_by: null,`

code = code.replace(badStoreModal, goodStoreModal)

// Wait, let's just use string replacement on the exact block.
const storeModalProfile = `profile={{
                id: profileId,
                score,
                streak,
                streak_at_risk: localStreakAtRisk,
                seeds,
                streak_freezes: streakFreezes,
                plant_stage: plantStage,
                plant_health: localPlantHealth,
                referred_by: null,
                full_name: '',
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}`
const newStoreModalProfile = `profile={{
                id: profileId,
                score,
                streak,
                streak_at_risk: localStreakAtRisk,
                seeds,
                streak_freezes: streakFreezes,
                plant_stage: plantStage,
                plant_health: localPlantHealth,
                equipped_plant: equippedPlant,
                unlocked_plants: unlockedPlants,
                referred_by: null,
                full_name: '',
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}`

code = code.replace(storeModalProfile, newStoreModalProfile)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed destructuring 2.')
