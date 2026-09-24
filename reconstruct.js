const fs = require('fs')
let code = fs.readFileSync('components/dashboard/tabs/ProfileTab.tsx', 'utf8')

const topPart = code.substring(0, code.indexOf('    return () => document.removeEventListener("mousedown", handleClickOutside)'))

const missingPart = `    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredGoals = EXAM_GOALS.filter(g => g.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !user) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = \`\${user.id}-\${Math.random()}.\${fileExt}\`

      setSavingAvatar(true)
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      setAvatarUrl(data.publicUrl)
      await saveAvatar(data.publicUrl)
      
    } catch (error: any) {
      alert('Error uploading image: ' + error.message)
      setSavingAvatar(false)
    }
  }

  const saveAvatar = async (url: string) => {
    if (!user) return
    setSavingAvatar(true)
    const { error } = await supabase.auth.updateUser({
      data: { custom_avatar: url, avatar_url: url }
    })
    
    if (error) {
      alert('Error saving avatar: ' + error.message)
    } else {
      // Sync avatar to profiles table
      await supabase.from('profiles').update({
        avatar_url: url,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      router.refresh()
    }
    setSavingAvatar(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    
    const finalGoal = examGoal;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        age: age,
        exam_goal: finalGoal,
        bio: bio
      }
    })
    
    if (error) {
      alert('Error saving profile: ' + error.message)
    } else {
      await supabase.from('profiles').update({
        full_name: fullName,
        exam_goal: finalGoal,
        updated_at: new Date().toISOString()
      }).eq('id', user.id)
      
      router.refresh()
    }
    setSavingProfile(false)
  }

`

// the new JSX starts with `  return (`
const bottomPartStartIndex = code.indexOf('  return (')
const bottomPart = code.substring(bottomPartStartIndex)

fs.writeFileSync('components/dashboard/tabs/ProfileTab.tsx', topPart + missingPart + bottomPart)
console.log('Reconstructed.')
