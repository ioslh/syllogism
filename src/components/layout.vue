<template>
  <div class="layout">
    <header>
      <h2>Categorical Syllogism</h2>
      <div class="nav">
        <a
          v-for="m in menus"
          :key="m.link"
          :class="{ active: active === m.link }"
          @click="active = m.link"
        >{{ m.text }}</a>
      </div>
      <div class="space"></div>
      <div class="language">English</div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()


let active = $computed({
  get: () => route.path.split('/')[1],
  set: (v) => {
    router.push(`/${v}`)
  }
})

const menus = [
  {
    link: 'validate',
    text: 'Validate',
  },
  {
    link: 'fallacies',
    text: 'Fallacies',
  },
  {
    link: 'forms',
    text: 'Forms',
  },
]

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

main {
  height: calc(100vh - $header-height);
  // background: red;
}
</style>