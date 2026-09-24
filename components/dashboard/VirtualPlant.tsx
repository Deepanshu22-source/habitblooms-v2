'use client'

import { motion } from 'framer-motion'
import { Droplet, Heart, ShieldAlert, Sparkles, Leaf } from 'lucide-react'

interface VirtualPlantProps {
  stage: number      // 1: Seed, 2: Sprout, 3: Growing, 4: Bloom
  health: number     // 0 to 100
  freezes: number
  equippedPlant?: string
}

export default function VirtualPlant({ stage = 1, health = 100, freezes = 0, equippedPlant = 'default' }: VirtualPlantProps) {
  
  // Determine plant visual based on stage
  const getPlantGraphic = () => {
    if (health <= 0) return '🥀' // Dead/Wilted

    if (equippedPlant === 'bonsai') {
      switch (stage) {
        case 1: return '🪵' 
        case 2: return '🪴' 
        case 3: return '⛩️' 
        case 4: return '🌲'
        default: return '🪴'
      }
    }
    if (equippedPlant === 'cactus') {
      switch (stage) {
        case 1: return '🏜️'
        case 2: return '🌵'
        case 3: return '🌵✨'
        case 4: return '🌸🌵'
        default: return '🌵'
      }
    }
    if (equippedPlant === 'monstera') {
      switch (stage) {
        case 1: return '🪴'
        case 2: return '🌿'
        case 3: return '🌴'
        case 4: return '🌺🌴'
        default: return '🌿'
      }
    }
    if (equippedPlant === 'golden') {
      switch (stage) {
        case 1: return '✨🌱'
        case 2: return '✨🌿'
        case 3: return '✨🌳'
        case 4: return '🌟🌳🌟'
        default: return '✨🌳'
      }
    }
    
    // Default Sprout
    switch (stage) {
      case 1: return '🌰' // Seed
      case 2: return '🌱' // Sprout
      case 3: return '🌿' // Growing
      case 4: return '🌸' // Bloom (matches the logo!)
      default: return '🌱'
    }
  }

  const getStatusText = () => {
    if (health <= 0) return 'Wilted. Missed too many days!'
    if (health < 30) return 'Thirsty! Complete a habit to water.'
    if (stage === 4) return 'Fully Bloomed! Keep it up!'
    return 'Growing beautifully.'
  }

  // Calculate health color
  const healthColor = health > 50 ? 'bg-emerald-500' : health > 20 ? 'bg-orange-500' : 'bg-red-500'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md shadow-xl overflow-hidden group"
    >
      {/* Background glow based on health */}
      <div 
        className={`absolute inset-0 opacity-10 blur-2xl sm:blur-3xl transition-colors duration-1000 ${
          health > 50 ? 'bg-emerald-500' : health > 20 ? 'bg-orange-500' : 'bg-red-500'
        }`}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        
        {/* Plant Display */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-black/40 rounded-full border border-white/10 shadow-inner overflow-hidden shrink-0">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-[#1a1311] border-t border-white/5" />
          
          {/* The Plant */}
          <motion.div
            animate={{ 
              y: [0, -5, 0], 
              rotate: health < 30 ? [0, 5, -5, 0] : 0 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`text-5xl sm:text-6xl z-10 ${health < 30 ? 'opacity-70 grayscale-[0.5]' : ''}`}
            style={{ transformOrigin: 'bottom center' }}
          >
            {getPlantGraphic()}
          </motion.div>

          {/* Sparkles if healthy & blooming */}
          {stage === 4 && health > 80 && (
             <Sparkles className="absolute top-3 right-3 sm:top-4 sm:right-4 text-pink-400 opacity-50 animate-pulse" size={14} />
          )}
        </div>

        {/* Plant Stats */}
        <div className="flex-1 w-full text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-between mb-1 sm:mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              Your Habit<span className="text-emerald-400">Bloom</span>
            </h3>
            {freezes > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] sm:text-xs font-bold" title={`${freezes} Streak Freezes Active`}>
                <ShieldAlert size={12} />
                {freezes} Active
              </div>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">{getStatusText()}</p>

          {/* Health Bar */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex justify-between text-[10px] sm:text-xs font-medium">
              <span className="flex items-center gap-1 text-gray-400"><Droplet size={10} className="sm:w-3 sm:h-3"/> Moisture</span>
              <span className="text-white">{health}%</span>
            </div>
            <div className="h-2 sm:h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${health}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${healthColor} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
              />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
