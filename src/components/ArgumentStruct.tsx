import { useLanguage } from '@/shared/LanguageContext'
import type { Argument, Figure } from '@/shared/syllogism'

interface Props {
  argument: Argument
  onChange: (arg: Argument) => void
}

export default function ArgumentStruct({ argument, onChange }: Props) {
  const { i18n, lang } = useLanguage()

  const figures = [1, 2, 3, 4].map(t => ({
    label: i18n[`figure${t}`],
    value: t as Figure,
  }))

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {lang === 'zh' ? '结构' : 'Structure'}
      </h3>
      <div className="space-y-2">
        {(['major', 'minor', 'middle'] as const).map(key => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">{i18n[key]}</span>
            <input
              className="flex-1 h-8 px-2 text-sm rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={argument[key]}
              onChange={e => onChange({ ...argument, [key]: e.target.value })}
            />
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">{i18n.mood}</span>
          <div className="flex gap-1">
            {argument.mood.map((m, idx) => (
              <select
                key={idx}
                value={m}
                onChange={e => {
                  const next = [...argument.mood] as [any, any, any]
                  next[idx] = e.target.value
                  onChange({ ...argument, mood: next })
                }}
                className="h-8 px-1 text-sm font-mono rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {['A', 'E', 'I', 'O'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-12">{i18n.figure}</span>
          <div className="flex gap-1">
            {figures.map(f => (
              <button
                key={f.value}
                onClick={() => onChange({ ...argument, figure: f.value })}
                className={`h-8 px-3 text-sm rounded border transition-colors ${
                  f.value === argument.figure
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-input bg-background text-foreground hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
