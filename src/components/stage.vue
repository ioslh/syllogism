<template>
  <div class="stage">
    <div class="left">
      <div class="argument-wrapper">
        <argument-show :argument="argument" />
        <div class="control">
          <el-button @click="showEditor = true" type="primary" link>修改</el-button>
        </div>
      </div>
      <div class="state">
        <div class="valid" v-if="validOne">
          {{ validOne.form }}: {{ validOne.name }} 这是一个有效的三段论
        </div>
        <div class="invalid" v-else-if="fallacies.length">
          {{ argument.mood.join('') }}-{{ argument.figure }}: 
          这是一个无效三段论，违反了以下原则：
          <p v-for="p in fallacies" :key="p">{{ p }}</p>
        </div>
      </div>

    </div>
    <div class="right">
      <the-form :argument="argument" />
    </div>
  </div>
  <el-dialog
    title="输入三段论"
    v-model="showEditor"
    width="60%"
  >
    <div class="editor-wrapper">
      <argument-input
        v-if="showEditor"
        :argument="argument"
        @update:argument="onArgumentEdit"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { Argument, Mood } from './syllogism'
import { validSyllogisms, argumentAssert } from './syllogism'
import TheForm from './form.vue'
import ArgumentShow from './argument-show.vue'
import ArgumentInput from './argument-input.vue'

let showEditor = $ref(false)
let argument = $ref<Argument>({
  major: '英雄',
  minor: '士兵',
  middle: '胆小鬼',
  mood: ['E', 'I', 'O'],
  figure: 2,
})

const onArgumentEdit = (arg: Argument) => {
  showEditor = false
  argument = arg
}



const validOne = $computed(() => {
  const key = `${argument.mood.join('')}-${argument.figure}`
  const found = validSyllogisms.find(i => i.form === key)
  return found || null
})

const fallacies = $computed(() => {
  let err: string[] = []
  argumentAssert.forEach(({ fn, desc }) => {
    if (fn(argument.mood.join('') as Mood, argument.figure)) {
      err.push(desc)
    }
  })
  return err
})


</script>

<style lang="less" scoped>
.stage {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}

.left {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.argument-wrapper {
  padding: 40px;
  border-radius: 10px;
  .control {
    opacity: 0;
  }
  &:hover {
    .control {
      opacity: 1;
    }
  }
}

.editor-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.valid {
  text-align: center;
  margin-top: 20px;
  color: #099709;
}

.invalid {
  text-align: center;
  margin-top: 20px;
  color: #f00;
}

.control {
  height: 30px;
  text-align: right;
}

.right {
  width: 400px;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
  align-items: center;
  justify-content: center;
  background-color: #fcfcfc;
}
</style>
