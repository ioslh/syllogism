import { quantity, quality, Quantifier, Quality, TERM_ROLE } from '@/shared/syllogism'
import type { Proposition } from '@/shared/syllogism'
import { useLanguage } from '@/shared/LanguageContext'

const styles: Record<number, React.CSSProperties> = {
  [TERM_ROLE.MAJOR]: { color: 'rgb(190 18 60)', background: 'rgb(254 205 211)', fontWeight: '900' },
  [TERM_ROLE.MINOR]: { color: 'rgb(180 83 9)', background: 'rgb(254 243 199)', fontWeight: '900' },
  [TERM_ROLE.MIDDLE]: { color: 'rgb(88 28 135)', background: 'rgb(233 213 255)', fontWeight: '900' },
}

interface Props {
  proposition: Proposition
  subjectRole: TERM_ROLE
  predicateRole: TERM_ROLE
}

export default function PropositionView({ proposition, subjectRole, predicateRole }: Props) {
  const { i18n } = useLanguage()

  const quantifierText = () => {
    if (quantity[proposition.mood] === Quantifier.PARTICULAR) return i18n.some
    return quality[proposition.mood] === Quality.AFFITMATIVE ? i18n.all : i18n.no
  }

  const qualityText = () => {
    if (quantity[proposition.mood] === Quantifier.UNIVERSAL) {
      return quality[proposition.mood] === Quality.AFFITMATIVE ? i18n.allis : i18n.is
    }
    return quality[proposition.mood] === Quality.AFFITMATIVE ? i18n.is : i18n.isnot
  }

  return (
    <div className="flex flex-wrap items-baseline gap-1 text-2xl font-bold leading-snug text-muted-foreground">
      <span>{quantifierText()}</span>
      <span className="rounded px-1.5 py-0.5 text-xl" style={styles[subjectRole]}>{proposition.subject}</span>
      <span className="text-muted-foreground">{qualityText()}</span>
      <span className="rounded px-1.5 py-0.5 text-xl" style={styles[predicateRole]}>{proposition.predicate}</span>
    </div>
  )
}
