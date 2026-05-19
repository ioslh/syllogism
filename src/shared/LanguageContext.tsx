import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { i18nText } from './translate'

type Lang = 'zh' | 'en'

interface LanguageContextValue {
  lang: Lang
  i18n: Record<string, string>
  toggleLang: () => void
}

const LANG_KEY = 'SYLLOGISM_LANG'

const getInitLang = (): Lang => {
  const l = localStorage.getItem(LANG_KEY)
  return l === 'en' ? 'en' : 'zh'
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'zh',
  i18n: i18nText.zh,
  toggleLang: () => {},
})

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(getInitLang)

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem(LANG_KEY, next)
      return next
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, i18n: i18nText[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
