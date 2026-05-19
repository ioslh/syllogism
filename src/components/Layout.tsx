import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '@/shared/LanguageContext'
import { cn } from '@/lib/utils'

const menus = [
  { link: 'validate', zh: '验证', en: 'Validate' },
  { link: 'fallacies', zh: '谬误', en: 'Fallacies' },
]

export default function Layout() {
  const { lang, i18n, toggleLang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const activeSegment = location.pathname.split('/')[1]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-6 px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">{i18n.title}</span>
          </div>

          <nav className="flex items-center gap-1">
            {menus.map(m => (
              <button
                key={m.link}
                onClick={() => navigate(`/${m.link}`)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  activeSegment === m.link
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {lang === 'en' ? m.en : m.zh}
              </button>
            ))}
          </nav>

          <div className="flex-1" />

          <a
            href="https://github.com/ioslh/syllogism"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-input"
          >
            <span>{lang === 'en' ? '中文' : 'EN'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
