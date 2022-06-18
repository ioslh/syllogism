<template>
  <div>
    <all-syllogisms v-model:active="activeForm" />
  </div>
</template>

<script lang="ts" setup>
import AllSyllogisms from '@/components/all.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const FORM_PATN = /^[AEIO]{3}-[1234]$/i

let activeForm = $computed<string>({
  get: () => (route.params.form as string || '').toUpperCase(),
  set: (v: string) => {
    if (FORM_PATN.test(v)) {
      router.push(`/forms/${v}`)
    }
  }
})

</script>

<style lang="scss" scoped>

</style>