<template>
  <svg height="100%" width="100%">
    <g v-if="initDone">
      <edge v-for="(edge, index) in edges" :key="'e' + index"
            :edge="edge"
            :vexHeight="height"
            :vexMarginTop="marginTop"
            :xScale="xScale"
            :dataflow="dataflow"
            :globalOff="30"></edge>

      <vertex v-for="(vex, index) in vertexList" :key="index"
              :vertex="vertexMap.get(vex)"
              :height="height"
              :marginTop="marginTop"
              :xScale="xScale"
              :dataflow="dataflow"
              :globalOff="30"></vertex>

    </g>
  </svg>
</template>

<script>
import Vertex from "@/components/TDAG/vertexes/vertex";
import * as d3 from "d3";
import Edge from "@/components/TDAG/vertexes/edge";

export default {
  name: "TDAG",
  components: {Edge, Vertex},
  props: ['dataflow', 'marginTop', 'height'],
  data() {
    return {
      initDone: false,
      xScale: null
    }
  },
  mounted() {
    let width = this.$el.getBoundingClientRect().width
    this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, width])
    this.initDone = true
  },
  computed: {
    vertexMap() {
      return this.dataflow.vertexFlowMap
    },
    vertexList() {
      return this.dataflow.vertexList
    },
    edges() {
      return this.dataflow.edges
    }
  }
}
</script>

<style scoped>

</style>