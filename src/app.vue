<template>
  <div class="stage" :class="`language-${language}`">
    <header>
      <h1>{{ i18n.title }}</h1>
      <el-button link @click="language = (language === 'cn' ? 'en' : 'cn')">{{ i18n.language }}</el-button>
    </header>
    <main>
      <the-form />
    </main>
    <footer>
      <div>GitHub</div>
    </footer>
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
  font-family: 'Noto Sans SC', sans-serif;
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
  h1 {
    font-size: 16px;
  }
}

main {
  flex: 1;
  overflow: hidden;
  padding: 0 36px;
}
</style>
