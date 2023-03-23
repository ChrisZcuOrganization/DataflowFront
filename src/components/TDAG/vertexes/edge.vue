<template>
  <g>
    <path :d="genPath" stroke="grey" stroke-width="1" fill="none"></path>
  </g>
</template>

<script>
import * as d3 from "d3";

const link = d3.linkHorizontal()

export default {
  name: "edge",
  props: ["edge", "vexHeight", "vexMarginTop", "xScale", "dataflow", "globalOff"],
  computed: {
    genPath() {
      let srcVexName = this.edge["srcVex"]
      let dstVexName = this.edge["dstVex"]
      let srcVex = this.dataflow.vertexFlowMap.get(srcVexName)
      let dstVex = this.dataflow.vertexFlowMap.get(dstVexName)

      let srcYOff = srcVex.TDAGYOff * (this.vexHeight + this.vexMarginTop) + this.vexHeight / 2 + this.globalOff
      let srcXOff = this.xScale(srcVex.totalEndTime)

      let dstYOff = dstVex.TDAGYOff * (this.vexHeight + this.vexMarginTop) + this.vexHeight / 2 + this.globalOff
      let dstXOff = this.xScale(dstVex.totalStartTime)

      return link({
        source: [5 + srcXOff, srcYOff],
        target: [5 + dstXOff, dstYOff]
      })
    }
  }
}
</script>

<style scoped>

</style>