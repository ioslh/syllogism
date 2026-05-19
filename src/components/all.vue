<template>
  <div class="p-6">
    <div
      class="flex flex-wrap gap-1"
      :class="active"
    >
      <button
        v-for="a in allArguments"
        :key="a.type"
        :class="genClass(a)"
        @click="activeForm = a"
        class="w-16 h-8 text-xs font-mono font-bold rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {{ a.type }}
      </button>
    </div>

    <!-- Popup detail panel -->
    <transition name="fade">
      <div
        v-if="activeForm"
        class="fixed bottom-8 right-8 w-80 rounded-xl border shadow-xl bg-popover text-popover-foreground overflow-hidden"
        :class="activeForm.valid ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-red-500'"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold">{{ activeForm.type }}</span>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="activeForm.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ activeForm.valid ? i18n.valid : i18n.invalid }}
              </span>
            </div>
            <button
              @click="activeForm = null"
              class="rounded p-1 hover:bg-muted transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 6-12 12M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div v-if="activeForm.fallacies.length" class="space-y-2">
            <p class="text-xs font-medium text-muted-foreground">{{ i18n.commitFallacies }}{{ i18n.colon }}</p>
            <ul class="space-y-2">
              <li v-for="f in activeForm.fallacies" :key="f">
                <p class="text-sm font-semibold">{{ fallacyExplains[f].name }}</p>
                <p class="text-xs text-muted-foreground mt-0.5 line-clamp-3">{{ fallacyExplains[f].detail }}</p>
              </li>
            </ul>
            <div class="pt-2 border-t text-xs text-muted-foreground">
              {{ i18n.source }}{{ i18n.colon }}
              <a :href="i18n.refLink" target="_blank" class="text-primary hover:underline">{{ i18n.refBook }}</a>
            </div>
          </div>

          <div v-else class="text-sm text-green-700">
            {{ language === 'zh' ? '✓ 这是一个有效的三段论形式' : '✓ This is a valid syllogism form' }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { i18n, language } from '@/shared/translate'
import { argumentAssert, fallacyExplains } from '@/shared/syllogism'
import type { Mood, Figure } from '@/shared/syllogism'

const props = defineProps<{ active: string }>()
const emits = defineEmits(['update:active'])

interface ArgumentState {
  type: string
  valid: boolean
  fallacies: string[]
}

const activeForm = ref<ArgumentState | null>(null)
const allArguments = ref<ArgumentState[]>([])

const genClass = (a: ArgumentState) => {
  const base = 'argument'
  if (a.valid) {
    if (props.active === 'VALID') return `${base} bg-green-700 text-white`
    return `${base} text-green-700 hover:bg-green-700 hover:text-white`
  }
  // invalid
  const highlighted = a.fallacies.includes(props.active)
  if (highlighted) return `${base} bg-red-600 text-white`
  return `${base} text-red-600 hover:bg-red-600 hover:text-white`
}

onMounted(() => {
  const types = ['A', 'E', 'I', 'O']
  const figures = [1, 2, 3, 4] as Figure[]
  const l: ArgumentState[] = []
  types.forEach(major => {
    types.forEach(minor => {
      types.forEach(conclusion => {
        figures.forEach(figure => {
          const fallacies: string[] = []
          const mood = `${major}${minor}${conclusion}` as Mood
          let allpassed = true
          argumentAssert.forEach(({ fn, key }) => {
            if (fn(mood, figure)) {
              allpassed = false
              fallacies.push(key)
            }
          })
          l.push({ type: `${mood}-${figure}`, valid: allpassed, fallacies })
        })
      })
    })
  })
  allArguments.value = l
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
