<template>
  <table class="form">
    <tbody>
      <tr>
        <td>{{ i18n.major }}</td>
        <td><text-input v-model:value="argument.major" /></td>
      </tr>
      <tr>
        <td>{{ i18n.minor }}</td>
        <td><text-input v-model:value="argument.minor" /></td>
      </tr>
      <tr>
        <td>{{ i18n.middle }}</td>
        <td><text-input v-model:value="argument.middle" /></td>
      </tr>
      <tr>
        <td>{{ i18n.mood }}</td>
        <td>
          <div class="moods">
            
            <!-- <el-select v-model="argument.mood[0]" size="small">
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
            </el-select> -->
          </div>
        </td>
      </tr>
      <tr>
        <td>{{ i18n.figure }}</td>
        <td>
          <div class="figures">
            <span
              v-for="f in figures"
              :key="f.value"
              @click="props.argument.figure = f.value"
              :class="{ active: f.value === props.argument.figure }"
            >{{ f.label }}</span>
          </div>
          <!-- <el-radio-group v-model="argument.figure">
            <el-radio-button v-for="item in figures" :key="item.label" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group> -->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue'
import type { Argument, Figure } from '@/shared/syllogism'
import { i18n } from '@/shared/translate'
import TextInput from '@/components/text-input.vue'

const props = defineProps<{
  argument: Argument
}>()


const figures = $computed(() => {
  return [1, 2, 3, 4].map((t, i) => ({
    label: i18n.value[`figure${t}`],
    value: t as Figure,
  }))
})

const moodOptions = ['A', 'E', 'I', 'O']



</script>

<style lang="scss" scoped>
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

.figures {
  display: flex;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid #eee;
  span {
    flex: 1;
    text-align: center;
    cursor: pointer;
    padding: 0 4px;
    border-right: 1px solid #eee;
    &:last-child {
      border-right: none;
    }
    &.active {
      background: blue;
      color: #fff;
    }
  }
}

</style>