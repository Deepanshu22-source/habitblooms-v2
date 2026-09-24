const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/ProfileTab.tsx', 'utf8')
code = code.replace("import { motion } from 'framer-motion'", "import { motion, AnimatePresence } from 'framer-motion'")

fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', code)
console.log('Fixed AnimatePresence')
