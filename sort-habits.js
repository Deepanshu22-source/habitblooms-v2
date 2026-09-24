const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/TodayTab.tsx', 'utf8')

const oldState = `  const [habits, setHabits] = useState(() => {
    const todayDayOfWeek = new Date().getDay()
    return initialHabits.filter(h => !h.target_days || h.target_days.includes(todayDayOfWeek))
  })`

const newState = `  const [habits, setHabits] = useState(() => {
    const todayDayOfWeek = new Date().getDay()
    const activeHabits = initialHabits.filter(h => !h.target_days || h.target_days.includes(todayDayOfWeek))
    
    // Sort habits chronologically by reminder_time to act as a Timetable
    return activeHabits.sort((a, b) => {
      if (a.reminder_time && b.reminder_time) {
        return a.reminder_time.localeCompare(b.reminder_time)
      }
      if (a.reminder_time) return -1
      if (b.reminder_time) return 1
      return 0
    })
  })`

code = code.replace(oldState, newState)
fs.writeFileSync('components/dashboard/tabs/TodayTab.tsx', code)
console.log('TodayTab sorted by timetable.')
