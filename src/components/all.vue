<template>
  <div class="arguments">
    <div
      v-for="a in allArguments"
      :key="a.type"
      class="argument"
      :class="{ valid: a.valid, invalid: !a.valid, active: activeForm === a.type }"
      @click="activeForm = a.type"
    >
      {{ a.type }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { argumentAssert } from '@/shared/syllogism'
import type { Mood, Figure } from '@/shared/syllogism'

const props = defineProps<{
  active: string
}>()

const emits = defineEmits(['update:active'])

let activeForm = $computed({
  get: () => props.active,
  set: (v) => emits('update:active', v)
})

const types = ['A', 'E', 'I', 'O']
const figures = [1, 2, 3, 4] as Figure[]

interface ArgumentState {
  type: string
  valid: boolean
  fallacies: number[]
}

let allArguments = $ref<ArgumentState[]>([])


onMounted(() => {
  const l: ArgumentState[] = []
  types.map(major => {
    types.map(minor => {
      types.map(conclusion => {
        figures.map(figure => {
          const mood = `${major}${minor}${conclusion}` as Mood
          let allpassed = true
          argumentAssert.map(({ fn }) => {
            if (fn(mood, figure)) {
              allpassed = false
            }
          })
          l.push({
            type: `${mood}-${figure}`,
            valid: allpassed,
            fallacies: []
          })
        })
      })
    })
  })
  allArguments = l
})

</script>

<style lang="scss" scoped>
.arguments {
  height: 100%;
  overflow: auto;
  padding: 40px 20px;
  text-align: center;
}
.argument {
  display: inline-block;
  font-weight: bold;
  padding: 4px;
  border-radius: 4px;
  margin: 8px;
  width: 80px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all .3s;
  &.valid {
    background: #dff5df;
    border-color: #24a924;
    color: #22a924;
    &:hover, &.active {
      background: #24a924;
      border-color: #24a924;
      color: #fff;
    }
  }
  &.invalid {
    background: #fae6e6;
    border-color: #e0a7a7;
    color: #760808;
    &:hover, &.active {
      border-color: #760808;
      background: #760808;
      color: #fff;
    }
  }
}
</style>