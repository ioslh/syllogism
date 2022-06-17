<template>
  <div class="syllogism" :class="`language-${language}`">
    <header>
      <h1>{{ i18n.title }}</h1>
      <div class="sub">{{ i18n.subtitle }}</div>
      <div class="space"></div>
      <el-button link @click="language = (language === 'cn' ? 'en' : 'cn')">{{ i18n.language }}</el-button>
    </header>
    <main>
      <!-- <card /> -->
      <!-- <all-arguments /> -->
      <the-stage />
    </main>
  </div>
</template>

<script setup lang="ts">
import TheStage from './components/stage.vue'
// import AllArguments from './components/all.vue'
// import Card from './components/card.vue'
import { language, i18n } from './translate'
</script>


<style>
* {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

div {
  box-sizing: border-box;
}

.el-dialog {
  width: 100%;
  height: 80vh;
  bottom: 0;
  margin: 0;
  top: 20vh;
}
</style>

<style scoped lang="less">
.syllogism {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  height: 60px;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafc;
  box-shadow: 0 0 16px -10px #333;
  z-index: 10;
  h1 {
    font-size: 18px;
    margin-right: 10px;
  }
  .sub {
    font-size: 14px;
  }
  .space {
    flex: 1;
  }
}

main {
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
}
</style>
