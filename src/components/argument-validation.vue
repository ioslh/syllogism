<template>
  <div class="validation" :class="validName ? 'valid' : 'invalid'">
    <div class="overview">
      <span class="form">{{ form }}: </span>
      <span v-if="validName" class="name">{{ validName }}, </span>
      <span v-if="validName">这是一个有效的三段论。</span>
      <span v-else>这是一个无效的三段论。</span>
    </div>
    <div class="fallacies" v-if="fallacies.length">
      <h5>违反了以下原则：</h5>
      <ol>
        <li v-for="f in fallacies" :key="f">{{ f }}</li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Argument, Mood } from '@/shared/syllogism'
import { validSyllogisms, argumentAssert } from '@/shared/syllogism'

const props = defineProps<{
  argument: Argument
}>()

const form = $computed(() => {
  const mood = props.argument.mood.join('').toUpperCase()
  return `${mood}-${props.argument.figure}`
})

const validName = $computed<string | undefined>(() => {
  const found = validSyllogisms.find(s => s.form === form)
  return found ? found.name : undefined
})


let fallacies = $computed(() => {
  const text: string[] = []
  const m = props.argument.mood.join('') as Mood
  argumentAssert.forEach(({ fn, desc }) => {
    if (fn(m, props.argument.figure)) {
      text.push(desc)
    }
  })
  return text
})
</script>

<style lang="scss" scoped>
.validation {
  margin-top: 60px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 6px;
  .form {
    font-weight: bold;
  }
  &.valid {
    border-color: #297d08;
    background: #eeffee;
    .form {
      color: #297d08;
    }
  }

  &.invalid {
    border-color: #ba0000;
    background: #ffeaea;
    .form {
      color: #ba0000;
    }
  }
}

.fallacies {
  margin-top: 20px;
  ol {
    list-style: inside;
  }
}
</style>