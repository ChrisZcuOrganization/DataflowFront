<template>
  <g>
    <g v-if="isDetailedFlow" @click="handleVertexClick">
      <TasksFlow :flows="detailedFlow" :overviewFlow="overviewFlow" :xScale="vertexFlow.xScale"
                 :yScale="vertexFlow.yScale"></TasksFlow>
    </g>
    <g v-if="!isDetailedFlow" @click="handleVertexClick($event)">
      <VertexBytesFlow :flow="overviewFlow"
                       :xScale="vertexFlow.xScale"
                       :yScale="vertexFlow.yScale"
                       :isOverview="isOverview"></VertexBytesFlow>
    </g>
    <g>
      <dataflowInfo :flow="overviewFlow"
                    :vertexFlow="vertexFlow"
                    :xScale="vertexFlow.xScale"
                    :yScale="vertexFlow.yScale"
                    ></dataflowInfo>
    </g>
  </g>
</template>

<script>
import TasksFlow from "@/components/Dataflow/flow/TasksFlow";
import VertexBytesFlow from "@/components/Dataflow/flow/VertexBytesFlow";
import DataflowInfo from "@/components/Dataflow/flow/dataflowInfo";

export default {
  name: "VertexFlow",
  components: {DataflowInfo, TasksFlow, VertexBytesFlow},
  props: ['vertexFlow', 'isDetailedFlow', 'dataflow'],
  data() {
    return {
    }
  },
  methods: {
    handleVertexClick(e) {
      if (this.dataflow.selectedVertex === this.vertexFlow.vertexName)
        this.dataflow.selectedVertex = ""
      else
        this.dataflow.selectedVertex = this.vertexFlow.vertexName
      this.vertexFlow.isShowDataInfo = !this.vertexFlow.isShowDataInfo
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