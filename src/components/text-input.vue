<template>
  <input
    class="text"
    :value="content"
    @input="(e: any) => content = e.target.value"
  />
</template>

<script lang="ts" setup>

const props = defineProps<{
  value: string
}>()

const emits = defineEmits(['update:value'])

let content = $computed({
  get: () => props.value,
  set: (v: string) => emits('update:value', v)
})

</script>

<style lang="scss" scoped>
.text {
  border: none;
  border-bottom: 1px solid transparent;
  padding: 4px;
  outline: none;
  transition: border-color .3s;
  &:hover {
    border-color: red;
  }
  &:focus {
    border-color: blue;
  }
}
</style>