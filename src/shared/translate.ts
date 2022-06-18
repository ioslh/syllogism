import { computed, ref } from 'vue'

const i18nText = {
  cn: {
    title: "三段论",
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
  },
  en: {
    title: "Syllogism",
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
  }
} as Record<string, Record<string, string>>

export const language = ref('cn')

export const i18n = computed(() => i18nText[language.value])
