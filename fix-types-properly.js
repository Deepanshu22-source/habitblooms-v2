const fs = require('fs')
let code = fs.readFileSync('lib/supabase/types.ts', 'utf8')

// Fix the raw \n
code = code.replace(/\\n/g, '\n')

fs.writeFileSync('lib/supabase/types.ts', code)
console.log('Fixed types.ts newlines.')
