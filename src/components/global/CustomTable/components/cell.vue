<script lang='ts'>
import { defineComponent, h, PropType, ref, watchEffect } from 'vue'
interface Params {
  row:object,
  index:number,
  column?:object
}
export default defineComponent({
  name: 'Cell',
  inheritAttrs: false,
  props: {
    render: {
      type: Function as PropType<(h, params) => void>,
      default: () => {}
    },
    row: {
      type: Object as PropType<Object>,
      default: {}
    },
    index: {
      type: Number as PropType<number>,
      default: null
    },
    column: {
      type: Object as PropType<Object>,
      default: {}
    }
  },

  setup(props, ctx) {
    const params = ref<Params>({
      row: props.row,
      index: props.index,
      column: props.column
    })

    watchEffect(() => {
      params.value.row = props.row
      params.value.index = props.index
      params.value.column = props.column
    })
    return () => props.render(h, params.value)
  }
})
</script>
