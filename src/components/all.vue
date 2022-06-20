<template>
  <div
    class="arguments"
    :class="active"
  >
    <div
      v-for="a in allArguments"
      :key="a.type"
      :class="genClass(a)"
      @click="activeForm = a"
    >
      {{ a.type }}
    </div>

    <div v-if="activeForm" class="select-form">
      <div class="name">{{ activeForm.type }}{{ i18n.colon }}{{ activeForm.valid ? i18n.valid : i18n.invalid }}</div>
      <div v-if="activeForm.fallacies.length">
        <p>{{ i18n.commitFallacies }}{{ i18n.colon }}</p>
        <ul>
          <li v-for="f in activeForm.fallacies">
            <h4>{{ fallacyExplains[f].name }}</h4>
            <p>{{ fallacyExplains[f].detail }}</p>
          </li>
        </ul>
        <div class="ref">
          {{ i18n.source }}{{ i18n.colon }}
          <a :href="i18n.refLink">&lt;&lt;{{ i18n.refBook }}&gt;&gt;</a>
        </div>
      </div>
      <div class="control"><a @click="activeForm = null">关闭</a></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { i18n } from '@/shared/translate'
import { argumentAssert, fallacyExplains } from '@/shared/syllogism'
import type { Mood, Figure } from '@/shared/syllogism'

const props = defineProps<{
  active: string
}>()

const emits = defineEmits(['update:active'])


const genClass = (a: ArgumentState) => {
  const cls = [...a.fallacies, 'argument']
  cls.push(a.valid ? 'valid' : 'invalid')
  return cls
}

let activeForm = $ref<ArgumentState | null>(null)

const types = ['A', 'E', 'I', 'O']
const figures = [1, 2, 3, 4] as Figure[]

interface ArgumentState {
  type: string
  valid: boolean
  fallacies: string[]
}

let allArguments = $ref<ArgumentState[]>([])


onMounted(() => {
  const l: ArgumentState[] = []
  types.map(major => {
    types.map(minor => {
      types.map(conclusion => {
        figures.map(figure => {
          const fallacies: string[] = []
          const mood = `${major}${minor}${conclusion}` as Mood
          let allpassed = true
          argumentAssert.map(({ fn, key }) => {
            if (fn(mood, figure)) {
              allpassed = false
              fallacies.push(key)
            }
          })
          l.push({
            type: `${mood}-${figure}`,
            valid: allpassed,
            fallacies,
          })
        })
      })
    })
  })
  allArguments = l
})

</script>

<style lang="scss" scoped>
$highlight-color: #c42323;
$text-color: #fff;
.arguments {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;

  &.UNDISTRIBUTE_MIDDLE {
    .UNDISTRIBUTE_MIDDLE {
      background: $highlight-color;
      color: $text-color;
    }
  }

  &.ILLICIT_PROCESS {
    .ILLICIT_PROCESS {
      background: $highlight-color;
      color: $text-color;
    }
  }
  &.TWO_NEGATIVE {
    .TWO_NEGATIVE {
      background: $highlight-color;
      color: $text-color;
    }
  }
  &.NEGATIVE_CONCLUSION {
    .NEGATIVE_CONCLUSION {
      background: $highlight-color;
      color: $text-color;
    }
  }
  &.EXISTENTIAL {
    .EXISTENTIAL {
      background: $highlight-color;
      color: $text-color;
    }
  }

  &.VALID {
    .valid {
      background: #0a7a0a;
      color: #fff;
    }
  }
}



.argument {
  flex: 6.25% 0 0;
  height: 30px;
  display: inline-block;
  font-weight: bold;
  font-size: 12px;
  padding: 0 2px;
  height: 30px;
  line-height: 30px;
  width: 60px;
  text-align: center;
  cursor: pointer;
  transition: all .3s;
    &.valid {
      color: #0a7a0a;
      &:hover, &.active {
        background: #0a7a0a;
        color: #fff;
      }
    }
    &.invalid {
      color: $highlight-color;
      &:hover, &.active {
        background: $highlight-color;
        color: #fff;
      }
    }
}

.select-form {
  position: fixed;
  bottom: 60px;
  right: 40px;
  width: 300px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 20px -10px #333;
  ul {
    padding-left: 20px;
    li {
      margin: 10px 0;
    }
    h4 {
      font-size: 14px;
      color: #000;
    }
    p {
      font-size: 14px;
      color: #999;
    }
  }

  .control {
    text-align: center;
    margin-top: 16px;
    a {
      cursor: pointer;
      text-decoration: underline;
      color: blue;
    }
  }
}
</style>