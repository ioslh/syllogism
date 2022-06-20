<template>
  <tr class="proposition">
    <td class="mark">{{ mark }}</td>
    <td>
      <select
        @change="(e: any) => quantifier = e.target.value"
        class="quantifier"
      >
        <option
          v-for="q in quantifiers"
          :key="q.value"
          :value="q.value"
          :selected="q.value === quantifier"
        >{{ q.label }}</option>
      </select>
    </td>
    <td>
      <select
        class="subject"
        v-if="isConclusion"
        :placeholder="i18n.premiseFirst"
        @change="onChangeConclusionSubject"
      >
        <option
          v-for="t in conclusionTerms"
          :key="t.value"
          :value="t.value"
          :disabled="t.disabled"
          :selected="t.value === subject"
        >{{ t.label }}</option>
      </select>
      <input v-else class="subject" :placeholder="i18n.subject" :value="subject" @input="(e: any) => subject = e.target.value" />
    </td>
    <td>
      <select @change="(e: any) => copula = e.target.value" class="copula">
        <option
          v-for="q in qualities"
          :key="q.value"
          :value="q.value"
          :disabled="q.disabled"
          :selected="q.value === copula"
        >
          {{ q.label }}
        </option>
      </select>

    </td>
    <td>
      <select
        v-if="isConclusion"
        class="predicate"
        :placeholder="i18n.premiseFirst"
        @change="onChangeConclusionPredicate"
      >
        <option
          v-for="t in conclusionTerms"
          :key="t.value"
          :value="t.value"
          :disabled="t.disabled"
          :selected="t.value === predicate"
        >{{ t.label }}</option>
      </select>
      <input v-else class="predicate" :placeholder="i18n.predicate" :value="predicate" @input="(e: any) => predicate = e.target.value" />
    </td>
  </tr>
</template>

<script lang="ts" setup>
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

const quantifiers = [
  {
    label: i18n.value.all,
    value: 'all',
  },
  {
    label: i18n.value.no,
    value: 'no',
  },
  {
    label: i18n.value.some,
    value: 'some',
  },
] as Array<{ label: string, value: InputQuantifierType }>

let proposition = $computed<Proposition>({
  get() {
    return props.value
  },
  set(v) {
    emit('update:value', v)
  }
})

let subject = $computed({
  get() {
    return proposition.subject
  },
  set(s: string) {
    // console.log('perform set subject', s)
    proposition = {
      ...proposition,
      subject: s,
    }
  }
})


let predicate = $computed({
  get() {
    return proposition.predicate
  },
  set(p: string) {
    // console.log('perform set predicate', p)
    proposition = {
      ...proposition,
      predicate: p,
    }
  }
})

let mood = $computed({
  get() {
    return proposition.mood
  },
  set(m: PropositionType) {
    proposition = {
      ...proposition,
      mood: m,
    }
  }
})


let quantifier = $computed<InputQuantifierType>({
  get() {
    const m = proposition.mood
    switch(m) {
      case 'A':
        return 'all'
      case 'E':
        return 'no'
      default:
        return 'some'
    }
  },
  set(q: InputQuantifierType) {
    switch(q) {
      case 'all':
        return mood = 'A'
      case 'no':
        return mood = 'E'
      case 'some':
        if (copula === 'is') {
          return mood = 'I'
        } else {
          return mood = 'O'
        }
    }
  }
})

let copula = $computed<InputCopulaType>({
  get() {
    return proposition.mood === 'O' ? 'isnot' : 'is'
  },
  set(c: InputCopulaType) {
    const m = proposition.mood
    if (c === 'is' && m === 'O') {
      mood = 'I'
    } else if (c === 'isnot' && m === 'I') {
      mood = 'O'
    }
  }
})

let conclusionTerms = $computed(() => {
  return props.terms && props.terms.length ? props.terms.map(t => ({
    label: t,
    value: t,
    disabled: false,
  })) : [
    {
      label: i18n.value.premiseFirst,
      value: '__noop',
      disabled: true,
    }
  ]
})

let qualities = $computed(() => {
  if (['no', 'all'].includes(quantifier)) {
    copula = 'is'
    return [
      {
        label: quantifier === 'all' ? i18n.value.allis : i18n.value.is,
        value: 'is',
      },
      {
        label: i18n.value.isnot,
        value: 'isnot',
        disabled: true,
      }
    ]
  }
  return [
    {
      label: i18n.value.is,
      value: 'is',
    },
    {
      label: i18n.value.isnot,
      value: 'isnot',
    }
  ]
})


const onChangeConclusionSubject = (e: any) => {
  const p: Partial<Proposition> = {}
  const next = e.target.value
  p.subject = next
  if (props.terms && props.terms.length === 2) {
    const [a, b] = props.terms
    p.predicate = next === a ? b : a
  }

  proposition = {
    ...proposition,
    ...p,
  }
}
const onChangeConclusionPredicate = (e: any) => {
  const p: Partial<Proposition> = {}
  const next = e.target.value
  p.predicate = next
  if (props.terms && props.terms.length === 2) {
    const [a, b] = props.terms
    p.subject = next === a ? b : a
  }

  proposition = {
    ...proposition,
    ...p,
  }
}
</script>

<style lang="scss" scoped>
.proposition {
  select, input {
    outline: none;
    font-size: 26px;
  }
  input {
    padding: 7px 8px;
    width: 150px;
    border: none;
    border-bottom: 2px solid transparent;
    transition: border-color .3s;
    &:hover {
      border-color: #ccc;
    }
    &:focus {
      border-color: #000;
    }
  }
  select {
    padding: 6px 0;
    text-align: right;
    border: 2px solid transparent;
    border-radius: 4px;
    &:hover {
      border-color: #ccc;
    }
    &:focus {
      border-color: #000;
    }
  }
  .predicate, .subject {
    text-align: left;
  }
}

.mark {
  font-size: 36px;
  font-weight: bold;
  color: #888;
}

.quantifier {
  color: #888;
}

.subject, .predicate {
  font-weight: bold;
  color: #43b92e;
}



.copula {
  color: #888;
}
</style>