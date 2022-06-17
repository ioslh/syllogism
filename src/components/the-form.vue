<template>
  <div class="content">
    <div class="left">
      <!-- <div class="argument" :class="validOne ? 'valid' : ''">
        <div class="premises">
          <proposition-view
            :propsition="majorTerm"
            :subject-role="[1, 3].includes(form.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MAJOR"
            :predicate-role="[1, 3].includes(form.figure) ? TERM_ROLE.MAJOR : TERM_ROLE.MIDDLE"
          />
          <proposition-view
            :propsition="minorTerm"
            :subject-role="[1, 2].includes(form.figure) ? TERM_ROLE.MINOR : TERM_ROLE.MIDDLE"
            :predicate-role="[1, 2].includes(form.figure) ? TERM_ROLE.MIDDLE : TERM_ROLE.MINOR"
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
      <div class="valid-tip" v-if="validOne">
        <el-icon color="#379110"><circle-check-filled  /></el-icon>
        {{ validOne.form }}: {{ validOne.name }}, {{ i18n.valid }}
      </div>
      <div class="falacies" v-if="falacies.length">
        <p v-for="f in falacies" :key="f">{{ f }}</p>
      </div> -->
      <argument-input v-model:value="argument" />
    </div>
    <div class="right">
      <div>
        <el-form :model="argument" label-width="120px">
          <el-form-item :label="i18n.major">
            <el-input v-model="argument.major" />
          </el-form-item>
          <el-form-item :label="i18n.minor">
            <el-input v-model="argument.minor" />
          </el-form-item>
          <el-form-item :label="i18n.middle">
            <el-input v-model="argument.middle" />
          </el-form-item>
          <el-form-item :label="i18n.mood">
            <div class="moods">
              <el-select v-model="argument.mood[0]" size="small">
                <el-option
                  v-for="m in moodOptions"
                  :key="m"
                  :label="m"
                  :value="m"
                />
              </el-select>
              <el-select v-model="argument.mood[1]" size="small">
                <el-option
                  v-for="m in moodOptions"
                  :key="m"
                  :label="m"
                  :value="m"
                />
              </el-select>
              <el-select v-model="argument.mood[2]" size="small">
                <el-option
                  v-for="m in moodOptions"
                  :key="m"
                  :label="m"
                  :value="m"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :label="i18n.figure">
            <el-radio-group v-model="argument.figure">
              <el-radio-button v-for="item in figures" :key="item.label" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import PropositionView from './proposition.vue'
import ArgumentInput from './argument-input.vue'
import { runFallacyCheck, validSyllogisms, getQuantifier, getQuality, Quantifier, Quality, TERM_ROLE, type Proposition, type PropositionType, type Mood, type Figure, type Argument } from './syllogism'
import { i18n } from '../translate'

const moodOptions = ['A', 'E', 'I', 'O']

const argument = $ref<Argument>({
  major: '英雄',
  minor: '士兵',
  middle: '胆小鬼',
  mood: 'EIO',
  figure: 2,
})

const figures = $computed(() => {
  return [1, 2, 3, 4].map((t, i) => ({
    label: i18n.value[`figure${t}`],
    value: t,
  }))
})

let majorType = $computed<PropositionType>(() => argument.mood[0] as PropositionType)
let minorType = $computed<PropositionType>(() => argument.mood[1] as PropositionType)
let conclusionType = $computed<PropositionType>(() => argument.mood[2] as PropositionType)

const majorTerm = $computed<Proposition>(() => {
  return {
    mood: majorType,
    subject: [1, 3].includes(argument.figure) ? argument.middle : argument.major,
    predicate: [1, 3].includes(argument.figure) ? argument.major : argument.middle,
  }
})

const minorTerm = $computed<Proposition>(() => {
  return {
    mood: minorType,
    subject: [1, 2].includes(argument.figure) ? argument.minor : argument.middle,
    predicate: [1, 2].includes(argument.figure) ? argument.middle : argument.minor,
  }
})

const conclusionTerm = $computed<Proposition>(() => {
  return {
    mood: conclusionType,
    predicate: argument.major,
    subject: argument.minor,
  }
})

const validOne = $computed(() => {
  const key = `${argument.mood}-${argument.figure}`
  const found = validSyllogisms.find(i => i.form === key)
  return found || null
})

const falacies = $computed<string[]>(() => {
  const text: string[] = []
  const mood = argument.mood

  // predicates.forEach(({ fn, desc }) => {
  //   if (fn(mood as Mood, argument.figure as Figure)) {
  //     text.push(desc)
  //   }
  // })
  return text
})


onMounted(() => {
  runFallacyCheck()
})

</script>

<style lang="less" scoped>
.content {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.left {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.moods {
  display: flex;
  :deep(.el-input__wrapper) {
    border: none;
  }
}

.right {
  width: 400px;
  border-left: 1px solid #eee;
  padding: 20px 0;
}



.argument {
  padding: 20px;
  border: 1px solid transparent;
  transition: all .3s;
  &.valid {
    border: 1px solid #379110;
    border-radius: 6px;
    background: #f3ffee;
  }
  .premises {
    padding: 10px 40px 10px 100px;
    & > div {
      margin: 6px 0;
    }
  }

  .conclusion {
    margin-top: 10px;
    padding: 10px 40px 10px 100px;
    border-top: 1px solid #aaa;
    & > div {
      position: relative;
      &::before {
        padding-right: 10px;
        display: block;
        position: absolute;
        right: 100%;
        white-space: nowrap;
        color: #aaa;
      }
    }
  }

}

.valid-tip {
  padding: 6px 20px;
  border-radius: 4px;
}
</style>

<style>
  /* .language-cn .conclusion > div::before {
    content: '所以';
  }
  .language-en .conclusion > div::before {
    content: 'Thus';
  } */
</style>