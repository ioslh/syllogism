<template>
  <div class="mood-select">
    <select
      v-for="(m, index) in moods"
      :key="index"
      @change="(e: any) => onMoodChange(e.target.value, index)"
    >
      <option
        v-for="opt in options"
        :key="opt"
        :selected="opt === m"
      >{{ opt }}</option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import type { PropositionType } from '@/shared/syllogism'

const options = ['A', 'E', 'I', 'O'] as PropositionType[]

const props = defineProps<{
  value: [PropositionType, PropositionType, PropositionType]
}>()

const emits = defineEmits(['update:value'])

let moods = $computed<[PropositionType, PropositionType, PropositionType]>({
  get: () => props.value,
  set: v => emits('update:value', v)
})

const onMoodChange = (v: PropositionType, idx: number) => {
  const next = [...moods] as [PropositionType, PropositionType, PropositionType]
  next[idx] = v
  moods = next
}
</script>

<style lang="scss" scoped>
.mood-select {
  select {
    border: 2px solid transparent;
    outline: none;
    &:hover {
      border-color: #eee;
    }
  }
}
</style>