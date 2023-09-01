<template>
  <g>
    <path :d="pathModels" fill="none"
          stroke="#969696"
          stroke-width="1.2"></path>
  </g>
<!--  stroke-dasharray="10,10"-->
</template>

<script>
// import {areaGen} from "@/utils/util";
import * as d3 from "d3"

const link = d3.linkHorizontal()

export default {
  name: "ConnectedFlow",
  props: ["flow"],
  created() {
  },
  computed: {
    pathModels() {
      let srcInfo = this.flow[0]
      let dstInfo = this.flow[1]
      let points = [
        srcInfo,
        dstInfo
      ]
      return link({
        source: [points[0][0], points[0][2]],
        target: [points[1][0], points[1][2]]
      })
      // return areaGen(points)
    }
  }
}
</script>

<style scoped>

</style>