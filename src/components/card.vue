<template>
  <div class="background">
    <div class="content">
      <div class="name">
        <h1>EIO-4</h1>
      </div>
      <div class="detail">
        <div class="valibility">
          <h3>有效性</h3>
          <p>这是一个有效的直言三段论。</p>
        </div>
        <div class="format">
          <h3>格式</h3>
          <div></div>
        </div>
        <div class="violate">
          <h3>违反了如下规则：</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

</script>

<style lang="less" scoped>
.background {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 30px 0 0;
}

.content {
  width: 80%;
  min-width: 800px;
  margin: auto;
  display: flex;
  padding: 50px;
  height: 100%;
  box-shadow: 0 0 20px -15px #333;
  border-top: 1px solid #eee;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.name {
  width: 200px;
  h1 {
    font-size: 40px;
  }
}

.detail {
  flex: 1;
}
</style>