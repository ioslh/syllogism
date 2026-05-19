<template>
  <div class="flex h-full overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-56 shrink-0 border-r overflow-y-auto py-4">
      <div class="px-3 mb-2">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {{ language === 'zh' ? '分类' : 'Categories' }}
        </p>
      </div>
      <nav class="space-y-0.5 px-2">
        <button
          class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeFallacy === 'VALID'
            ? 'bg-green-100 text-green-800'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          @click="activeFallacy = 'VALID'"
        >
          {{ i18n.validForms }}
        </button>
        <button
          v-for="ast in argumentAssert"
          :key="ast.key"
          @click="activeFallacy = ast.key"
          class="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeFallacy === ast.key
            ? 'bg-red-100 text-red-800'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          {{ fallacyExplains[ast.key].name }}
        </button>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 overflow-auto">
      <all-syllogisms v-model:active="activeFallacy" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AllSyllogisms from '@/components/all.vue'
import { useRoute, useRouter } from 'vue-router'
import { i18n, language } from '@/shared/translate'
import { argumentAssert, fallacyExplains } from '@/shared/syllogism'

const route = useRoute()
const router = useRouter()

const activeFallacy = computed<string>({
  get: () => (route.params.fallacy as string || '').toUpperCase(),
  set: (v: string) => {
    if (v) {
      router.push(`/fallacies/${v}`)
    } else {
      router.push('/fallacies')
    }
  }
})
</script>
