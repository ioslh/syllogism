<template>
  <div class="content">
    <div class="left">
      <div>
        <el-form :model="form" label-width="120px">
          <el-form-item :label="i18n.major">
            <el-input v-model="form.major" />
          </el-form-item>
          <el-form-item :label="i18n.minor">
            <el-input v-model="form.minor" />
          </el-form-item>
          <el-form-item :label="i18n.middle">
            <el-input v-model="form.middle" />
          </el-form-item>
          <el-form-item :label="i18n.mood">
            <div class="moods">
              <el-select v-model="form.mood[0]" size="small">
                <el-option
                  v-for="m in moodOptions"
                  :key="m"
                  :label="m"
                  :value="m"
                />
              </el-select>
              <el-select v-model="form.mood[1]" size="small">
                <el-option
                  v-for="m in moodOptions"
                  :key="m"
                  :label="m"
                  :value="m"
                />
              </el-select>
              <el-select v-model="form.mood[2]" size="small">
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
            <el-radio-group v-model="form.figure">
              <el-radio-button v-for="item in figures" :key="item.label" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="argument" :class="validOne ? 'valid' : ''">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import PropositionView from './proposition.vue'
import { validSyllogisms, getQuantifier, getQuality, Quantifier, Quality, TERM_ROLE, type Proposition, type PropositionType } from './syllogism'
import { i18n } from '../translate'

const moodOptions = ['A', 'E', 'I', 'O']

const form = reactive({
  major: '英雄',
  minor: '士兵',
  middle: '胆小鬼',
  mood: ['E', 'I', 'O'],
  figure: 2,
})

const figures = $computed(() => {
  return [1, 2, 3, 4].map((t, i) => ({
    label: i18n.value[`figure${t}`],
    value: t,
  }))
})

let majorType = $computed<PropositionType>(() => form.mood[0] as PropositionType)
let minorType = $computed<PropositionType>(() => form.mood[1] as PropositionType)
let conclusionType = $computed<PropositionType>(() => form.mood[2] as PropositionType)

const majorTerm = $computed<Proposition>(() => {
  return {
    quantifier: getQuantifier(majorType),
    quality: getQuality(majorType),
    subject: [1, 3].includes(form.figure) ? form.middle : form.major,
    predicate: [1, 3].includes(form.figure) ? form.major : form.middle,
  }
})

const minorTerm = $computed<Proposition>(() => {
  return {
    quantifier: getQuantifier(minorType),
    quality: getQuality(minorType),
    subject: [1, 2].includes(form.figure) ? form.minor : form.middle,
    predicate: [1, 2].includes(form.figure) ? form.middle : form.minor,
  }
})

const conclusionTerm = $computed<Proposition>(() => {
  return {
    quantifier: getQuantifier(conclusionType),
    quality: getQuality(conclusionType),
    predicate: form.major,
    subject: form.minor,
  }
})

const validOne = $computed(() => {
  const key = `${form.mood.join('')}-${form.figure}`
  const found = validSyllogisms.find(i => i.form === key)
  return found || null
})

</script>

<style lang="less" scoped>
.content {
  display: flex;
  width: 100%;
  height: 100%;
}

.left {
  width: 460px;
  display: flex;
  align-items: center;
}

.moods {
  display: flex;
  :deep(.el-input__wrapper) {
    border: none;
  }
}

.right {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

.argument {
  padding: 20px;
  border: 1px solid transparent;
  transition: all .3s;
  &.valid {
    border: 1px solid #379110;
    border-radius: 6px;
    background: #ceffb9;
  }
}

.valid-tip {
  padding: 6px 20px;
  border-radius: 4px;
}
</style>

<style>
  .language-cn .conclusion > div::before {
    content: '所以';
  }
  .language-en .conclusion > div::before {
    content: 'Thus';
  }
</style>