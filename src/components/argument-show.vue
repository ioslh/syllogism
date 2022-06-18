<template>
  <div class="argument">
    <div class="premises">
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
    <div class="conclusion">
      <proposition-view
        :propsition="conclusionTerm"
        :subject-role="TERM_ROLE.MINOR"
        :predicate-role="TERM_ROLE.MAJOR"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Argument, PropositionType, Proposition } from '@/shared/syllogism'
import { TERM_ROLE } from '@/shared/syllogism'
import PropositionView from './proposition.vue'

const props = defineProps<{
  argument: Argument
}>()

let arg = $computed(() => props.argument)

let majorType = $computed<PropositionType>(() => arg.mood[0] as PropositionType)
let minorType = $computed<PropositionType>(() => arg.mood[1] as PropositionType)
let conclusionType = $computed<PropositionType>(() => arg.mood[2] as PropositionType)

const majorTerm = $computed<Proposition>(() => {
  return {
    mood: majorType,
    subject: [1, 3].includes(arg.figure) ? arg.middle : arg.major,
    predicate: [1, 3].includes(arg.figure) ? arg.major : arg.middle,
  }
})

const minorTerm = $computed<Proposition>(() => {
  return {
    mood: minorType,
    subject: [1, 2].includes(arg.figure) ? arg.minor : arg.middle,
    predicate: [1, 2].includes(arg.figure) ? arg.middle : arg.minor,
  }
})

const conclusionTerm = $computed<Proposition>(() => {
  return {
    mood: conclusionType,
    predicate: arg.major,
    subject: arg.minor,
  }
})


</script>
