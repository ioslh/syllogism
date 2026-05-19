import { useState, useEffect } from 'react'
import { useLanguage } from '@/shared/LanguageContext'
import type { Argument } from '@/shared/syllogism'
import ArgumentInput from '@/components/ArgumentInput'
import ArgumentShow from '@/components/ArgumentShow'
import ArgumentStruct from '@/components/ArgumentStruct'
import ArgumentValidation from '@/components/ArgumentValidation'

const tpl: Argument = {
  major: '必死的',
  minor: '希腊人',
  middle: '人',
  mood: ['A', 'A', 'A'],
  figure: 1,
}

const STORAGE_KEY = 'LOCAL_ARGUMENT'

const getStorageArgument = (): Argument => {
  const ls = localStorage.getItem(STORAGE_KEY)
  try {
    return ls ? JSON.parse(ls) : tpl
  } catch {
    return tpl
  }
}

export default function ValidatePage() {
  const { lang, i18n } = useLanguage()
  const [editing, setEditing] = useState(false)
  const [argument, setArgument] = useState<Argument>(getStorageArgument)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(argument))
  }, [argument])

  const onArgumentSubmit = (arg: Argument) => {
    setEditing(false)
    setArgument(arg)
  }

  return (
    <div className="container max-w-5xl py-8 px-6">
      <div className="flex items-start gap-8">
        {/* Left: Syllogism input/display */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {editing ? i18n.modifySyllogism : i18n.validateSyllogism}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{i18n.subtitle}</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 2 2-10 10-3 1 1-3 10-10z" />
                </svg>
                {i18n.modify}
              </button>
            )}
          </div>

          {editing ? (
            <ArgumentInput argument={argument} onSubmit={onArgumentSubmit} />
          ) : (
            <div className="space-y-6">
              <ArgumentShow argument={argument} />
              <ArgumentValidation argument={argument} />
            </div>
          )}
        </div>

        {/* Right: Structure panel */}
        <div className="w-72 shrink-0">
          {editing ? (
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground mb-2">{lang === 'zh' ? '提示' : 'Tip'}</p>
              {lang === 'zh'
                ? '结论中的主项和谓项必须来自前提。两个前提输入完成后，结论中的词项只需选择即可。'
                : 'The subject and predicate in the conclusion must come from the premises. Once both premises are filled in, you can simply select the conclusion terms.'}
            </div>
          ) : (
            <ArgumentStruct argument={argument} onChange={setArgument} />
          )}
        </div>
      </div>
    </div>
  )
}
