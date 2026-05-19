<template>
  <div
    class="rounded-lg border p-5 animate-fade-in"
    :class="validName
      ? 'border-green-300 bg-green-50'
      : 'border-red-300 bg-red-50'"
  >
    <div class="flex items-center gap-3 mb-1">
      <span class="font-mono font-bold text-base" :class="validName ? 'text-green-700' : 'text-red-700'">
        {{ form }}
      </span>
      <span v-if="validName" class="text-sm font-semibold text-green-700">{{ validName }}</span>
      <span class="text-sm" :class="validName ? 'text-green-800' : 'text-red-800'">
        {{ validName ? i18n.valid : i18n.invalid }}
      </span>
      <div class="ml-auto">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="validName ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ validName ? (language === 'zh' ? '✓ 有效' : '✓ Valid') : (language === 'zh' ? '✗ 无效' : '✗ Invalid') }}
        </span>
      </div>
    </div>

    <div v-if="fallacies.length" class="mt-4 space-y-3">
      <p class="text-sm font-medium text-red-700">{{ i18n.commitFallacies }}{{ i18n.colon }}</p>
      <ol class="space-y-3 pl-4">
        <li v-for="f in fallacies" :key="f.name" class="list-decimal">
          <h5 class="text-sm font-semibold text-red-800">{{ f.name }}</h5>
          <p class="text-xs text-red-700/80 mt-1 leading-relaxed">{{ f.detail }}</p>
        </li>
      </ol>
      <div class="text-right pt-2">
        <a :href="i18n.refLink" target="_blank" class="text-xs text-muted-foreground hover:text-foreground underline">
          《{{ i18n.refBook }}》
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { i18n, language } from '@/shared/translate'
import type { Argument, Mood } from '@/shared/syllogism'
import { validSyllogisms, argumentAssert, fallacyExplains } from '@/shared/syllogism'

const props = defineProps<{ argument: Argument }>()

const form = computed(() => `${props.argument.mood.join('').toUpperCase()}-${props.argument.figure}`)

const validName = computed<string | undefined>(() => {
  const found = validSyllogisms.find(s => s.form === form.value)
  return found?.name
})

const fallacies = computed(() => {
  const text: { name: string; detail: string }[] = []
  const m = props.argument.mood.join('') as Mood
  argumentAssert.forEach(({ fn, key }) => {
    if (fn(m, props.argument.figure)) {
      text.push(fallacyExplains.value[key])
    }
  })
  return text
})
</script>
