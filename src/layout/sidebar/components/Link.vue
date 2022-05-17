
<template>
  <!-- eslint-disable vue/require-component-is -->
  <div @click="linkProps">
    <slot />
  </div>
</template>

<script lang='ts'>
import { isExternal } from '@/utils/regular'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const linkProps = () => {
      router.push({ path: props.to })
    }
    return {
      linkProps
    }
  }
})

</script>
