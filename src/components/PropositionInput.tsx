import { useLanguage } from '@/shared/LanguageContext'
import type { Proposition, PropositionType } from '@/shared/syllogism'

type InputQuantifierType = 'all' | 'no' | 'some'
type InputCopulaType = 'is' | 'isnot'

interface Props {
  mark: string
  value: Proposition
  onChange: (p: Proposition) => void
  isConclusion?: boolean
  terms?: string[]
}

export default function PropositionInput({ mark, value, onChange, isConclusion, terms }: Props) {
  const { i18n } = useLanguage()

  const getQuantifier = (): InputQuantifierType => {
    if (value.mood === 'A') return 'all'
    if (value.mood === 'E') return 'no'
    return 'some'
  }

  const getCopula = (): InputCopulaType => {
    return value.mood === 'O' ? 'isnot' : 'is'
  }

  const quantifier = getQuantifier()
  const copula = getCopula()

  const quantifiers: Array<{ label: string; value: InputQuantifierType }> = [
    { label: i18n.all, value: 'all' },
    { label: i18n.no, value: 'no' },
    { label: i18n.some, value: 'some' },
  ]

  const onQuantifierChange = (q: InputQuantifierType) => {
    let mood: PropositionType
    if (q === 'all') mood = 'A'
    else if (q === 'no') mood = 'E'
    else mood = copula === 'is' ? 'I' : 'O'
    onChange({ ...value, mood })
  }

  const onCopulaChange = (c: InputCopulaType) => {
    let mood = value.mood
    if (c === 'is' && mood === 'O') mood = 'I'
    else if (c === 'isnot' && mood === 'I') mood = 'O'
    onChange({ ...value, mood })
  }

  const conclusionTerms = terms && terms.length
    ? terms.map(t => ({ label: t, value: t, disabled: false }))
    : [{ label: i18n.premiseFirst, value: '__noop', disabled: true }]

  const qualities =
    ['no', 'all'].includes(quantifier)
      ? [
          { label: quantifier === 'all' ? i18n.allis : i18n.is, value: 'is' as InputCopulaType, disabled: false },
          { label: i18n.isnot, value: 'isnot' as InputCopulaType, disabled: true },
        ]
      : [
          { label: i18n.is, value: 'is' as InputCopulaType, disabled: false },
          { label: i18n.isnot, value: 'isnot' as InputCopulaType, disabled: false },
        ]

  const onChangeConclusionSubject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    const p: Partial<Proposition> = { subject: next }
    if (terms && terms.length === 2) {
      const [a, b] = terms
      p.predicate = next === a ? b : a
    }
    onChange({ ...value, ...p })
  }

  const onChangeConclusionPredicate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value
    const p: Partial<Proposition> = { predicate: next }
    if (terms && terms.length === 2) {
      const [a, b] = terms
      p.subject = next === a ? b : a
    }
    onChange({ ...value, ...p })
  }

  const inputClass = "h-10 text-base bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-muted-foreground cursor-pointer"
  const termClass = "h-10 text-base bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-rose-700 placeholder:text-muted-foreground/40"

  return (
    <tr className="group">
      <td className="pl-4 pr-2 py-3 text-2xl font-bold text-muted-foreground w-10">{mark}</td>
      <td className="py-3 px-1">
        <select
          value={quantifier}
          onChange={e => onQuantifierChange(e.target.value as InputQuantifierType)}
          className={inputClass}
        >
          {quantifiers.map(q => (
            <option key={q.value} value={q.value}>{q.label}</option>
          ))}
        </select>
      </td>
      <td className="py-3 px-1">
        {isConclusion ? (
          <select
            value={value.subject}
            onChange={onChangeConclusionSubject}
            className={`${termClass} font-bold cursor-pointer`}
          >
            {conclusionTerms.map(t => (
              <option key={t.value} value={t.value} disabled={t.disabled}>{t.label}</option>
            ))}
          </select>
        ) : (
          <input
            value={value.subject}
            placeholder={i18n.subject}
            onChange={e => onChange({ ...value, subject: e.target.value })}
            className={`${termClass} font-bold w-36`}
          />
        )}
      </td>
      <td className="py-3 px-1">
        <select
          value={copula}
          onChange={e => onCopulaChange(e.target.value as InputCopulaType)}
          className={inputClass}
        >
          {qualities.map(q => (
            <option key={q.value} value={q.value} disabled={q.disabled}>{q.label}</option>
          ))}
        </select>
      </td>
      <td className="py-3 px-1 pr-4">
        {isConclusion ? (
          <select
            value={value.predicate}
            onChange={onChangeConclusionPredicate}
            className={`${termClass} font-bold cursor-pointer`}
          >
            {conclusionTerms.map(t => (
              <option key={t.value} value={t.value} disabled={t.disabled}>{t.label}</option>
            ))}
          </select>
        ) : (
          <input
            value={value.predicate}
            placeholder={i18n.predicate}
            onChange={e => onChange({ ...value, predicate: e.target.value })}
            className={`${termClass} font-bold w-36`}
          />
        )}
      </td>
    </tr>
  )
}
