const fs = require('fs')

let code = fs.readFileSync('app/(dashboard)/dashboard/page.tsx', 'utf8')

code = code.replace("let profileData = { score: 0, streak: 0, streak_at_risk: false, seeds: 0, streak_freezes: 0, plant_stage: 1, plant_health: 100 }", "let profileData = { score: 0, streak: 0, streak_at_risk: false, seeds: 0, streak_freezes: 0, plant_stage: 1, plant_health: 100, equipped_plant: 'default' }")
code = code.replace(".select('score, streak, seeds, streak_freezes, plant_stage, plant_health, streak_at_risk')", ".select('score, streak, seeds, streak_freezes, plant_stage, plant_health, streak_at_risk, equipped_plant')")
code = code.replace("profileId: user?.id", "profileId: user?.id,\\n    equippedPlant: profileData.equipped_plant")

fs.writeFileSync('app/(dashboard)/dashboard/page.tsx', code)
console.log('page.tsx updated.')
