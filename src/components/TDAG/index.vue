<template>
  <svg height="100%" width="100%">
    <g id="vertexTimeAxis" transform="translate(7,0)"></g>
    <g v-if="initDone">
      <g :transform="'translate('+illuBarTrans+')'">
        <rect height="15" width="30" rx="5" ry="5" fill="rgb(252,78,42)" x="20" y="2"></rect>
        <rect height="15" width="30" rx="5" ry="5" fill="rgb(141,211,199)" x="20" y="27"></rect>
        <rect height="15" width="30" rx="5" ry="5" fill="rgb(252,205,229)" x="20" y="52"></rect>
        <text x="55" y="15"> Input</text>
        <text x="55" y="40"> Computation </text>
        <text x="55" y="65"> Output</text>
      </g>
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

      <vertexInfo v-if="true" v-for="(vex, index) in vertexList" :key="'vf' + index"
                  :vertex="vertexMap.get(vex)"
                  :dataflow="dataflow"
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
    this.boundWidth = this.$el.getBoundingClientRect().width - 5
    this.boundHeight = this.$el.getBoundingClientRect().height
    this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.boundWidth])
    var yScale = d3.scaleLinear()
        .domain([0, this.dataflow.endTime - this.dataflow.startTime])
        .range([0, this.boundWidth])
    // console.log(yScale.domain(), yScale.range())
    d3.select(this.$el).select('#vertexTimeAxis').call(d3.axisBottom(yScale).ticks(10).tickFormat(d => {
      return d / 1000 + "s"
    }).tickSize(3))
    d3.select(this.$el).select('#vertexTimeAxis').selectAll('text').attr("font-size", "15px").attr("stroke-width", 1)

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
    },
    illuBarTrans() {
      let boundWidth = this.$el.getBoundingClientRect().width
      let boundHeight = this.$el.getBoundingClientRect().height
      return [boundWidth - 150, boundHeight - 80]
    }
  }
}
</script>

<style scoped>

#vertexTimeAxis {
  fill: none;
  stroke: #2d2d2d;
  shape-rendering: crispEdges;
}
</style>