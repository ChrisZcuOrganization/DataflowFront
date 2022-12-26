<template>
  <g :transform="'translate(' +infoRect+')'">
    <rect v-if="isShowDataInfo" width="400" height="150" fill="white" stroke="grey" stroke-width="2"></rect>
    <g :id="uid">
    </g>
    <!--    <foreignObject id="heatMap" height="150" width="300">-->
    <!--    </foreignObject>-->
  </g>
</template>

<script>
import * as echarts from 'echarts'
import * as d3 from "d3"

export default {
  name: "dataflowInfo",
  props: ["flow", "vertexFlow", "xScale", "yScale",],
  mounted() {
  },
  methods: {
    deleteHeatMap() {
      let id = "#" + this.uid
      let canvas = d3.select(id)
      canvas.selectAll("rect").remove()
    },
    initDataHeatMap() {
      console.log(this.vertexFlow.srcDataDis)
      console.log(this.vertexFlow.calDataDis)

      let srcDataDis = this.vertexFlow.srcDataDis
      let calDataDis = this.vertexFlow.calDataDis
      let maxVal = 0
      d3.entries(srcDataDis).forEach(item=>{
        maxVal = d3.max([maxVal, item.value.total])
      })
      d3.entries(calDataDis).forEach(item=>{
        maxVal = d3.max([maxVal, item.value.total])
      })
      let dataScale = d3.scaleLinear().domain([0, maxVal]).range([0, 30])
      let id = "#" + this.uid
      let canvas = d3.select(id)
      //line, destination
      canvas.append('rect')
          .attr('x', 34)
          .attr('y', 2)
          .attr('height', 30)
          .attr("width", 364)
          .attr('fill', 'black')

      //col, source
      canvas.append('rect')
          .attr('x', 2)
          .attr('y', 34)
          .attr('height', 114)
          .attr("width", 30)
          .attr('fill', 'grey')
      canvas.append('rect')
          .attr('y', 34)
          .attr('x', 34)
          .attr('height', 114)
          .attr("width", 364)
          .attr('fill', 'red')

    }
  },
  computed: {
    infoRect() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      return [this.xScale(this.flow.times[(this.flow.times.length - 1) / 10]), this.yScale(maxBeforeHeight / 4)]
    },
    height() {
      let maxBeforeHeight = this.flow.beforeProFlow[0]
      return this.yScale(maxBeforeHeight)
    },
    isShowDataInfo() {
      return this.vertexFlow.isShowDataInfo
    },
    uid() {
      return this.vertexFlow.vertexName.replace("Reducer ", "R").replace("Map ", "M") + "heatMap"
    }
  },
  watch: {
    isShowDataInfo() {
      console.log(this.isShowDataInfo)
      if (this.isShowDataInfo) {
        this.initDataHeatMap()
      } else {
        this.deleteHeatMap()
      }
    },
    // isShowInfo: {
    //   handler() {
    //     if (this.isShowInfo) {
    //       this.initDataHeatMap()
    //     } else {
    //       this.deleteHeatMap()
    //     }
    //   },
    //   deep: true
    // }
  }
}
</script>

<style scoped>

</style>