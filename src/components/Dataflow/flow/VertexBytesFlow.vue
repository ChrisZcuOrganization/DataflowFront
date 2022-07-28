<template>
  <g>
    <g v-if="isOverview">
      <path :d="pathModels" fill="none"
            stroke="rgb(125, 125, 125)"
            stroke-width="2"></path>
    </g>
    <g v-if="!isOverview" id="stepDrawCanvas">
      <path :d="beforeProFlow" fill="red"
            stroke="rgb(125, 125, 125)"
            stroke-width="1"></path>
      <path :d="leftFlow" fill="green"
            stroke="rgb(125, 125, 125)"
            stroke-width="1"></path>
      <path :d="processedFlow" fill="blue"
            stroke="rgb(125, 125, 125)"
            stroke-width="1"></path>
    </g>
  </g>
</template>

<script>
import {areaGen, curveGen} from "@/utils/util";
import * as d3 from "d3"

const stack = d3.stack().keys(d3.range(500)).order(d3.stackOrderNone)

export default {
  name: "VertexBytesFlow",
  props: ["flow", "xScale", "yScale"],
  created() {
  },
  data() {
    return {
      isOverview: true
    }
  },
  computed: {
    timeLength() {
      return this.flow.times.length
    },
    pathModels() {
      let points = []
      for (let idx = 0; idx < this.flow.times.length; idx += 1) {
        let xTmp = this.xScale(this.flow.times[idx])
        let yTmp0 = this.yScale(0)
        let yTmp1 = this.yScale(this.flow.heights[idx])
        points.push([xTmp, yTmp0, yTmp1])
      }
      return areaGen(points)
    },
    beforeProFlow() {
      return this.getStackArea(new Array(this.flow.times.length).fill(0), this.flow.beforeProFlow)
    },
    leftFlow() {
      let upperFlow = new Array(this.timeLength).fill(0)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        bottomFlow[idx] += (this.flow.beforeProFlow[idx])
        upperFlow[idx] += (this.flow.beforeProFlow[idx] + this.flow.leftFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    },
    processedFlow() {
      let upperFlow = new Array(this.timeLength).fill(0)
      let bottomFlow = new Array(this.timeLength).fill(0)
      for (let idx = 0; idx < this.timeLength; idx += 1) {
        bottomFlow[idx] += (this.flow.beforeProFlow[idx] + this.flow.leftFlow[idx])
        upperFlow[idx] += (this.flow.beforeProFlow[idx] + this.flow.leftFlow[idx] + this.flow.processedFlow[idx])
      }
      return this.getStackArea(bottomFlow, upperFlow)
    }
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