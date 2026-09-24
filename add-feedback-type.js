const fs = require('fs')

let code = fs.readFileSync('lib/supabase/types.ts', 'utf8')

const feedbackType = `      feedback: {
        Row: {
          id: string
          user_id: string
          message: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: string
          created_at?: string
        }
      }
`

code = code.replace("Tables: {\n", "Tables: {\n" + feedbackType)
fs.writeFileSync('lib/supabase/types.ts', code)
console.log('Added feedback to types.ts')
