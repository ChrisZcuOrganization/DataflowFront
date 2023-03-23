<template>
  <g :transform="'translate(' +infoRect+')'">
    <rect v-if="isShowDataInfo && !fold" rx="5" ry="5" x="5" y="-4" width="220" height="145" fill="rgb(255,247,236)"
          stroke="rgb(103,169,207)"
          stroke-width="2"></rect>
    <rect v-if="isShowDataInfo && !fold" @click="foldClick" rx="2" ry="2" width="15" height="15" fill="rgb(255,247,236)"
          stroke="rgb(103,169,207)" x="10" y="5"
          stroke-width="2"></rect>
    <svg v-if="isShowDataInfo  && !fold" @click="foldClick" t="1672112539914" class="icon" viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="2884" width="15" height="15"
         x="10" y="5">
      <path
          d="M890.336 330.912c-12.576-12.416-32.8-12.352-45.248 0.192L517.248 661.952 184.832 332.512c-12.576-12.448-32.8-12.352-45.28 0.192-12.448 12.576-12.352 32.832 0.192 45.28l353.312 350.112c0.544 0.544 1.248 0.672 1.792 1.184 0.128 0.128 0.16 0.288 0.288 0.416 6.24 6.176 14.4 9.28 22.528 9.28 8.224 0 16.48-3.168 22.72-9.472l350.112-353.312C902.976 363.616 902.88 343.36 890.336 330.912z"
          p-id="2885" fill="#1296db" stroke="#1296db" stroke-width="100"></path>
    </svg>

    <rect v-if="isShowDataInfo && fold" @click="foldClick" rx="2" ry="2" width="15" height="15" fill="rgb(255,247,236)"
          stroke="rgb(103,169,207)" x="10" y="5"
          stroke-width="2"></rect>
    <svg v-if="isShowDataInfo && fold" t="1672112513740" @click="foldClick" class="icon" viewBox="0 0 1024 1024"
         version="1.1"
         xmlns="http://www.w3.org/2000/svg"
         p-id="2681" width="15" height="15"
         x="10" y="5">
      <path
          d="M887.328 617.152 533.952 267.008c-0.512-0.512-1.216-0.672-1.76-1.152-0.128-0.128-0.16-0.32-0.288-0.448-12.576-12.416-32.832-12.352-45.28 0.192L136.512 618.944c-12.448 12.576-12.352 32.8 0.192 45.248 6.24 6.176 14.4 9.28 22.528 9.28 8.224 0 16.48-3.168 22.72-9.472l327.84-330.816 332.48 329.408c6.24 6.176 14.368 9.28 22.528 9.28 8.256 0 16.48-3.168 22.72-9.472C899.968 649.856 899.872 629.6 887.328 617.152z"
          p-id="2682" fill="#1296db" stroke="#1296db" stroke-width="100"></path>
    </svg>

    <g :id="uid">
    </g>
    <!--    <foreignObject id="heatMap" height="150" width="300">-->
    <!--    </foreignObject>-->
  </g>
</template>

<script>
import * as echarts from 'echarts'
import * as d3 from "d3"

const dataDisColor = d3.interpolateRgb('rgb(238,228,246)', 'rgb(221,52,151)')

export default {
  name: "dataflowInfo",
  props: ["flow", "dataflow", "vertexFlow", "xScale", "yScale", "boundHeight"],
  mounted() {
  },
  data() {
    return {
      fold: false
    }
  },
  methods: {
    deleteHeatMap() {
      let id = "#" + this.uid
      let canvas = d3.select(id)
      canvas.selectAll("*").remove()
    },
    initDataHeatMap() {
      // console.log(this.vertexFlow.srcDataDis)
      // console.log(this.vertexFlow.calDataDis)

      let srcDataDis = this.vertexFlow.srcDataDis, calDataDis = this.vertexFlow.calDataDis
      let maxVal = 59866928, totalLen = d3.entries(calDataDis).length, totalLenSrc = d3.entries(srcDataDis).length
      let rects = [], calMachines = [], texts = []
      let xOff = 34, yOff = 34, lineRectWid = (184 - totalLen) / totalLen,
          colRectHeight = (104 - totalLenSrc) / totalLenSrc

      d3.entries(calDataDis).forEach(item => {
        maxVal = d3.max([maxVal, item.value.total])
        calMachines.push(item.key)
      })
      d3.entries(srcDataDis).forEach(item => {
        maxVal = d3.max([maxVal, item.value.total])
      })
      let dataScale = d3.scaleLinear().domain([0, maxVal]).range([0, 30])
      calMachines.sort()
      calMachines.forEach(m => {
        let value = calDataDis[m]
        rects.push({
          'x': xOff + 5,
          'y': 34 - dataScale(value),
          'rx': 3,
          'ry': 3,
          'width': lineRectWid,
          'height': dataScale(value),
          'color': "rgb(53,151,143)",
          'opy': 0.8
        })
        texts.push({
          'x': xOff + 2 + 5,
          'y': 30,
          "text": m.replace("dbg", "D")
        })
        xOff += lineRectWid + 1
      })
      d3.entries(srcDataDis).forEach(item => {
        rects.push({
          'x': 34 - dataScale(item.value.total) + 5,
          'y': yOff,
          'rx': 3,
          'ry': 3,
          'width': dataScale(item.value.total),
          'height': colRectHeight,
          'color': "rgb(53,151,143)",
          'opy': 0.8
        })
        texts.push({
          'x': 15,
          'y': yOff + 5 * (colRectHeight + 1) / 6,
          "text": item.key.replace("dbg", "D")
        })
        let xOffTmp = 0
        calMachines.forEach(m => {
          rects.push({
            'x': 34 + xOffTmp + 5,
            'y': yOff,
            'rx': 5,
            'ry': 5,
            'width': lineRectWid,
            'height': colRectHeight,
            'color': (m in item.value) ? dataDisColor(item.value[m] / maxVal) : dataDisColor(0.001),
            'opy': 1
          })
          xOffTmp += lineRectWid + 1
        })
        yOff += colRectHeight + 1
      })

      let canvas = d3.select("#" + this.uid)

      canvas.selectAll('rect')
          .data(rects)
          .enter()
          .append('rect')
          .attr('x', function (item) {
            return item.x
          })
          .attr('rx', function (item) {
            return item.rx
          })
          .attr('ry', function (item) {
            return item.ry
          })
          .attr('y', function (item) {
            return item.y
          })
          .attr('width', function (item) {
            return item.width
          })
          .attr('height', function (item) {
            return item.height
          })
          .attr('fill', function (item) {
            return item.color
          })
          .attr('opacity', function (item) {
            return item.opy
          })

      canvas.selectAll('text')
          .data(texts)
          .enter()
          .append('text')
          .attr('x', function (item) {
            return item.x
          })
          .attr('y', function (item) {
            return item.y
          })
          .attr("font-size", 10)
          .text(function (item) {
            return item.text
          })
      // canvas.append('text').attr('x',10).attr('y',10).text("asdasd")

    },
    foldClick() {
      this.fold = !this.fold
      if (!this.fold) {
        this.initDataHeatMap()
      } else {
        this.deleteHeatMap()
      }
    }
  },
  computed: {
    infoRect() {
      // let maxBeforeHeight = this.flow.beforeProFlow[0]
      let diff = this.yScale(0) + 220 - this.boundHeight
      return [this.xScale(this.flow.times[(this.flow.times.length - 1)]) - 220, 0 + (diff > 0 ? this.yScale(0) - diff : this.yScale(0))]
    },
    height() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      return this.yScale(maxBeforeHeight)
    },
    isShowDataInfo() {
      // return this.vertexFlow.isShowDataInfo
      return this.vertexFlow.vertexName === this.dataflow.selectedVertex
    },
    uid() {
      return this.vertexFlow.vertexName.replace("Reducer ", "R").replace("Map ", "M") + "heatMap"
    }
  },
  watch: {
    isShowDataInfo() {
      this.fold = false
      if (this.isShowDataInfo) {
        this.initDataHeatMap()
      } else {
        this.deleteHeatMap()
      }
    },
  }
}
</script>

<style scoped>

</style>