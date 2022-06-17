<template>
  <div class="stage" :class="`language-${language}`">
    <header>
      <h1>{{ i18n.title }}</h1>
      <div class="sub">{{ i18n.subtitle }}</div>
      <div class="space"></div>
      <el-button link @click="language = (language === 'cn' ? 'en' : 'cn')">{{ i18n.language }}</el-button>
    </header>
    <main>
      <the-form />
    </main>
  </div>
</template>

<script setup lang="ts">
import TheForm from './components/the-form.vue'
import { language, i18n } from './translate'
</script>


<style>
* {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}
</style>

<style lang="less">
.stage {
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

footer {
  height: 60px;
  text-align: center;
  a {
    text-decoration: none;
    color: #666;
    font-size: 14px;
  }
}
</style>
