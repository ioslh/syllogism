<template>
  <div class="rounded-lg border bg-card p-4 space-y-3">
    <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {{ language === 'zh' ? '结构' : 'Structure' }}
    </h3>
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground w-12">{{ i18n.major }}</span>
        <input
          class="flex-1 h-8 px-2 text-sm rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :value="argument.major"
          @input="(e) => argument.major = (e.target as HTMLInputElement).value"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground w-12">{{ i18n.minor }}</span>
        <input
          class="flex-1 h-8 px-2 text-sm rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :value="argument.minor"
          @input="(e) => argument.minor = (e.target as HTMLInputElement).value"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground w-12">{{ i18n.middle }}</span>
        <input
          class="flex-1 h-8 px-2 text-sm rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          :value="argument.middle"
          @input="(e) => argument.middle = (e.target as HTMLInputElement).value"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground w-12">{{ i18n.mood }}</span>
        <div class="flex gap-1">
          <select
            v-for="(m, idx) in argument.mood"
            :key="idx"
            :value="m"
            @change="(e) => { const next = [...argument.mood] as [any,any,any]; next[idx] = (e.target as HTMLSelectElement).value; argument.mood = next }"
            class="h-8 px-1 text-sm font-mono rounded border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option v-for="opt in ['A','E','I','O']" :key="opt" :value="opt" :selected="opt === m">{{ opt }}</option>
          </select>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground w-12">{{ i18n.figure }}</span>
        <div class="flex gap-1">
          <button
            v-for="f in figures"
            :key="f.value"
            @click="argument.figure = f.value"
            class="h-8 px-3 text-sm rounded border transition-colors"
            :class="f.value === argument.figure
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-input bg-background text-foreground hover:bg-muted'"
          >{{ f.label }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Argument, Figure } from '@/shared/syllogism'
import { i18n, language } from '@/shared/translate'

const props = defineProps<{ argument: Argument }>()

const figures = computed(() => {
  return [1, 2, 3, 4].map((t) => ({
    label: i18n.value[`figure${t}`],
    value: t as Figure,
  }))
})
</script>
