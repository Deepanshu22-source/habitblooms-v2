const fs = require('fs')

let code = fs.readFileSync('components/dashboard/MasterClient.tsx', 'utf8')

// Remove the LogOut import if it's there
code = code.replace(', LogOut ', ' ')

// Remove the handleSignOut function
const handleSignOutBlock = `  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }`
code = code.replace(handleSignOutBlock, '')

// Remove the button from JSX
const buttonBlock = `            <button
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>`
code = code.replace(buttonBlock, '')

fs.writeFileSync('components/dashboard/MasterClient.tsx', code)
console.log('Removed from MasterClient.')
