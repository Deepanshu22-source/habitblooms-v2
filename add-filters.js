const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

// 1. Add state
code = code.replace(
  "const [greeting, setGreeting] = useState('')",
  "const [greeting, setGreeting] = useState('')\n  const [selectedCategory, setSelectedCategory] = useState<string>('All')"
)

// 2. Add derived data before return
const derivedData = `  const activeCategories = ['All', ...Array.from(new Set(habits.map(h => h.category)))]
  const displayedHabits = selectedCategory === 'All' ? habits : habits.filter(h => h.category === selectedCategory)

  return (`
code = code.replace("  return (", derivedData)

// 3. Update the JSX mapping and insert the pills
const oldJsx = `<div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Habits</h2>
          <span className="text-gray-500">{completedIds.size} / {habits.length} done</span>
        </div>

        {/* Habits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {habits.map((habit, i) => (`

const newJsx = `<div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl font-semibold text-white">Your Habits</h2>
          <span className="text-gray-500">{completedIds.size} / {habits.length} done</span>
        </div>

        {/* Filter Pills */}
        {activeCategories.length > 2 && (
          <div className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 pb-2 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {activeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors \${
                  selectedCategory === cat 
                    ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' 
                    : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }\`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Habits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {displayedHabits.map((habit, i) => (`

code = code.replace(oldJsx, newJsx)

fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('Filter pills added successfully.')
