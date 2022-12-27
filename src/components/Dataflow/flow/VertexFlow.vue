<template>
  <g>
    <g v-if="isDetailedFlow" @click="handleVertexClick">
      <TasksFlow :flows="detailedFlow" :overviewFlow="overviewFlow" :xScale="vertexFlow.xScale"
                 :yScale="vertexFlow.yScale"></TasksFlow>
    </g>
    <g v-if="!isDetailedFlow" @click="handleVertexClick($event)">
      <VertexBytesFlow :flow="overviewFlow"
                       :vertexFlow="vertexFlow"
                       :dataflow="dataflow"
                       :xScale="vertexFlow.xScale"
                       :yScale="vertexFlow.yScale"
                       :isOverview="isOverview"></VertexBytesFlow>
    </g>
<!--    <g>-->
<!--      <dataflowInfo v-if="allFlowRenderDone" :flow="overviewFlow"-->
<!--                    :vertexFlow="vertexFlow"-->
<!--                    :xScale="vertexFlow.xScale"-->
<!--                    :yScale="vertexFlow.yScale"-->
<!--                    ></dataflowInfo>-->
<!--    </g>-->
  </g>
</template>

<script>
import TasksFlow from "@/components/Dataflow/flow/TasksFlow";
import VertexBytesFlow from "@/components/Dataflow/flow/VertexBytesFlow";
import DataflowInfo from "@/components/Dataflow/flow/dataflowInfo";
import {mapState} from "vuex";

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
      console.log(this.vertexFlow.vertexName)
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
    ...mapState('dataflow', {
      allFlowRenderDone: state=>state.allFlowRenderDone
    }),
    detailedFlow() {
      return this.vertexFlow.taskFlows
    },
    overviewFlow() {
      return this.vertexFlow.flow
    },
    vertexName(){
      return this.vertexFlow.vertexName
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