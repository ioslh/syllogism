<template>
  <h1>src/components/radio-group.vue</h1>
</template>

<script lang="ts" setup>
interface Option {
  value: string
  label: string
}

const props = defineProps<{
  options: Option[]
}>()
</script>

<style lang="scss" scoped>

</style>