import { useState, useMemo } from 'react'
import { useLanguage } from '@/shared/LanguageContext'
import { argumentAssert, getFallacyExplains } from '@/shared/syllogism'
import type { Mood, Figure } from '@/shared/syllogism'

interface ArgumentState {
  type: string
  valid: boolean
  fallacies: string[]
}

interface Props {
  active: string
}

export default function AllSyllogisms({ active }: Props) {
  const { lang, i18n } = useLanguage()
  const fallacyExplains = getFallacyExplains(lang)
  const [activeForm, setActiveForm] = useState<ArgumentState | null>(null)

  const allArguments = useMemo<ArgumentState[]>(() => {
    const types = ['A', 'E', 'I', 'O']
    const figures = [1, 2, 3, 4] as Figure[]
    const l: ArgumentState[] = []
    types.forEach(major => {
      types.forEach(minor => {
        types.forEach(conclusion => {
          figures.forEach(figure => {
            const fallacies: string[] = []
            const mood = `${major}${minor}${conclusion}` as Mood
            let allpassed = true
            argumentAssert.forEach(({ fn, key }) => {
              if (fn(mood, figure)) {
                allpassed = false
                fallacies.push(key)
              }
            })
            l.push({ type: `${mood}-${figure}`, valid: allpassed, fallacies })
          })
        })
      })
    })
    return l
  }, [])

  const genClass = (a: ArgumentState) => {
    if (a.valid) {
      if (active === 'VALID') return 'bg-green-700 text-white'
      return 'text-green-700 hover:bg-green-700 hover:text-white'
    }
    const highlighted = a.fallacies.includes(active)
    if (highlighted) return 'bg-red-600 text-white'
    return 'text-red-600 hover:bg-red-600 hover:text-white'
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-1">
        {allArguments.map(a => (
          <button
            key={a.type}
            className={`w-16 h-8 text-xs font-mono font-bold rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-ring ${genClass(a)}`}
            onClick={() => setActiveForm(prev => prev?.type === a.type ? null : a)}
          >
            {a.type}
          </button>
        ))}
      </div>

      {activeForm && (
        <div
          className={`fixed bottom-8 right-8 w-80 rounded-xl border shadow-xl bg-popover text-popover-foreground overflow-hidden transition-all ${
            activeForm.valid ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-red-500'
          }`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold">{activeForm.type}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    activeForm.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {activeForm.valid ? i18n.valid : i18n.invalid}
                </span>
              </div>
              <button
                onClick={() => setActiveForm(null)}
                className="rounded p-1 hover:bg-muted transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m18 6-12 12M6 6l12 12" />
                </svg>
              </button>
            </div>

            {activeForm.fallacies.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{i18n.commitFallacies}{i18n.colon}</p>
                <ul className="space-y-2">
                  {activeForm.fallacies.map(f => (
                    <li key={f}>
                      <p className="text-sm font-semibold">{fallacyExplains[f].name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">{fallacyExplains[f].detail}</p>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  {i18n.source}{i18n.colon}
                  <a href={i18n.refLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">{i18n.refBook}</a>
                </div>
              </div>
            ) : (
              <div className="text-sm text-green-700">
                {lang === 'zh' ? '✓ 这是一个有效的三段论形式' : '✓ This is a valid syllogism form'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
