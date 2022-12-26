<template>
  <g @click="handleClick($event)">
    <g v-if="isOverview" style="z-index: 100">
      <path :d="pathModels" fill="none"
            stroke="rgb(254,178,76)"
            stroke-width="10"></path>
    </g>
    <g id="stepDrawCanvas" style="z-index: 100">
      <path :d="beforeProFlow" fill="rgb(252,78,42)"
            stroke="rgb(252,78,42)"
            stroke-width="1"></path>
      <path :d="processedFlow" fill="rgb(34,94,168)"
            stroke="rgb(34,94,168)"
            stroke-width="1"></path>
      <path :d="leftFlow" fill="rgb(141,211,199)"
            stroke="rgb(141,211,199)"
            stroke-width="1"></path>
    </g>
<!--    <g v-if="isShowInfo" :transform="'translate(' +infoRect+')'" style="z-index: -1">-->
<!--      <rect width="100" height="100" fill="black"></rect>-->
<!--    </g>-->
    <!--    <g id="infoCanvas"></g>-->
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
      infoX: -1,
      infoY: -1,
      isShowInfo: false
    }
  },
  mounted() {
    // let canvas = d3.select("#infoCanvas")
    // canvas.append("rect")
    //     .attr('x', this.infoX)
    //     .attr('y', this.infoY)
    //     .attr('height', 50)
    //     .attr("width", 50)
    //     .attr("fill", "black")
  },
  computed: {
    infoRect() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      return [this.xScale(this.flow.times[(this.flow.times.length - 1) / 10]), this.yScale(maxBeforeHeight - maxBeforeHeight / 3)]
    },
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
    // infoX: {
    //   handler() {
    //     this.showInfo()
    //   },
    //   deep: true
    // }
  },
  methods: {
    handleClick(e) {
      this.isShowInfo = !this.isShowInfo
      // this.infoX = e.x
      // this.infoY = e.y
      // this.showInfo()
    },
    showInfo() {
      let canvas = d3.select("#infoCanvas")
      canvas.selectAll('rect').remove()
      // canvas.append("rect")  //添加一个矩形
      //     .attr("x",78)
      //     .attr("y",109)
      //     .attr("width",50)
      //     .attr("height",50)
      //     .attr("fill","red")
      console.log(this.infoX, this.infoY)
      canvas.append("rect")
          .attr('x', this.infoX)
          .attr('y', this.infoY)
          .attr('height', 100)
          .attr("width", 100)
          .attr("fill", "black")
          .style("z-index", 999)
    },
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