<template>
  <svg height="100%" width="100%" id="counterScatterCanvas">
  </svg>
</template>

<script>
import * as d3 from "d3"

export default {
  name: "CounterScatter",
  props: ["tasksList", "counterValues", "counterName"],
  mounted() {
    this.deleteScatter()
    this.initScatter()
  },
  data() {
    return {
      height: -1,
      leftBound: -1,
      startTime: -1,
      endTime: -1
    }
  },
  methods: {
    initScatter() {
      let length = this.tasksList.length
      let circles = []
      for (let idx = 0; idx < length; ++idx) {
        circles.push({
          "cx": this.timeScale(this.tasksList[idx].task_start_time),
          "cy": this.height - this.valueScale(this.counterValues[idx])
        })
        if (this.height - this.valueScale(this.counterValues[idx]) < 0)
          console.log("wrong", this.height, this.counterValues[idx], this.valueScale(this.counterValues[idx]))
      }

      let canvas = d3.select("#counterScatterCanvas")
      canvas.selectAll('*').remove()
      canvas.selectAll('circle').data(circles).enter().append('circle')
          .attr('cx', function (d) {
            return d.cx
          })
          .attr('cy', function (d) {
            return d.cy
          })
          .attr('r', 6)
          .attr('fill', "rgb(103,169,207)")
          .attr("opacity", 0.7)
      // .attr('stroke', "grey")
      // .attr('stroke-width', "2")

      canvas.append('g').attr('class', 'YAxis').attr("transform", "translate(" + this.leftBound + ",0)")
      var yScale = d3.scaleLinear()
          .domain(d3.extent(this.counterValues))
          .range([this.height - 30, 20])
      d3.select(this.$el).select('.YAxis').call(d3.axisLeft(yScale).ticks(10).tickFormat(d => {
        if (d > 10)
          return d.toExponential(1)
        else return d
      }).tickSize(3))

      canvas.append('g').attr('class', 'XAxis').attr("transform", "translate(" + (this.timeScale(this.startTime) - 5) + "," + (this.height - 30) + ")")
      var xScale = d3.scaleLinear()
          .domain([0, this.endTime - this.startTime])
          .range([0, this.$el.getBoundingClientRect().width - 50])
      d3.select(this.$el).select('.XAxis').call(d3.axisBottom(xScale).ticks(10).tickFormat(d => {
        return d
      }).tickSize(3))
      canvas.append('g').attr("transform", "translate(" + (this.timeScale(this.endTime) - 60) + "," + (this.height) + ")")
          .append('text')
          .attr('font-size', 15)
          .text("start time")

    },
    deleteScatter() {
      let canvas = d3.select("#counterScatterCanvas")
      canvas.selectAll('*').remove()
    }
  },
  computed: {
    timeScale() {
      this.startTime = this.tasksList[0].task_start_time
      this.endTime = this.tasksList[0].task_start_time
      this.tasksList.forEach(t => {
        this.startTime = d3.min([this.startTime, t.task_start_time])
        this.endTime = d3.max([this.endTime, t.task_start_time])
      })
      let width = this.$el.getBoundingClientRect().width
      let scale = d3.scaleLinear().domain([this.startTime, this.endTime]).range([50, width - 10])
      this.leftBound = scale(this.startTime) - 5
      return scale
    },
    valueScale() {
      this.height = (this.$el.getBoundingClientRect().height)
      return d3.scaleLinear().domain(d3.extent(this.counterValues)).range([40, this.height - 30])
    }
  },
  watch: {
    counterName() {
      console.log(this.counterName)
      this.deleteScatter()
      this.initScatter()
    }
  }

}
</script>

<style scoped>
.YAxis {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.XAxis {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}
</style>