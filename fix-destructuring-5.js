const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

const oldProfile = `profile={{
                id: profileId,
                score,
                streak,
                streak_at_risk: localStreakAtRisk,
                seeds,
                streak_freezes: streakFreezes,
                plant_stage: plantStage,
                plant_health: plantHealth,
                referred_by: null,
                full_name: userName,
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}`

const newProfile = `profile={{
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
                full_name: userName,
                avatar_url: null,
                exam_goal: null,
                updated_at: ''
              }}`

code = code.replace(oldProfile, newProfile)
fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed destructuring 5.')
