<template>
  <g>
    <path :d="beforeProFlow" fill="red"
          stroke="rgb(125, 125, 125)"
          stroke-width="1"></path>
    <path :d="processedFlow" fill="blue"
          stroke="rgb(125, 125, 125)"
          stroke-width="1"></path>
    <path :d="leftFlow" fill="green"
          stroke="rgb(125, 125, 125)"
          stroke-width="1"></path>
  </g>
</template>

<script>
import * as d3 from "d3"
import {areaGen} from "@/utils/util";

export default {
  name: "QueryFlow",
  props: ["queryFlow", "xScale", "yScale"],
  computed: {
    timeLength() {
      return this.queryFlow.times.length
    },
    beforeProFlow() {
      let maxBeforeHeight = d3.max(this.queryFlow.beforeProFlow)
      let upperFlow = new Array(this.timeLength).fill(0)
      let bottomFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      for (let idx = 0; idx < this.timeLength; ++idx) {
        upperFlow[idx] = maxBeforeHeight - this.queryFlow.beforeProFlow[idx]
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
    processedFlow() {
      let maxBeforeHeight = d3.max(this.queryFlow.beforeProFlow)
      let upperFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        bottomFlow[idx] += (upperFlow[idx] + this.queryFlow.processedFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
    leftFlow() {
      let maxBeforeHeight = d3.max(this.queryFlow.beforeProFlow)
      let upperFlow = new Array(this.timeLength).fill(maxBeforeHeight)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        upperFlow[idx] += (this.queryFlow.processedFlow[idx])
        bottomFlow[idx] = (upperFlow[idx] + this.queryFlow.leftFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    }
  },
  methods: {
    getStackArea(bottomFlow, upperFlow) {
      let points = []
      for (let idx = 0; idx < this.queryFlow.times.length; idx += 1) {
        let xTmp = this.xScale(this.queryFlow.times[idx])
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