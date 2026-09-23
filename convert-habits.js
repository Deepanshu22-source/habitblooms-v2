const fs = require('fs');

let habitsTab = fs.readFileSync('app/(dashboard)/habits/page.tsx', 'utf8');
habitsTab = habitsTab.replace(/export default function HabitsPage/g, 'export default function HabitsTab');
fs.writeFileSync('components/dashboard/tabs/HabitsTab.tsx', habitsTab);
console.log("Moved habits page to tab.");
