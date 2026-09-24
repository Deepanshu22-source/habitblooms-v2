const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

const target = `  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20 md:pb-0">`
    
const replacement = `  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-20 md:pb-0">`

code = code.replace(target, replacement)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed insertion.')
