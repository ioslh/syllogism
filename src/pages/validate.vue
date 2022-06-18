<template>
  <div class="validate">
    <div class="inner">
      <div class="left">
        <argument-input
          v-if="editing"
          :argument="argument"
          @update:argument="onArgumentInput"
        />
        <div v-else>
          <argument-show :argument="argument" />
          <button @click="editing = true">输入直言三段论</button>
        </div>
      </div>
      <div class="right">
        <div v-if="editing" class="tip">结论中的主项和谓项必须来自前提。两个前提输入完成后，结论中的词项只需选择即可</div>
        <argument-struct v-else :argument="argument" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Argument, Mood } from '@/shared/syllogism'
import ArgumentInput from '@/components/argument-input.vue'
import ArgumentShow from '@/components/argument-show.vue'
import ArgumentStruct from '@/components/argument-struct.vue'

const tpl = {
  major: '英雄',
  minor: '士兵',
  middle: '胆小鬼',
  mood: ['E', 'I', 'O'],
  figure: 2,
} as Argument
const key = 'LOCAL_ARGUMENT'
const getStorageArgument = () => {
  const ls = localStorage.getItem(key)
  try {
    return ls ? JSON.parse(ls) : tpl
  } catch(e) {
    return tpl
  }
}
</script>

<script lang="ts" setup>
import { watch } from 'vue'

let editing = $ref(false)
let argument = $ref<Argument>(getStorageArgument())

const onArgumentInput = (arg: Argument) => {
  editing = false
  argument = arg
}

watch($$(argument), (l) => {
  localStorage.setItem(key, JSON.stringify(l))
}, { deep: true })

</script>

<style lang="scss" scoped>
.validate {
  width: 80%;
  min-width: 800px;
  max-width: 1200px;
  margin: auto;
  height: 100%;
  padding-top: 100px;
}

.inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.left {
  padding-right: 20px;
}

.right {
  width: 400px;
  min-height: 200px;
  border-left: 1px solid #ccc;
  padding-left: 20px;
}
</style>