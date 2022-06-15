<template>
  <div class="proposition">
    <span class="quantifier">{{ quantifier }}</span>
    <span class="term subject" :style="styles[subjectRole]">{{ propsition.subject }}</span>
    <span class="copula">{{ quality }}</span>
    <span class="term predicate" :style="styles[predicateRole]">{{ propsition.predicate }}</span>
  </div>
</template>

<script lang="ts" setup>
import { Proposition, PropositionType, Quantifier, Quality, TERM_ROLE } from './syllogism'
import { i18n } from '../translate'

const { propsition } = defineProps<{
  propsition: Proposition
  subjectRole: TERM_ROLE
  predicateRole: TERM_ROLE
}>()

const quantifier = $computed(() => {
  if (propsition.quantifier === Quantifier.PARTICULAR) return i18n.value.some
  return propsition.quality === Quality.AFFITMATIVE ? i18n.value.all : i18n.value.no
})

const quality = $computed(() => {
  if (propsition.quantifier === Quantifier.UNIVERSAL) {
    return propsition.quality === Quality.AFFITMATIVE ? i18n.value.allis : i18n.value.is
  }
  return propsition.quality === Quality.AFFITMATIVE ? i18n.value.is : i18n.value.isnot
})

const majorStyle = {
  color: '#f00',
}

const minorStyle = {
  color: '#0f0',
}

const middleStyle = {
  color: '#00f',
}

const styles = {
  [TERM_ROLE.MAJOR]: majorStyle,
  [TERM_ROLE.MINOR]: minorStyle,
  [TERM_ROLE.MIDDLE]: middleStyle,
}

</script>

<style lang="less" scoped>
.proposition {
  font-size: 40px;
  font-weight: 900;
}

.term {

}

.quantifier {
  color: #581;
  margin-right: 4px;
}

.copula {
  color: #888;
  margin: 0 4px;
}
</style>