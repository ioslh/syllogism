<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { badgeVariants } from '.'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface Props extends /* @vue-ignore */ HTMLAttributes {
  variant?: VariantProps<typeof badgeVariants>['variant']
  class?: string
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<template>
  <div :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template>
