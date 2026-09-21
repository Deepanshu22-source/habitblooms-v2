export default function FAQ() {
  const faqs = [
    {
      question: "What is HabitBlooms and how does it work?",
      answer: "HabitBlooms is a gamified habit tracker and productivity app designed to make building routines fun. As you complete your daily tasks, you earn 'Seeds' and grow a Virtual Garden. It uses psychology and gamification to keep you motivated, making it perfect for students, professionals, and anyone with ADHD."
    },
    {
      question: "How do Streak Freezes work in HabitBlooms?",
      answer: "Unlike traditional habit trackers that punish you for missing a single day, HabitBlooms features an in-app economy. You can use the Seeds you earn from completing habits to buy 'Streak Freezes' in the Store. If you miss a day, the freeze automatically protects your streak, preventing burnout and keeping you motivated."
    },
    {
      question: "Does HabitBlooms have a community leaderboard?",
      answer: "Yes! HabitBlooms features a Weekly Squad Leaderboard. You can compete with friends and other users globally. Earning seeds from your daily habits pushes you up the leaderboard, adding a fun, social, and competitive element to your personal growth."
    },
    {
      question: "Is HabitBlooms a Progressive Web App (PWA)?",
      answer: "Yes, HabitBlooms is a fully installable Progressive Web App. You can install it directly to your iOS or Android home screen from your browser, and it will function perfectly just like a native mobile app."
    }
  ]

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-bloom-600/5 blur-[100px]" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-bloom">Questions</span>
          </h2>
          <p className="text-gray-400">Everything you need to know about growing your habits.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-bloom-500/30 transition-colors">
              <h3 className="text-xl font-semibold text-white mb-3">{faq.question}</h3>
              <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
