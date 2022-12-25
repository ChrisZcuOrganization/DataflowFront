<template>
  <g>
    <g v-if="isDetailedFlow" @click="handleVertexClick">
      <TasksFlow :flows="detailedFlow" :overviewFlow="overviewFlow" :xScale="vertexFlow.xScale"
                 :yScale="vertexFlow.yScale"></TasksFlow>
    </g>
    <g v-if="!isDetailedFlow" @click="handleVertexClick">
      <VertexBytesFlow :flow="overviewFlow"
                       :xScale="vertexFlow.xScale"
                       :yScale="vertexFlow.yScale"
                       :isOverview="isOverview"></VertexBytesFlow>
    </g>
  </g>
</template>

<script>
import TasksFlow from "@/components/Dataflow/flow/TasksFlow";
import VertexBytesFlow from "@/components/Dataflow/flow/VertexBytesFlow";

export default {
  name: "VertexFlow",
  components: {TasksFlow, VertexBytesFlow},
  props: ['vertexFlow', 'isDetailedFlow', 'dataflow'],
  data() {
    return {
      // isOverview: false
    }
  },
  methods: {
    handleVertexClick() {
      // this.isOverview = !this.isOverview
      if (this.dataflow.selectedVertex === this.vertexFlow.vertexName)
        this.dataflow.selectedVertex = ""
      else
        this.dataflow.selectedVertex = this.vertexFlow.vertexName
      console.log(this.vertexFlow.vertexName)
    }
  },
  created() {
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
    },
    isOverview() {
      return this.dataflow.selectedVertex === this.vertexFlow.vertexName
    }
  },
}
</script>

<style scoped>

</style>