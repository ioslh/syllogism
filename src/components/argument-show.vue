<template>
  <div class="rounded-lg border bg-card p-6 space-y-4">
    <div class="space-y-2">
      <proposition-view
        :propsition="majorTerm"
        :subject-role="[1, 3].includes(arg.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MAJOR"
        :predicate-role="[1, 3].includes(arg.figure) ? TERM_ROLE.MAJOR : TERM_ROLE.MIDDLE"
      />
      <proposition-view
        :propsition="minorTerm"
        :subject-role="[1, 2].includes(arg.figure) ? TERM_ROLE.MINOR : TERM_ROLE.MIDDLE"
        :predicate-role="[1, 2].includes(arg.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MINOR"
      />
    </div>
    <div class="h-px bg-border" />
    <proposition-view
      :propsition="conclusionTerm"
      :subject-role="TERM_ROLE.MINOR"
      :predicate-role="TERM_ROLE.MAJOR"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Argument, PropositionType, Proposition } from '@/shared/syllogism'
import { TERM_ROLE } from '@/shared/syllogism'
import PropositionView from './proposition.vue'

const props = defineProps<{ argument: Argument }>()
const arg = computed(() => props.argument)

const majorType = computed<PropositionType>(() => arg.value.mood[0] as PropositionType)
const minorType = computed<PropositionType>(() => arg.value.mood[1] as PropositionType)
const conclusionType = computed<PropositionType>(() => arg.value.mood[2] as PropositionType)

const majorTerm = computed<Proposition>(() => ({
  mood: majorType.value,
  subject: [1, 3].includes(arg.value.figure) ? arg.value.middle : arg.value.major,
  predicate: [1, 3].includes(arg.value.figure) ? arg.value.major : arg.value.middle,
}))

const minorTerm = computed<Proposition>(() => ({
  mood: minorType.value,
  subject: [1, 2].includes(arg.value.figure) ? arg.value.minor : arg.value.middle,
  predicate: [1, 2].includes(arg.value.figure) ? arg.value.middle : arg.value.minor,
}))

const conclusionTerm = computed<Proposition>(() => ({
  mood: conclusionType.value,
  predicate: arg.value.major,
  subject: arg.value.minor,
}))
</script>
