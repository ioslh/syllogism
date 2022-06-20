<template>
  <div class="layout">
    <header>
      <h2>{{ i18n.title }}</h2>
      <div class="nav">
        <a
          v-for="m in menus"
          :key="m.link"
          :class="{ active: active === m.link }"
          @click="active = m.link"
        >{{ m.text }}</a>
      </div>
      <div class="space"></div>
      <a class="github" href="https://github.com/ioslh/syllogism" target="_blank">GitHub</a>
      <a class="language" @click="language = (language === 'en' ? 'zh' : 'en')">
        {{ language === 'en' ? '中文' : 'English' }}
      </a>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { language, i18n } from '@/shared/translate'

const route = useRoute()
const router = useRouter()

let active = $computed({
  get: () => route.path.split('/')[1],
  set: (v) => {
    router.push(`/${v}`)
  }
})

let menus = $computed(() => {
  const isEn = language.value === 'en'
  return [
    {
      link: 'validate',
      text: isEn ? 'Validate' : '验证',
    },
    {
      link: 'fallacies',
      text: isEn ? 'Fallacies' : '谬误',
    },
  ]

})

</script>

<style lang="scss" scoped>

$header-height: 60px;
.layout {
  width: 100vw;
  height: 100vh;
}

header {
  height: $header-height;
  // background: #eee;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  h2 {
    font-size: 18px;
  }
  .space {
    flex: 1;
  }
}

.nav {
  margin-left: 20px;
  a {
    cursor: pointer;
    margin: 0 6px;
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
    color: #888;
    transition: color .3s;
    &.active {
      color: #ed5ca3;
    }
  }
}

.github {
  color: #a0abb2;
}

.language {
  cursor: pointer;
}

main {
  height: calc(100vh - $header-height);
  // background: red;
}
</style>