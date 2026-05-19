<template>
  <tr class="group">
    <td class="pl-4 pr-2 py-3 text-2xl font-bold text-muted-foreground w-10">{{ mark }}</td>
    <td class="py-3 px-1">
      <select
        :value="quantifier"
        @change="(e) => onQuantifierChange((e.target as HTMLSelectElement).value as InputQuantifierType)"
        class="h-10 text-base bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-muted-foreground cursor-pointer"
      >
        <option v-for="q in quantifiers" :key="q.value" :value="q.value">{{ q.label }}</option>
      </select>
    </td>
    <td class="py-3 px-1">
      <select
        v-if="isConclusion"
        :value="subject"
        @change="onChangeConclusionSubject"
        class="h-10 text-base font-bold bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors cursor-pointer text-rose-700"
      >
        <option v-for="t in conclusionTerms" :key="t.value" :value="t.value" :disabled="t.disabled">{{ t.label }}</option>
      </select>
      <input
        v-else
        :value="subject"
        :placeholder="i18n.subject"
        @input="(e) => subject = (e.target as HTMLInputElement).value"
        class="h-10 w-36 text-base font-bold bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-rose-700 placeholder:text-muted-foreground/40"
      />
    </td>
    <td class="py-3 px-1">
      <select
        :value="copula"
        @change="(e) => onCopulaChange((e.target as HTMLSelectElement).value as InputCopulaType)"
        class="h-10 text-base bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-muted-foreground cursor-pointer"
      >
        <option v-for="q in qualities" :key="q.value" :value="q.value" :disabled="q.disabled">{{ q.label }}</option>
      </select>
    </td>
    <td class="py-3 px-1 pr-4">
      <select
        v-if="isConclusion"
        :value="predicate"
        @change="onChangeConclusionPredicate"
        class="h-10 text-base font-bold bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors cursor-pointer text-rose-700"
      >
        <option v-for="t in conclusionTerms" :key="t.value" :value="t.value" :disabled="t.disabled">{{ t.label }}</option>
      </select>
      <input
        v-else
        :value="predicate"
        :placeholder="i18n.predicate"
        @input="(e) => predicate = (e.target as HTMLInputElement).value"
        class="h-10 w-36 text-base font-bold bg-transparent border-0 border-b-2 border-transparent hover:border-muted focus:border-primary outline-none transition-colors text-rose-700 placeholder:text-muted-foreground/40"
      />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { i18n } from '@/shared/translate'
import { type Proposition, type PropositionType } from '@/shared/syllogism'

const props = defineProps<{
  mark: string
  value: Proposition
  isConclusion?: boolean
  terms?: string[]
}>()
const emit = defineEmits(['update:value'])

type InputQuantifierType = 'all' | 'no' | 'some'
type InputCopulaType = 'is' | 'isnot'

const quantifiers = computed(() => [
  { label: i18n.value.all, value: 'all' },
  { label: i18n.value.no, value: 'no' },
  { label: i18n.value.some, value: 'some' },
] as Array<{ label: string; value: InputQuantifierType }>)

const proposition = computed<Proposition>({
  get: () => props.value,
  set: (v) => emit('update:value', v),
})

const subject = computed({
  get: () => proposition.value.subject,
  set: (s: string) => { proposition.value = { ...proposition.value, subject: s } },
})

const predicate = computed({
  get: () => proposition.value.predicate,
  set: (p: string) => { proposition.value = { ...proposition.value, predicate: p } },
})

const mood = computed({
  get: () => proposition.value.mood,
  set: (m: PropositionType) => { proposition.value = { ...proposition.value, mood: m } },
})

const quantifier = computed<InputQuantifierType>(() => {
  const m = proposition.value.mood
  if (m === 'A') return 'all'
  if (m === 'E') return 'no'
  return 'some'
})

const copula = computed<InputCopulaType>(() => {
  return proposition.value.mood === 'O' ? 'isnot' : 'is'
})

const onQuantifierChange = (q: InputQuantifierType) => {
  if (q === 'all') mood.value = 'A'
  else if (q === 'no') mood.value = 'E'
  else if (q === 'some') {
    mood.value = copula.value === 'is' ? 'I' : 'O'
  }
}

const onCopulaChange = (c: InputCopulaType) => {
  const m = proposition.value.mood
  if (c === 'is' && m === 'O') mood.value = 'I'
  else if (c === 'isnot' && m === 'I') mood.value = 'O'
}

const conclusionTerms = computed(() => {
  return props.terms && props.terms.length
    ? props.terms.map(t => ({ label: t, value: t, disabled: false }))
    : [{ label: i18n.value.premiseFirst, value: '__noop', disabled: true }]
})

const qualities = computed(() => {
  if (['no', 'all'].includes(quantifier.value)) {
    return [
      { label: quantifier.value === 'all' ? i18n.value.allis : i18n.value.is, value: 'is' },
      { label: i18n.value.isnot, value: 'isnot', disabled: true },
    ]
  }
  return [
    { label: i18n.value.is, value: 'is' },
    { label: i18n.value.isnot, value: 'isnot' },
  ]
})

const onChangeConclusionSubject = (e: Event) => {
  const next = (e.target as HTMLSelectElement).value
  const p: Partial<Proposition> = { subject: next }
  if (props.terms && props.terms.length === 2) {
    const [a, b] = props.terms
    p.predicate = next === a ? b : a
  }
  proposition.value = { ...proposition.value, ...p }
}

const onChangeConclusionPredicate = (e: Event) => {
  const next = (e.target as HTMLSelectElement).value
  const p: Partial<Proposition> = { predicate: next }
  if (props.terms && props.terms.length === 2) {
    const [a, b] = props.terms
    p.subject = next === a ? b : a
  }
  proposition.value = { ...proposition.value, ...p }
}
</script>
