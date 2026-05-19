import { useState, useEffect } from 'react'
import type { Proposition, PropositionType, Argument } from '@/shared/syllogism'
import PropositionInput from './PropositionInput'
import { useLanguage } from '@/shared/LanguageContext'

interface Props {
  argument: Argument
  onSubmit: (arg: Argument) => void
}

const reasons: Record<string, string> = {
  INCOMPLETE: '三段论内容不完整',
  PREMISE_REPEAT_TERM: '同一个前提中出现重复的词项',
  CONCLUS_REPEAT_TERM: '结论中出现重复的词项',
  TERMS_COUNT: '词项数量不是三项',
  ILLEGAL: '三段论结构非法',
  UNKNOWN_FIGURE: '无法确定三段论的格',
}

export default function ArgumentInput({ argument, onSubmit }: Props) {
  const { i18n } = useLanguage()

  const [premise1, setPremise1] = useState<Proposition>({ subject: '程序员', predicate: '人', mood: 'A' })
  const [premise2, setPremise2] = useState<Proposition>({ subject: 'C 程序员', predicate: '程序员', mood: 'A' })
  const [conclusion, setConclusion] = useState<Proposition>({ subject: 'C 程序员', predicate: '人', mood: 'A' })
  const [err, setErr] = useState<string | undefined>()

  useEffect(() => {
    const { major, minor, middle, mood, figure } = argument
    setPremise1({
      subject: [1, 3].includes(figure) ? middle : major,
      predicate: [1, 3].includes(figure) ? major : middle,
      mood: mood[0],
    })
    setPremise2({
      subject: [1, 2].includes(figure) ? minor : middle,
      predicate: [1, 2].includes(figure) ? middle : minor,
      mood: mood[1],
    })
    setConclusion({ subject: minor, predicate: major, mood: mood[2] })
    setErr(undefined)
  }, [argument])

  const conclusionOptions = (() => {
    const p1s = premise1.subject.trim()
    const p1p = premise1.predicate.trim()
    const p2s = premise2.subject.trim()
    const p2p = premise2.predicate.trim()
    if (!(p1s && p1p && p2s && p2p)) return []
    if (p1s === p2s) return p1p === p2p ? [] : [p1p, p2p]
    if (p1s === p2p) return p1p === p2s ? [] : [p1p, p2s]
    if (p1p === p2s) return p1s === p2p ? [] : [p1s, p2p]
    if (p1p === p2p) return p1s === p2s ? [] : [p1s, p2s]
    return []
  })()

  const handleSubmit = () => {
    let p1m = premise1.mood
    let p1s = premise1.subject.trim()
    let p1p = premise1.predicate.trim()
    let p2m = premise2.mood
    let p2s = premise2.subject.trim()
    let p2p = premise2.predicate.trim()
    const cs = conclusion.subject.trim()
    const cp = conclusion.predicate.trim()

    if (!(p1s && p1p && p2s && p2p && cs && cp)) { setErr('INCOMPLETE'); return }
    if (p1s === p1p || p2s === p2p) { setErr('PREMISE_REPEAT_TERM'); return }
    if (cs === cp) { setErr('CONCLUS_REPEAT_TERM'); return }
    if (new Set([p1s, p1p, p2s, p2p, cs, cp]).size !== 3) { setErr('TERMS_COUNT'); return }

    if (![p1s, p1p].includes(cp)) {
      const [ts, tp, tm] = [p1s, p1p, p1m]
      p1s = p2s; p1p = p2p; p1m = p2m
      p2s = ts; p2p = tp; p2m = tm
    }

    let figure: number | undefined
    let middle: string | undefined
    if (p1s === cp) {
      middle = p1p
      if (p1p === p2s) figure = 4
      else if (p1p === p2p) figure = 2
    } else if (p1p === cp) {
      middle = p1s
      if (p1s === p2p) figure = 1
      else if (p1s === p2s) figure = 3
    }
    if (typeof figure === 'undefined') { setErr('UNKNOWN_FIGURE'); return }

    const arg: Argument = {
      major: cp, minor: cs, middle: middle!,
      figure: figure as 1 | 2 | 3 | 4,
      mood: [p1m, p2m, conclusion.mood],
    }
    onSubmit(arg)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full">
          <tbody>
            <PropositionInput mark="∵" value={premise1} onChange={setPremise1} />
            <PropositionInput mark="" value={premise2} onChange={setPremise2} />
            <tr>
              <td colSpan={5} className="px-4 py-2">
                <div className="h-px bg-border" />
              </td>
            </tr>
            <PropositionInput
              mark="∴"
              value={conclusion}
              onChange={setConclusion}
              isConclusion
              terms={conclusionOptions}
            />
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          {i18n.validate}
        </button>
        {err && <span className="text-sm text-destructive">{reasons[err]}</span>}
      </div>
    </div>
  )
}
