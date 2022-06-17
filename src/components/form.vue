<template>
  <table class="form">
    <tbody>
      <tr>
        <td>{{ i18n.major }}</td>
        <td><el-input v-model="argument.major" /></td>
      </tr>
      <tr>
        <td>{{ i18n.minor }}</td>
        <td><el-input v-model="argument.minor" /></td>
      </tr>
      <tr>
        <td>{{ i18n.middle }}</td>
        <td><el-input v-model="argument.middle" /></td>
      </tr>
      <tr>
        <td>{{ i18n.mood }}</td>
        <td>
          <div class="moods">
            <el-select v-model="argument.mood[0]" size="small">
              <el-option
                v-for="m in moodOptions"
                :key="m"
                :label="m"
                :value="m"
              />
            </el-select>
            <el-select v-model="argument.mood[1]" size="small">
              <el-option
                v-for="m in moodOptions"
                :key="m"
                :label="m"
                :value="m"
              />
            </el-select>
            <el-select v-model="argument.mood[2]" size="small">
              <el-option
                v-for="m in moodOptions"
                :key="m"
                :label="m"
                :value="m"
              />
            </el-select>
          </div>
        </td>
      </tr>
      <tr>
        <td>{{ i18n.figure }}</td>
        <td>
          <el-radio-group v-model="argument.figure">
            <el-radio-button v-for="item in figures" :key="item.label" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue'
import type { Argument } from './syllogism'
import { i18n } from '../translate'


const props = defineProps<{
  argument: Argument
}>()

const figures = $computed(() => {
  return [1, 2, 3, 4].map((t, i) => ({
    label: i18n.value[`figure${t}`],
    value: t,
  }))
})

const moodOptions = ['A', 'E', 'I', 'O']



</script>

<style lang="less" scoped>
.moods {
  display: flex;
  :deep(.el-input__wrapper) {
    border: none;
  }
}

.form {
  td {
    padding: 4px 2px;
  }
  td:first-child {
    word-break: keep-all;
    white-space: nowrap;
    color: #888;
    font-size: 14px;
  }
}

</style>