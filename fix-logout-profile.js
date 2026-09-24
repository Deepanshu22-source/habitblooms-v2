const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/ProfileTab.tsx', 'utf8')

// Add LogOut to lucide-react imports
code = code.replace(
  'Search, ChevronDown } from \'lucide-react\'', 
  'Search, ChevronDown, LogOut } from \'lucide-react\''
)

// Add handleSignOut function
const saveFunction = `  const handleSaveProfile = async () => {`
const signoutFunction = `  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSaveProfile = async () => {`
code = code.replace(saveFunction, signoutFunction)

// Add button to JSX
const actionButtons = `              {/* Action Buttons */}
              <div className="flex items-center justify-end pt-6 border-t border-white/5">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {savingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>`

const newActionButtons = `              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 mt-8">
                <button
                  onClick={handleSignOut}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors border border-red-500/20"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl font-medium hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {savingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>`
code = code.replace(actionButtons, newActionButtons)

fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', code)
console.log('Added to ProfileTab.')
