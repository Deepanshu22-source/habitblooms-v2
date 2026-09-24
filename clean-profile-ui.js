const fs = require('fs')

let code = fs.readFileSync('components/dashboard/tabs/ProfileTab.tsx', 'utf8')

const returnMatch = code.indexOf('  return (\n    <div className="relative')
if (returnMatch === -1) {
    console.error("COULD NOT FIND RETURN STATEMENT")
    process.exit(1)
}

const topPart = code.substring(0, returnMatch)

const newJsx = `  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-6">
      
      {/* 1. Header & Avatar (Minimalist) */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-gray-500" />
            )}
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            disabled={savingAvatar}
          >
            {savingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
        </div>
        
        <h1 className="text-2xl font-bold text-white mt-4">{fullName || 'Your Profile'}</h1>
        <p className="text-sm text-gray-500">{examGoal || 'No goal set'}</p>
      </div>

      {/* Preset Avatars (Subtle) */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Presets</p>
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-2 -mx-2">
          {PRESET_AVATARS.map((url, i) => (
            <button
              key={i}
              onClick={() => {
                setAvatarUrl(url)
                saveAvatar(url)
              }}
              className={\`w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 transition-all \${
                avatarUrl === url ? 'border-violet-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }\`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={\`Preset \${i}\`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* 2. Personal Info (Grouped List Style) */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Personal</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
            
            <div className="flex items-center px-4 py-3 border-b border-white/5 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex items-center px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400">Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                placeholder="e.g. 21"
              />
            </div>
          </div>
        </div>

        {/* 3. Mission & Bio */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Mission</p>
          <div className="bg-[#131b2f] border border-white/5 rounded-2xl overflow-hidden">
            
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center px-4 py-3 border-b border-white/5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <span className="w-1/3 text-sm text-gray-400">Goal</span>
                <div className="w-2/3 flex items-center justify-between">
                  <span className={examGoal ? "text-white text-sm" : "text-gray-600 text-sm"}>
                    {examGoal || "Select goal"}
                  </span>
                  <ChevronDown size={16} className={\`text-gray-500 transition-transform \${isDropdownOpen ? 'rotate-180' : ''}\`} />
                </div>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#1a233a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 mx-2"
                  >
                    <div className="p-2 border-b border-white/5 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-black/20 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none"
                      />
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                      {filteredGoals.length > 0 ? (
                        filteredGoals.map((goal) => (
                          <button
                            key={goal}
                            onClick={() => {
                              setExamGoal(goal)
                              setIsDropdownOpen(false)
                              setSearchQuery('')
                            }}
                            className={\`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors \${
                              examGoal === goal ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/5'
                            }\`}
                          >
                            {goal}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-500">No matching goals found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex px-4 py-3 focus-within:bg-white/[0.02] transition-colors">
              <label className="w-1/3 text-sm text-gray-400 pt-1">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-2/3 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600 resize-none h-20 custom-scrollbar"
                placeholder="Tell the squad about yourself..."
              />
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="pt-6 space-y-3">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : null}
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500/10 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}
`

fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', topPart + newJsx)
console.log('Minimalist iOS style applied!')
