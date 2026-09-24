const fs = require('fs')

let files = [
  'app/(dashboard)/dashboard/page.tsx',
  'components/dashboard/tabs/TodayTab.tsx',
  'components/dashboard/VirtualPlant.tsx'
]

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8')
  code = code.replace(/\\n/g, '\n')
  fs.writeFileSync(file, code)
})
console.log('Fixed other files.')
