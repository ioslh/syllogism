<template>
  <div>
    <table class="argument">
      <tbody>
        <proposition-input
          v-model:value="premise1"
          mark="∵"
        />
        <proposition-input
          v-model:value="premise2"
          mark=""
        />
        <tr >
          <td colspan="5" class="sep"><hr/></td>
        </tr>
        <proposition-input
          v-model:value="conclusion"
          is-conclusion
          :terms="conclusionOptions"
          mark="∴"
        />
      </tbody>
    </table>
    <div class="control">
      <button @click="onSubmit">验证</button>
    </div>
    <div class="error" v-if="err">
      {{ reasons[err] }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Proposition, type PropositionType, type Argument, type Mood } from '@/shared/syllogism'
import PropositionInput from './proposition-input.vue'
import { onMounted } from 'vue'

const props = defineProps<{
  argument: Argument
}>()

const emits = defineEmits(['update:argument'])

let premise1 = $ref<Proposition>({
  subject: '程序员',
  predicate: '人',
  mood: 'A' as PropositionType
})

let premise2 = $ref<Proposition>({
  subject: 'C 程序员',
  predicate: '程序员',
  mood: 'A' as PropositionType
})

let conclusion = $ref<Proposition>({
  subject: 'C 程序员',
  predicate: '人',
  mood: 'A' as PropositionType
})

const conclusionOptions = $computed(() => {
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
})

const reasons = {
  INCOMPLETE: '三段论内容不完整',
  PREMISE_REPEAT_TERM: '同一个前提中出现重复的词项',
  CONCLUS_REPEAT_TERM: '结论中出现重复的词项',
  TERMS_COUNT: '词项数量不是三项',
  ILLEGAL: '三段论结构非法',
  UNKNOWN_FIGURE: '无法确定三段论的格',
} as Record<string, string>

let err = $ref<string | undefined>()

const onSubmit = (): Argument | undefined => {
  let p1m = premise1.mood
  let p1s = premise1.subject.trim()
  let p1p = premise1.predicate.trim()
  let p2m = premise2.mood
  let p2s = premise2.subject.trim()
  let p2p = premise2.predicate.trim()
  const cs = conclusion.subject.trim()
  const cp = conclusion.predicate.trim()
  if (!(p1s && p1p && p2s && p2p && cs && cp)) {
    err = 'INCOMPLETE'
    return
  }
  if (p1s === p1p || p2s === p2p) {
    err = 'PREMISE_REPEAT_TERM'
    return
  }
  if (cs === cp) {
    err = 'CONCLUS_REPEAT_TERM'
    return
  }
  // 词项数量不为 3，非法三段论
  if (new Set([p1s, p1p, p2s, p2p, cs, cp]).size !== 3) {
    err = 'TERMS_COUNT'
    return
  }
  // 转换三段论标准格式
  if (![p1s, p1p].includes(cp)) {
    const [ts, tp, tm] = [p1s, p1p, p1m]
    p1s = p2s;
    p1p = p2p;
    p1m = p2m;
    p2s = ts;
    p2p = tp;
    p2m = tm;
  }

  let figure
  let middle
  // 检查格
  if (p1s === cp) {
    middle = p1p
    if (p1p === p2s) figure = 4
    else if (p1p === p2p) figure = 2
  } else if (p1p === cp) {
    middle = p1s
    if (p1s === p2p) figure = 1
    else if (p1s === p2s) figure = 3
  } else {
    // 两个前提中都没有出现结论中的词项，非法三段论
  }
  // 格无法确定
  if (typeof figure === 'undefined') {
    err = 'UNKNOWN_FIGURE'
    return
  }

  const arg = {
    major: cp,
    minor: cs,
    middle,
    figure,
    mood: [p1m, p2m, conclusion.mood],
  } as Argument
  emits('update:argument', arg)
}

const toText = (p: Proposition) => {
  if (p.mood === 'A') {
    return `All ${p.subject} is ${p.predicate}`
  }
  if (p.mood === 'E') {
    return `No ${p.subject} is ${p.predicate}`
  }
  if (p.mood === 'I') {
    return `Some ${p.subject} is ${p.predicate}`
  }
  if (p.mood === 'O') {
    return `Some ${p.subject} is not ${p.predicate}`
  }
}

onMounted(() => {
  const { major, minor, middle, mood, figure } = props.argument
  premise1 = {
    subject: [1, 3].includes(figure) ? middle : major,
    predicate: [1, 3].includes(figure) ? major : middle,
    mood: mood[0]
  }

  premise2 = {
    subject: [1, 2].includes(figure) ?  minor : middle,
    predicate: [1, 2].includes(figure) ? middle : minor,
    mood: mood[1],
  }

  conclusion = {
    subject: minor,
    predicate: major,
    mood: mood[2],
  }

  err = undefined
})
</script>

<style lang="scss" scoped>

.argument {
  :deep(td) {
    padding: 6px 4px;
  }
  :deep(td:first-child) {
    padding-left: 20px;
  }
  :deep(td:last-child) {
    padding-right: 20px;
  }
  td.sep {
    padding: 10px 0;
    hr {
      border: none;
      border-top: 1px solid #ccc;
    }
  }
}


.control {
  text-align: left;
  margin-top: 20px;
  button {
    border: none;
    outline: none;
    background-color: #2080f0;
    font-size: 14px;
    cursor: pointer;
    color: #fff;
    padding: 0 16px;
    height: 26px;
    border-radius: 2px;
    transition: background-color .3s;
    &:hover {
      background-color: #4098fc;
    }
    &:active, &:focus {
      background-color: #1060c9;
    }
  }
}

.error {
  text-align: center;
  color: #f00;
  margin-top: 16px;
}

</style>