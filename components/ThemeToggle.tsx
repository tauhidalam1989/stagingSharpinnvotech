'use client'

import * as React from 'react'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting until mounted
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
    )
  }

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group border border-white/10"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === 'light' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === 'dark' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'
          }`} 
        />
        <Laptop 
          className={`absolute inset-0 transition-all duration-500 transform ${
            theme === 'system' ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'
          }`} 
        />
      </div>
      
      {/* Tooltip */}
      <span className="absolute -bottom-10 scale-0 group-hover:scale-100 transition-all duration-200 bg-white text-[#0d6efd] text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap shadow-xl">
        {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'System Theme'}
      </span>
    </button>
  )
}
