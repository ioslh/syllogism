<template>
  <div class="validation" :class="validName ? 'valid' : 'invalid'">
    <div class="overview">
      <span class="form">{{ form }}{{ i18n.colon }}</span>
      <span v-if="validName" class="name">{{ validName }}{{ i18n.comma }}</span>
      <span v-if="validName">{{ i18n.valid }}</span>
      <span v-else>{{ i18n.invalid }}</span>
    </div>
    <div class="fallacies" v-if="fallacies.length">
      <p>{{ i18n.commitFallacies }}{{ i18n.colon }}</p>
      <ol>
        <li v-for="f in fallacies" :key="f.name">
          <h5>{{ f.name }}</h5>
          <p>{{ f.detail }}</p>
        </li>
      </ol>
      <div class="ref">
        <a target="_blank" :href="i18n.refLink">&lt;&lt;{{ i18n.refBook }}&gt;&gt;</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { i18n } from '@/shared/translate'
import type { Argument, Mood } from '@/shared/syllogism'
import { validSyllogisms, argumentAssert, fallacyExplains } from '@/shared/syllogism'

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
  const text: { name: string, detail: string }[] = []
  const m = props.argument.mood.join('') as Mood
  argumentAssert.forEach(({ fn, key }) => {
    if (fn(m, props.argument.figure)) {
      text.push(fallacyExplains.value[key])
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
    padding-left: 20px;
    li {
      margin: 20px 0;
    }
    h5 {
      font-size: 16px;
    }
    p {
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
  }
}

.ref {
  text-align: right;
  a {
    color: #4d65ab;
  }
}
</style>