<template>
  <g :transform="'translate(' + [startX, 0] + ')'">
    <g>
      <rect :width="endX - startX" :height="height" fill="none"
            stroke="black" :stroke-width=strokeWidth></rect>
    </g>
    <g :transform="'translate(' + [0, 2] + ')'">
      <rect :width="endX - startX" :height="height / 2 - 1" :fill="'url(#grad-inputMapSpeed-' + task.task_id + ')'"
            stroke="none" stroke-width="0"></rect>
    </g>
    <g :transform="'translate(' + [0, height / 2 + 1] + ')'">
      <rect :width="endX - startX" :height="height / 2 - 1" :fill="'url(#grad-processMapSpeed-' + task.task_id+ ')'"
            stroke="none" stroke-width="0"></rect>
    </g>
  </g>
</template>

<script>
export default {
  name: "Task",
  props: ["task", "height", "xScale", "dataflow"],
  mounted() {
  },
  computed: {
    startX() {
      return this.xScale(this.task.start_time)
    },
    endX() {
      return this.xScale(this.task.end_time)
    },
    strokeWidth() {
      return this.task.vertex === this.dataflow.selectedVertex ? (this.task.vertex.indexOf("Reducer") === -1 ? 5: 3) : 0
    },
  }
}
</script>

<style scoped>

</style>