<template>
  <g :transform="'translate('+rectOff + ')'">
    <rect v-if="isShowOprInfo" width="140" :height="boardHeight" rx="10" ry="10" fill="rgb(255,247,236)" opacity="0.8"
          stroke="rgb(103,169,207)"
          stroke-width="2"></rect>
    <g :id="canvasId"></g>
  </g>
</template>

<script>
import * as d3 from 'd3'

const link = d3.linkHorizontal()

export default {
  name: "VertexInfo",
  props: ["vertex", "dataflow", "xScale", "vexMarginTop", "vexHeight", "vexGlobalOff", "widthBound", "heightBound"],
  data() {
    return {
      circleRadius: 10,
      margin: 8
    }
  },
  methods: {
    initOpsTree() {
      let canvas = d3.select("#" + this.canvasId)
      canvas.selectAll('circle').remove()
      let yOff = 14, xOff = 150 / 2, splitXOff = 150 / 6
      let circles = [], joinYOff = -1, joinXOff = -1, joinLastXOff = -1, joinLastYOff = -1
      this.vertex.operatorsList.forEach(ops => {
        circles.push({
          "yOff": yOff,
          "xOff": xOff,
          "ops": ops
        })
        if (ops.indexOf("JOIN") !== -1) {
          joinXOff = xOff / 2
          joinYOff = yOff + this.circleRadius * 2 + this.margin

          joinLastXOff = xOff
          joinLastYOff = yOff

          xOff += splitXOff
        }
        yOff += this.circleRadius * 2 + this.margin
      })
      canvas.selectAll('circle').data(circles)
          .enter()
          .append('circle')
          .attr('r', this.circleRadius)
          .attr('cx', function (c) {
            return c.xOff
          })
          .attr('cy', function (c) {
            return c.yOff
          })
          .attr("stroke", "grey")
          .attr("stroke-width", 2)
          .attr("fill", "none")
      canvas.selectAll('text').data(circles)
          .enter()
          .append('text')
          .attr('x', function (c) {
            return c.xOff
          })
          .attr('y', function (c) {
            return c.yOff
          })
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", 10)
          .text(function (d) {
            return d.ops
          })
      let r = this.circleRadius, lastXOff = circles[0].xOff, lastYOff = circles[0].yOff + r
      canvas.selectAll('path')
          .data(circles.slice(1, circles.length))
          .enter()
          .append('path')
          .attr('d', function (c) {
            let l = link({
              source: [lastXOff, lastYOff],
              target: [c.xOff, c.yOff - r]
            })
            lastXOff = c.xOff
            lastYOff = c.yOff + r
            return l
          })
          .attr("stroke", "grey")
          .attr("stroke-width", 2)
          .attr("fill", "none")
      canvas.append('path')
          .attr('d', function () {
            return link({
              source: [lastXOff, lastYOff],
              target: [xOff, yOff - r + r / 5]
            })
          })
          .attr("stroke", "grey")
          .attr("stroke-width", 2)
          .attr("fill", "none")
      canvas.append('text')
          .attr('x', xOff)
          .attr('y', yOff)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", 12)
          .text("store_sales")
      if (joinXOff > 0) {
        canvas.append('path')
            .attr('d', function () {
              return link({
                source: [joinLastXOff, joinLastYOff + r],
                target: [joinXOff, joinYOff - r + r / 5]
              })
            })
            .attr("stroke", "grey")
            .attr("stroke-width", 2)
            .attr("fill", "none")
        canvas.append('text')
            .attr('x', joinXOff)
            .attr('y', joinYOff)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 12)
            .text("Map 6")
        canvas.append('rect')
            .attr('x', 5)
            .attr('y', yOff - 70)
            .attr('height', 40)
            .attr('width', 60)
            .attr('rx', "5")
            .attr('ry', "5")
            .attr('fill', 'rgba(29,145,192,0.4)')
        canvas.append('text')
            .attr('x', joinXOff - 2)
            .attr('y', yOff - 60)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 12)
            .text("Total time:")
        canvas.append('text')
            .attr('x', joinXOff - 2)
            .attr('y', yOff - 40)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 12)
            .text("Total time:")
            .text((this.vertex.totalEndTime - this.vertex.totalStartTime) / 1000 + "s")
      }
    },
    deleteOpsTree() {
      let canvas = d3.select("#" + this.canvasId)
      canvas.selectAll('*').remove()
      // canvas.selectAll('text').remove()
    }
  },
  watch: {
    isShowOprInfo(newV) {
      if (newV) {
        this.initOpsTree()
      } else {
        this.deleteOpsTree()
      }
    }
  },
  computed: {
    rectOff() {
      let xOff = this.xScale(this.vertex.totalEndTime) + 5
      let yOff = this.vertex.TDAGYOff * (this.vexMarginTop + this.vexHeight)
      if (yOff + this.boardHeight > this.heightBound)
        yOff = this.heightBound - this.boardHeight - 30
      if (xOff + 150 > this.widthBound)
        xOff = this.xScale(this.vertex.totalStartTime) - 150 - 5
      return [xOff + 29, this.vexGlobalOff + yOff]
    },
    isShowOprInfo() {
      // return this.vertex.isShowOprInfo
      return this.vertex.vertexName === this.dataflow.selectedVertex
    },
    canvasId() {
      return this.vertex.vertexName.replace("Map ", "M").replace("Reducer ", "R") + 'opsCanvas'
    },
    boardHeight() {
      return this.vertex.operatorsList.length * (2 * 15 + 10) - 35
    }
  }
}
</script>

<style scoped>

</style>