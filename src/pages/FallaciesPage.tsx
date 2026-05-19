import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/shared/LanguageContext'
import { argumentAssert, getFallacyExplains } from '@/shared/syllogism'
import AllSyllogisms from '@/components/AllSyllogisms'

export default function FallaciesPage() {
  const { lang, i18n } = useLanguage()
  const { fallacy } = useParams<{ fallacy?: string }>()
  const navigate = useNavigate()
  const fallacyExplains = getFallacyExplains(lang)

  const activeFallacy = (fallacy || '').toUpperCase()

  const setActiveFallacy = (v: string) => {
    if (v) {
      navigate(`/fallacies/${v}`)
    } else {
      navigate('/fallacies')
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r overflow-y-auto py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {lang === 'zh' ? '分类' : 'Categories'}
          </p>
        </div>
        <nav className="space-y-0.5 px-2">
          <button
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeFallacy === 'VALID'
                ? 'bg-green-100 text-green-800'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            onClick={() => setActiveFallacy('VALID')}
          >
            {i18n.validForms}
          </button>
          {argumentAssert.map(ast => (
            <button
              key={ast.key}
              onClick={() => setActiveFallacy(ast.key)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFallacy === ast.key
                  ? 'bg-red-100 text-red-800'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {fallacyExplains[ast.key].name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <AllSyllogisms active={activeFallacy} />
      </div>
    </div>
  )
}
