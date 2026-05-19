import type { Argument, PropositionType, Proposition } from '@/shared/syllogism'
import { TERM_ROLE } from '@/shared/syllogism'
import PropositionView from './PropositionView'

interface Props {
  argument: Argument
}

export default function ArgumentShow({ argument }: Props) {
  const majorType = argument.mood[0] as PropositionType
  const minorType = argument.mood[1] as PropositionType
  const conclusionType = argument.mood[2] as PropositionType

  const majorTerm: Proposition = {
    mood: majorType,
    subject: [1, 3].includes(argument.figure) ? argument.middle : argument.major,
    predicate: [1, 3].includes(argument.figure) ? argument.major : argument.middle,
  }

  const minorTerm: Proposition = {
    mood: minorType,
    subject: [1, 2].includes(argument.figure) ? argument.minor : argument.middle,
    predicate: [1, 2].includes(argument.figure) ? argument.middle : argument.minor,
  }

  const conclusionTerm: Proposition = {
    mood: conclusionType,
    predicate: argument.major,
    subject: argument.minor,
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="space-y-2">
        <PropositionView
          proposition={majorTerm}
          subjectRole={[1, 3].includes(argument.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MAJOR}
          predicateRole={[1, 3].includes(argument.figure) ? TERM_ROLE.MAJOR : TERM_ROLE.MIDDLE}
        />
        <PropositionView
          proposition={minorTerm}
          subjectRole={[1, 2].includes(argument.figure) ? TERM_ROLE.MINOR : TERM_ROLE.MIDDLE}
          predicateRole={[1, 2].includes(argument.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MINOR}
        />
      </div>
      <div className="h-px bg-border" />
      <PropositionView
        proposition={conclusionTerm}
        subjectRole={TERM_ROLE.MINOR}
        predicateRole={TERM_ROLE.MAJOR}
      />
    </div>
  )
}
