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

      <vertexInfo v-for="(vex, index) in vertexList" :key="'vf' + index"
                  :vertex="vertexMap.get(vex)"
                  :xScale="xScale"
                  :vexHeight="height"
                  :vexMarginTop="marginTop"
                  :vexGlobalOff="30"
                  :widthBound="boundWidth - 10"
                  :heightBound="boundHeight- 10"></vertexInfo>
    </g>
  </svg>
</template>

<script>
import Vertex from "@/components/TDAG/vertexes/vertex";
import * as d3 from "d3";
import Edge from "@/components/TDAG/vertexes/edge";
import vertexInfo from "@/components/TDAG/vertexes/vertexInfo"

export default {
  name: "TDAG",
  components: {Edge, Vertex, vertexInfo},
  props: ['dataflow', 'marginTop', 'height'],
  data() {
    return {
      boundWidth: -1,
      boundHeight: -1,
      initDone: false,
      xScale: null
    }
  },
  mounted() {
    this.boundWidth = this.$el.getBoundingClientRect().width
    this.boundHeight = this.$el.getBoundingClientRect().height
    this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.boundWidth])
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