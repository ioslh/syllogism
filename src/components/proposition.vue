<template>
  <div class="flex flex-wrap items-baseline gap-1 text-2xl font-bold leading-snug text-muted-foreground">
    <span>{{ quantifierText }}</span>
    <span class="rounded px-1.5 py-0.5 text-xl" :style="styles[subjectRole]">{{ propsition.subject }}</span>
    <span class="text-muted-foreground">{{ qualityText }}</span>
    <span class="rounded px-1.5 py-0.5 text-xl" :style="styles[predicateRole]">{{ propsition.predicate }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { quantity, quality, Quantifier, Quality, TERM_ROLE } from '@/shared/syllogism'
import type { Proposition } from '@/shared/syllogism'
import { i18n } from '@/shared/translate'

const { propsition, subjectRole, predicateRole } = defineProps<{
  propsition: Proposition
  subjectRole: TERM_ROLE
  predicateRole: TERM_ROLE
}>()

const quantifierText = computed(() => {
  if (quantity[propsition.mood] === Quantifier.PARTICULAR) return i18n.value.some
  return quality[propsition.mood] === Quality.AFFITMATIVE ? i18n.value.all : i18n.value.no
})

const qualityText = computed(() => {
  if (quantity[propsition.mood] === Quantifier.UNIVERSAL) {
    return quality[propsition.mood] === Quality.AFFITMATIVE ? i18n.value.allis : i18n.value.is
  }
  return quality[propsition.mood] === Quality.AFFITMATIVE ? i18n.value.is : i18n.value.isnot
})

const styles = {
  [TERM_ROLE.MAJOR]: { color: 'rgb(190 18 60)', background: 'rgb(254 205 211)', fontWeight: '900' },
  [TERM_ROLE.MINOR]: { color: 'rgb(180 83 9)', background: 'rgb(254 243 199)', fontWeight: '900' },
  [TERM_ROLE.MIDDLE]: { color: 'rgb(88 28 135)', background: 'rgb(233 213 255)', fontWeight: '900' },
}
</script>
