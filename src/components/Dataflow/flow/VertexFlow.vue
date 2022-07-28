<template>
  <g>
    <g v-if="isTasksFlow">
      <TasksFlow :flows="detailedFlow" :xScale="vertexFlow.xScale" :yScale="vertexFlow.yScale"></TasksFlow>
    </g>
    <g v-if="isTasksFlow" @click="handleVertexClick">
      <VertexBytesFlow :flow="overviewFlow" :xScale="vertexFlow.xScale" :yScale="vertexFlow.yScale"></VertexBytesFlow>
    </g>
  </g>
</template>

<script>
import TasksFlow from "@/components/Dataflow/flow/TasksFlow";
import VertexBytesFlow from "@/components/Dataflow/flow/VertexBytesFlow";

export default {
  name: "VertexFlow",
  components: {TasksFlow, VertexBytesFlow},
  props: ['vertexFlow'],
  data() {
    return {
      isTasksFlow: true
    }
  },
  methods: {
    handleVertexClick() {
      console.log(this.vertexFlow.vertexName)
    }
  },
  created() {
    this.handleVertexClick()
  },
  computed: {
    detailedFlow() {
      return this.vertexFlow.taskFlows
    },
    overviewFlow() {
      return this.vertexFlow.flow
    },
    xOff() {
      return this.vertexFlow.xOff
    },
    yOff() {
      return this.vertexFlow.yOff
    }
  },
}
</script>

<style scoped>

</style>