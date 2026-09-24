const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

// Remove the wrongly inserted code
const wrongCode = `  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return () => clearInterval(timer)`

code = code.replace(wrongCode, `  return () => clearInterval(timer)`)

// Insert it in the right place
const correctInsertionPoint = `  if (greeting === '') return null // Prevent hydration mismatch flash

  return (`

const correctCode = `  if (greeting === '') return null // Prevent hydration mismatch flash

  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return (`

code = code.replace(correctInsertionPoint, correctCode)

// If the greeting line isn't there, let's find the actual main return
if (!code.includes(correctCode)) {
  const backupInsertionPoint = `  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">`
      
  const backupCode = `  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">`
  
  code = code.replace(backupInsertionPoint, backupCode)
}

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Fixed filter insertion.')
