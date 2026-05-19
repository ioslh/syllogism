<template>
  <div class="space-y-4">
    <div class="rounded-lg border bg-card overflow-hidden">
      <table class="w-full">
        <tbody>
          <proposition-input v-model:value="premise1" mark="∵" />
          <proposition-input v-model:value="premise2" mark="" />
          <tr>
            <td colspan="5" class="px-4 py-2">
              <div class="h-px bg-border" />
            </td>
          </tr>
          <proposition-input
            v-model:value="conclusion"
            is-conclusion
            :terms="conclusionOptions"
            mark="∴"
          />
        </tbody>
      </table>
    </div>

    <div class="flex items-center gap-3">
      <button
        @click="onSubmit"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        {{ i18n.validate }}
      </button>
      <span v-if="err" class="text-sm text-destructive">{{ reasons[err] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { type Proposition, type PropositionType, type Argument } from '@/shared/syllogism'
import PropositionInput from './proposition-input.vue'
import { i18n } from '@/shared/translate'

const props = defineProps<{ argument: Argument }>()
const emits = defineEmits(['update:argument'])

const premise1 = ref<Proposition>({ subject: '程序员', predicate: '人', mood: 'A' })
const premise2 = ref<Proposition>({ subject: 'C 程序员', predicate: '程序员', mood: 'A' })
const conclusion = ref<Proposition>({ subject: 'C 程序员', predicate: '人', mood: 'A' })

const conclusionOptions = computed(() => {
  const p1s = premise1.value.subject.trim()
  const p1p = premise1.value.predicate.trim()
  const p2s = premise2.value.subject.trim()
  const p2p = premise2.value.predicate.trim()
  if (!(p1s && p1p && p2s && p2p)) return []
  if (p1s === p2s) return p1p === p2p ? [] : [p1p, p2p]
  if (p1s === p2p) return p1p === p2s ? [] : [p1p, p2s]
  if (p1p === p2s) return p1s === p2p ? [] : [p1s, p2p]
  if (p1p === p2p) return p1s === p2s ? [] : [p1s, p2s]
  return []
})

const reasons: Record<string, string> = {
  INCOMPLETE: '三段论内容不完整',
  PREMISE_REPEAT_TERM: '同一个前提中出现重复的词项',
  CONCLUS_REPEAT_TERM: '结论中出现重复的词项',
  TERMS_COUNT: '词项数量不是三项',
  ILLEGAL: '三段论结构非法',
  UNKNOWN_FIGURE: '无法确定三段论的格',
}

const err = ref<string | undefined>()

const onSubmit = () => {
  let p1m = premise1.value.mood
  let p1s = premise1.value.subject.trim()
  let p1p = premise1.value.predicate.trim()
  let p2m = premise2.value.mood
  let p2s = premise2.value.subject.trim()
  let p2p = premise2.value.predicate.trim()
  const cs = conclusion.value.subject.trim()
  const cp = conclusion.value.predicate.trim()
  if (!(p1s && p1p && p2s && p2p && cs && cp)) { err.value = 'INCOMPLETE'; return }
  if (p1s === p1p || p2s === p2p) { err.value = 'PREMISE_REPEAT_TERM'; return }
  if (cs === cp) { err.value = 'CONCLUS_REPEAT_TERM'; return }
  if (new Set([p1s, p1p, p2s, p2p, cs, cp]).size !== 3) { err.value = 'TERMS_COUNT'; return }
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
  if (typeof figure === 'undefined') { err.value = 'UNKNOWN_FIGURE'; return }
  const arg: Argument = {
    major: cp, minor: cs, middle: middle!,
    figure: figure as 1 | 2 | 3 | 4,
    mood: [p1m, p2m, conclusion.value.mood],
  }
  emits('update:argument', arg)
}

onMounted(() => {
  const { major, minor, middle, mood, figure } = props.argument
  premise1.value = {
    subject: [1, 3].includes(figure) ? middle : major,
    predicate: [1, 3].includes(figure) ? major : middle,
    mood: mood[0]
  }
  premise2.value = {
    subject: [1, 2].includes(figure) ? minor : middle,
    predicate: [1, 2].includes(figure) ? middle : minor,
    mood: mood[1],
  }
  conclusion.value = { subject: minor, predicate: major, mood: mood[2] }
  err.value = undefined
})
</script>
