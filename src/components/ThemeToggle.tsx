import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="glass grid h-10 w-10 place-items-center rounded-xl text-ink transition hover:border-neon/60 hover:text-neon"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
