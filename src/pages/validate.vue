<template>
  <div class="container max-w-5xl py-8 px-6">
    <div class="flex items-start gap-8">
      <!-- Left: Syllogism input/display -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">
              {{ editing ? i18n.modifySyllogism : i18n.validateSyllogism }}
            </h1>
            <p class="text-sm text-muted-foreground mt-1">{{ i18n.subtitle }}</p>
          </div>
          <button
            v-if="!editing"
            @click="editing = true"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 2 2-10 10-3 1 1-3 10-10z"/>
            </svg>
            {{ i18n.modify }}
          </button>
        </div>

        <argument-input
          v-if="editing"
          :argument="argument"
          @update:argument="onArgumentInput"
        />
        <div v-else class="space-y-6">
          <argument-show :argument="argument" />
          <argument-validation :argument="argument" />
        </div>
      </div>

      <!-- Right: Structure panel -->
      <div class="w-72 shrink-0">
        <div v-if="editing" class="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground leading-relaxed">
          <p class="font-medium text-foreground mb-2">{{ language === 'zh' ? '提示' : 'Tip' }}</p>
          {{ language === 'zh'
            ? '结论中的主项和谓项必须来自前提。两个前提输入完成后，结论中的词项只需选择即可。'
            : 'The subject and predicate in the conclusion must come from the premises. Once both premises are filled in, you can simply select the conclusion terms.' }}
        </div>
        <argument-struct v-else :argument="argument" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { i18n, language } from '@/shared/translate'
import type { Argument } from '@/shared/syllogism'
import ArgumentInput from '@/components/argument-input.vue'
import ArgumentShow from '@/components/argument-show.vue'
import ArgumentStruct from '@/components/argument-struct.vue'
import ArgumentValidation from '@/components/argument-validation.vue'

const tpl: Argument = {
  major: '必死的',
  minor: '希腊人',
  middle: '人',
  mood: ['A', 'A', 'A'],
  figure: 1,
}

const key = 'LOCAL_ARGUMENT'
const getStorageArgument = (): Argument => {
  const ls = localStorage.getItem(key)
  try {
    return ls ? JSON.parse(ls) : tpl
  } catch {
    return tpl
  }
}

const editing = ref(false)
const argument = ref<Argument>(getStorageArgument())

const onArgumentInput = (arg: Argument) => {
  editing.value = false
  argument.value = arg
}

watch(argument, (l) => {
  localStorage.setItem(key, JSON.stringify(l))
}, { deep: true })
</script>
