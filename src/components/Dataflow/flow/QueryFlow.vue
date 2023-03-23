<template>
  <g>
    <g id="queryFlowTimeAxis" transform="translate(7,2)"></g>
    <svg y="25">
      <path :d="beforeProFlow" fill="rgb(252,78,42)"
            stroke="rgb(252,78,42)"
            stroke-width="1"></path>
      <path :d="processedFlow" fill="rgb(34,94,168)"
            stroke="rgb(34,94,168)"
            stroke-width="1"></path>
      <path :d="leftFlow" fill="rgb(141,211,199)"
            stroke="rgb(141,211,199)"
            stroke-width="1"></path>
    </svg>

  </g>
</template>

<script>
import * as d3 from "d3"
import {areaGen} from "@/utils/util";

export default {
  name: "QueryFlow",
  props: ["queryFlow", "xScale", "yScale"],
  mounted() {
    this.boundWidth = this.$el.getBoundingClientRect().width - 5
    this.boundHeight = this.$el.getBoundingClientRect().height
    // this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.boundWidth])
    let yScale = d3.scaleLinear()
        .domain([0, this.queryFlow.times[this.queryFlow.times.length - 1] - this.queryFlow.times[0]])
        .range([0, this.boundWidth])
    // console.log(0, this.queryFlow.times, this.startTime, this.endTime)
    d3.select(this.$el).select('#queryFlowTimeAxis').call(d3.axisBottom(yScale).ticks(10).tickFormat(d => {
      return d / 1000 + "s"
    }).tickSize(3))
    d3.select(this.$el).select('#queryFlowTimeAxis').selectAll('text').attr("font-size", "15px").attr("stroke-width", 1)


  },
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

#queryFlowTimeAxis {
  fill: none;
  stroke: #2d2d2d;
  shape-rendering: crispEdges;
}
</style>