<template>
  <g>
    <g v-if="isOverview">
      <path :d="pathModels" fill="none"
            stroke="rgb(254,178,76)"
            stroke-width="10"></path>
    </g>
    <g id="stepDrawCanvas">
      <path :d="beforeProFlow" fill="rgb(252,78,42)"
            stroke="none"
            stroke-width="1"></path>
      <path :d="processedFlow" fill="rgb(34,94,168)"
            stroke="none"
            stroke-width="1"></path>
      <path :d="leftFlow" fill="rgb(141,211,199)"
            stroke="none"
            stroke-width="1"></path>
    </g>
  </g>
</template>

<script>
import {areaGen, curveGen} from "@/utils/util";
import * as d3 from "d3"

export default {
  name: "VertexBytesFlow",
  props: ["flow", "xScale", "yScale", "isOverview"],
  created() {
  },
  data() {
    return {
    }
  },
  computed: {
    timeLength() {
      return this.flow.times.length
    },
    pathModels() {
      let points = []
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      for (let idx = 0; idx < this.flow.times.length; idx += 1) {
        let xTmp = this.xScale(this.flow.times[idx])
        // let yTmp0 = this.yScale(0)
        let yTmp0 = this.yScale(maxBeforeHeight - this.flow.beforeProFlow[idx])
        // let yTmp1 = this.yScale(this.flow.heights[idx])
        let yTmp1 = this.yScale(maxBeforeHeight + this.flow.processedFlow[idx] + this.flow.leftFlow[idx])
        points.push([xTmp, yTmp0, yTmp1])
      }
      return areaGen(points)
    },
    beforeProFlow() {
      // return this.getStackArea(new Array(this.flow.times.length).fill(0), this.flow.beforeProFlow)

      let maxBeforeHeight = this.flow.beforeProFlow[0]
      let upperFlow = new Array(this.timeLength).fill(0)
      let bottomFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      for (let idx = 0; idx < this.timeLength; ++idx) {
        upperFlow[idx] = maxBeforeHeight - this.flow.beforeProFlow[idx]
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
    processedFlow() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]

      let upperFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        bottomFlow[idx] += (upperFlow[idx] + this.flow.processedFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
    leftFlow() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      let upperFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        upperFlow[idx] += (this.flow.processedFlow[idx])
        bottomFlow[idx] = (upperFlow[idx] + this.flow.leftFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
  },
  watch: {
  },
  methods: {
    getStackArea(bottomFlow, upperFlow) {
      let points = []
      for (let idx = 0; idx < this.flow.times.length; idx += 1) {
        let xTmp = this.xScale(this.flow.times[idx])
        let yTmp0 = this.yScale(bottomFlow[idx])
        let yTmp1 = this.yScale(upperFlow[idx])
        points.push([xTmp, yTmp0, yTmp1])
      }
      return areaGen(points)
    }
  }
}
</script>

<style scoped>


</style>