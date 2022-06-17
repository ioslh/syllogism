<template>
  <div class="stage">
    <div class="left">
      <div class="argument-wrapper">
        <div class="editor">edit</div>
        <argument-show :argument="argument" />
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
import type { Argument } from './syllogism'
import TheForm from './form.vue'
import ArgumentShow from './argument-show.vue'
import ArgumentInput from './argument-input.vue'

let showEditor = $ref(true)
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
  &:hover {
    background: #fafafc;
  }
}

.editor-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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