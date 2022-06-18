<template>
  <div class="layout">
    <header>
      <h2>Categorical Syllogism</h2>
      <div class="nav">
        <router-link to="/validate">Validate</router-link>
        <router-link to="/fallacies">Fallacies</router-link>
        <router-link to="/forms">Forms</router-link>
      </div>
      <div class="space"></div>
      <div class="language">English</div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

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
    margin: 0 6px;
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
    color: #888;
    transition: color .3s;
    &.router-link-active {
      color: #ed5ca3;
    }
  }
}

main {
  height: calc(100vh - $header-height);
  // background: red;
}
</style>