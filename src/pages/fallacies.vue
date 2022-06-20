<template>
  <div class="page">
    <div class="fallacies">
      <ul>
        <li class="valid" :class="activeFallacy === 'VALID' ? 'active' : ''" @click="activeFallacy = 'VALID'">
          {{ i18n.validForms }}
        </li>
        <li
          v-for="ast in argumentAssert"
          :key="ast.key"
          @click="activeFallacy = ast.key"
          class="invalid"
          :class="activeFallacy === ast.key ? 'active' : ''"
        >
          {{ fallacyExplains[ast.key].name }}
        </li>
      </ul>
    </div>
    <div class="forms">
      <all-syllogisms v-model:active="activeFallacy" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AllSyllogisms from '@/components/all.vue'
import { useRoute, useRouter } from 'vue-router'
import { i18n } from '@/shared/translate'
import { argumentAssert, fallacyExplains } from '@/shared/syllogism'

const route = useRoute()
const router = useRouter()

// const FORM_PATN = /^[AEIO]{3}-[1234]$/i

let activeFallacy = $computed<string>({
  get: () => (route.params.fallacy as string || '').toUpperCase(),
  set: (v: string) => {
    if (v) {
      router.push(`/fallacies/${v}`)
    } else {
      router.push('/fallacies')
    }
  }
})

</script>

<style lang="scss" scoped>
.page {
  display: flex;
  padding: 20px 60px;
  height: 100%;
  overflow: auto;
}

.fallacies {
  flex: 200px 0 0;
  border-right: 1px solid #eee;
  li {
    list-style: none;
    padding: 10px 20px;
    &:hover {
      background: #eee;
      cursor: pointer;
    }
    &.active {
      &.valid {
        background: #b6efb6;
        color: #0b8c1d;
      }
      &.invalid {
        background: #fde0e0;
        color: #a70606;
      }
    }
  }
}
</style>