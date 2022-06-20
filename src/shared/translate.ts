import { computed, ref, watch } from 'vue'

const i18nText = {
  zh: {
    title: "直言三段论",
    subtitle: '验证，生成，解释',
    language: "English",
    major: '大项',
    minor: '小项',
    middle: '中项',
    mood: '式',
    figure: '格',
    figure1: '一',
    figure2: '二',
    figure3: '三',
    figure4: '四',
    all: '所有的',
    no: '没有',
    some: '有',
    allis: '都是',
    is: '是',
    isnot: '不是',
    valid: '这是一个有效的三段论',
    invalid: '这是一个无效的三段论',
    colon: '：',
    comma: '，',
    commitFallacies: '触犯了如下谬误',
    modify: '修改',
    modifySyllogism: '修改直言三段论',
    validate: '验证',
    validateSyllogism: '验证直言三段论',
    refBook: '逻辑学导论',
    refLink: 'https://book.douban.com/subject/26267406/',
    subject: '主项',
    predicate: '谓项',
    premiseFirst: '请正确输入前提',
  },
  en: {
    title: "Categorical Syllogism",
    subtitle: 'Validate, generate, and explain',
    language: "中文",
    major: 'Major Term',
    minor: 'Minor Term',
    middle: 'Middle Term',
    mood: 'Mood',
    figure: 'Figure',
    figure1: '1st',
    figure2: '2nd',
    figure3: '3rd',
    figure4: '4th',
    all: 'ALL ',
    no: 'NO ',
    some: 'SOME ',
    allis: ' ARE ',
    is: ' ARE ',
    isnot: ' ARE NOT ',
    valid: 'This is a valid syllogism',
    invalid: 'This is an invalid syllogism',
    colon: ': ',
    comma: ', ',
    commitFallacies: 'Commits following fallacies',
    modify: 'Update',
    modifySyllogism: 'UPDATE CATEGORICAL SYLLOGISM',
    validate: 'Validate',
    validateSyllogism: 'VALIDATION of CATEGORICAL SYLLOGISM',
    refBook: 'Introduction to Logic',
    refLink: 'https://www.amazon.com/Introduction-Logic-Irving-M-Copi/dp/1292024828',
    subject: 'Subject term',
    predicate: 'Predicate term',
    premiseFirst: 'Finish premise first',
  }
} as Record<string, Record<string, string>>

const key = 'SYLLOGISM_LANG'
const getInitLanguage = (): string => {
  let l = localStorage.getItem(key) as string
  return ['zh', 'en'].includes(l) ? l : 'zh'
}

export const language = ref(getInitLanguage())
watch(language, v => {
  localStorage.setItem(key, v)
})

export const i18n = computed(() => i18nText[language.value])
