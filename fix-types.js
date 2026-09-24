const fs = require('fs')
let code = fs.readFileSync('lib/supabase/types.ts', 'utf8')

code = code.replace(/plant_health: number/g, 'plant_health: number\\n          equipped_plant: string\\n          unlocked_plants: string[]')
code = code.replace(/plant_health\?: number/g, 'plant_health?: number\\n          equipped_plant?: string\\n          unlocked_plants?: string[]')

fs.writeFileSync('lib/supabase/types.ts', code)
console.log('Types updated.')
