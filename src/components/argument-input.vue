<template>
  <div>
    <table class="argument">
      <tbody>
        <proposition-input
          v-model:value="premise1"
        />
        <proposition-input
          v-model:value="premise2"
        />
        <tr >
          <td colspan="4" class="sep"><hr/></td>
        </tr>
        <proposition-input
          v-model:value="conclusion"
          is-conclusion
          :terms="conclusionOptions"
        />
      </tbody>
    </table>
    <button @click="onSubmit">确定</button>
  </div>

  <div style="margin-top: 100px">
    <p>{{ toText(premise1) }}</p>
    <p>{{ toText(premise2) }}</p>
    <p>{{ toText(conclusion) }}</p>
  </div>
</template>

<script lang="ts" setup>
import { type Proposition, type PropositionType, type Argument, type Mood } from './syllogism'
import PropositionInput from './proposition-input.vue'
import { onMounted } from 'vue'

const props = defineProps<{
  value: Argument
}>()

const emits = defineEmits(['update:value'])

const premise1 = $ref<Proposition>({
  subject: '程序员',
  predicate: '人',
  mood: 'A' as PropositionType
})

const premise2 = $ref<Proposition>({
  subject: 'C 程序员',
  predicate: '程序员',
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

const conclusion = $ref<Proposition>({
  subject: 'C 程序员',
  predicate: '人',
  mood: 'A' as PropositionType
})

const onSubmit = (): Argument | undefined => {
  let p1m = premise1.mood
  let p1s = premise1.subject.trim()
  let p1p = premise1.predicate.trim()
  let p2m = premise2.mood
  let p2s = premise2.subject.trim()
  let p2p = premise2.predicate.trim()
  const cs = conclusion.subject.trim()
  const cp = conclusion.predicate.trim()
  if (!(p1s && p1p && p2s && p2p && cs && cp)) return
  if (p1s === p1p) return
  if (p2s === p2p) return
  if (cs === cp) return
  // 词项数量不为 3，非法三段论
  if (new Set([p1s, p1p, p2s, p2p, cs, cp]).size !== 3) return
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
  if (typeof figure === 'undefined') return

  const arg = {
    major: cp,
    minor: cs,
    middle,
    figure,
    mood: `${p1m}${p2m}${conclusion.mood}` as Mood
  } as Argument
  console.log(arg)
  emits('update:value', arg)
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

onMounted(() => [
  // premise1
  // premise2
  // conclusion
])
</script>

<style lang="less" scoped>

.argument {
  td {
    padding: 0 4px;
  }
  :deep(td:first-child) {
    padding-left: 20px;
  }
  :deep(td:last-child) {
    padding-right: 20px;
  }
  td.sep {
    padding: 4px 0;
    hr {
      border: none;
      border-top: 1px solid #ccc;
    }
  }
}


</style>