const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/ProfileTab.tsx', 'utf8')

// 1. Imports: Make sure we have Send and CheckCircle
const importsMatch = code.match(/import.*?from 'lucide-react'/)
if (importsMatch && !code.includes('Send')) {
  code = code.replace(
    importsMatch[0],
    importsMatch[0].replace('}', ', Send, CheckCircle2 }')
  )
}

// 2. Add State Variables
const stateInjection = `
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  const handleSendFeedback = async () => {
    if (!user || !feedbackText.trim()) return
    setIsSubmittingFeedback(true)
    
    const { error } = await supabase.from('feedback').insert({
      user_id: user.id,
      message: feedbackText,
      type: 'general'
    })
    
    if (error) {
      alert('Error sending feedback: ' + error.message)
    } else {
      setFeedbackSuccess(true)
      setFeedbackText('')
      setTimeout(() => setFeedbackSuccess(false), 3000)
    }
    setIsSubmittingFeedback(false)
  }
`
code = code.replace(
  "const [savingAvatar, setSavingAvatar] = useState(false)",
  "const [savingAvatar, setSavingAvatar] = useState(false)\n" + stateInjection
)

// 3. Add the UI Section
const uiInjection = `
        {/* Support & Feedback */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Help & Feedback</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden p-4">
            <p className="text-sm text-gray-400 mb-3">Found a bug or have a feature request? Let me know directly!</p>
            <div className="relative">
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl p-3 pr-12 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 resize-none h-24 custom-scrollbar"
                placeholder="What's on your mind?..."
              />
              <button
                onClick={handleSendFeedback}
                disabled={!feedbackText.trim() || isSubmittingFeedback || feedbackSuccess}
                className={\`absolute bottom-3 right-3 p-2 rounded-lg transition-all \${
                  feedbackSuccess ? 'bg-green-500/20 text-green-400' :
                  feedbackText.trim() ? 'bg-violet-500 text-white hover:bg-violet-600' : 'bg-white/5 text-gray-500'
                }\`}
              >
                {isSubmittingFeedback ? <Loader2 size={16} className="animate-spin" /> : 
                 feedbackSuccess ? <CheckCircle2 size={16} /> : 
                 <Send size={16} />}
              </button>
            </div>
            {feedbackSuccess && (
              <p className="text-xs text-green-400 mt-2 text-center animate-pulse">Feedback sent! Thank you.</p>
            )}
          </div>
        </div>
`

code = code.replace(
  "{/* 4. Action Buttons */}",
  uiInjection + "\n        {/* 4. Action Buttons */}"
)

fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', code)
console.log('Feedback UI added.')
