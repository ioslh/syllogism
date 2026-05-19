import { useLanguage } from '@/shared/LanguageContext'
import type { Argument, Mood } from '@/shared/syllogism'
import { validSyllogisms, argumentAssert, getFallacyExplains } from '@/shared/syllogism'

interface Props {
  argument: Argument
}

export default function ArgumentValidation({ argument }: Props) {
  const { lang, i18n } = useLanguage()
  const fallacyExplains = getFallacyExplains(lang)

  const form = `${argument.mood.join('').toUpperCase()}-${argument.figure}`
  const validEntry = validSyllogisms.find(s => s.form === form)
  const validName = validEntry?.name

  const fallacies = argumentAssert
    .filter(({ fn }) => fn(argument.mood.join('') as Mood, argument.figure))
    .map(({ key }) => fallacyExplains[key])

  return (
    <div
      className={`rounded-lg border p-5 animate-fade-in ${
        validName ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
      }`}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className={`font-mono font-bold text-base ${validName ? 'text-green-700' : 'text-red-700'}`}>
          {form}
        </span>
        {validName && <span className="text-sm font-semibold text-green-700">{validName}</span>}
        <span className={`text-sm ${validName ? 'text-green-800' : 'text-red-800'}`}>
          {validName ? i18n.valid : i18n.invalid}
        </span>
        <div className="ml-auto">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              validName ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {validName
              ? (lang === 'zh' ? '✓ 有效' : '✓ Valid')
              : (lang === 'zh' ? '✗ 无效' : '✗ Invalid')}
          </span>
        </div>
      </div>

      {fallacies.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-red-700">{i18n.commitFallacies}{i18n.colon}</p>
          <ol className="space-y-3 pl-4">
            {fallacies.map(f => (
              <li key={f.name} className="list-decimal">
                <h5 className="text-sm font-semibold text-red-800">{f.name}</h5>
                <p className="text-xs text-red-700/80 mt-1 leading-relaxed">{f.detail}</p>
              </li>
            ))}
          </ol>
          <div className="text-right pt-2">
            <a href={i18n.refLink} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground underline">
              《{i18n.refBook}》
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
