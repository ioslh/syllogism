<script setup lang="ts">
import { cn } from '@/lib/utils'
const props = defineProps<{
  class?: string
  modelValue?: string
  options: { label: string; value: string; disabled?: boolean }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <select
    :value="props.modelValue"
    @change="(e) => emit('update:modelValue', (e.target as HTMLSelectElement).value)"
    :class="cn(
      'flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    v-bind="$attrs"
  >
    <option
      v-for="opt in props.options"
      :key="opt.value"
      :value="opt.value"
      :disabled="opt.disabled"
      :selected="opt.value === props.modelValue"
    >{{ opt.label }}</option>
  </select>
</template>
