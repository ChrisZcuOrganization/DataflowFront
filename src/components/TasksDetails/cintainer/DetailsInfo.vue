<template>
  <svg style="{height: 300px}" width="100%">
    <g :transform="'translate(' + [0, 0] + ')'">
      <g class="paraAxis" transform="translate(25,25)">
      </g>
      <g class="timeAxis" transform="translate(25,65)">
      </g>
      <text x="15" y="15" fill="black" font-size="10px" font-family="system-ui, serif">B/s</text>
      <g class="paraAxisPro" transform="translate(25,105)">
      </g>
      <g class="timeAxisPro" transform="translate(25,145)">
      </g>
      <text x="15" y="95" fill="black" font-size="10px" font-family="system-ui, serif">B/s</text>
      <g transform="translate(14,-5)">
        <!--        <rect width="100px" height="1000px" fill="red"-->
        <!--              stroke="black" stroke-width="2"></rect>-->
        <path :d="inputSpeed" fill="rgb(252,78,42)"
              stroke="rgb(252,78,42)"
              stroke-width="1"></path>
        <text x="75" y="95" fill="black" font-size="13px" font-family="system-ui, serif">Input speed</text>
      </g>

      <g transform="translate(14,5)">
        <path :d="processSpeed" fill="rgb(34,94,168)"
              stroke="rgb(34,94,168)"
              stroke-width="1"></path>
        <text x="70" y="165" fill="black" font-size="13px" font-family="system-ui, serif">Process speed</text>
      </g>

      <!--    <g :transform="'translate(' + [0, 2] + ')'">-->
      <!--      <rect :width="endX - startX" :height="height / 2 - 1" :fill="'url(#grad-inputMapSpeed-' + task.task_id + ')'"-->
      <!--            stroke="none" stroke-width="0"></rect>-->
      <!--    </g>-->
      <!--    <g :transform="'translate(' + [0, height / 2 + 1] + ')'">-->
      <!--      <rect :width="endX - startX" :height="height / 2 - 1" :fill="'url(#grad-processMapSpeed-' + task.task_id+ ')'"-->
      <!--            stroke="none" stroke-width="0"></rect>-->
      <!--    </g>-->
    </g>
  </svg>
</template>

<script>
import {areaGen} from "@/utils/util";
import * as d3 from "d3";

export default {
  name: "DetailsInfo",
  props: ["task"],
  mounted() {
    console.log(this.task)
    if (this.task.vertex.indexOf("Reducer") === -1)
      this.handleMapTask()
    else{
      this.handleReduceTask()
    }
    this.inputSpeed = this.genInputSpeed()
    this.processSpeed = this.genProcessSpeed()
  },
  data() {
    return {
      yScale: null,
      xScale: null,
      inputSpeed : null,
      processSpeed : null

    }
  },
  computed: {

  },
  methods: {
    genInputSpeed() {
      if (this.task.vertex.indexOf("Reducer") === -1) {
        this.yScale = d3.scaleLinear().domain([0, 1.5]).range([0, 70])
        this.xScale = d3.scaleLinear().domain([this.task.start_time, this.task.end_time]).range([14, 200])
        let inputVal = this.task.input_val
        let times = this.task.input_time
        let bottomFlow = new Array(times.length).fill(1.5)
        let upperFlow = new Array(this.timeLength).fill(0)
        for (let idx = 0; idx < times.length; ++idx) {
          upperFlow[idx] = 1.5 - inputVal[idx]
        }
        return this.getStackArea(bottomFlow, upperFlow, times)
      }else{

        let shuffleInfo = this.task.shuffle_info
        let trend = this.getSampleTrend(shuffleInfo)
        let maxRate = d3.max(trend, t => t.rate)
        let minTime = d3.min(trend, t => t.time)
        this.yScale = d3.scaleLinear().domain([0, 1.5]).range([50, 70])
        this.xScale = d3.scaleLinear().domain([minTime, this.task.end_time]).range([14, 200])
        let times = []
        let values = []
        let upperFlow = []
        trend.forEach(sf => {
          times.push(sf.time)
          values.push(sf.rate / 400)
          upperFlow.push(1.5 - sf.rate / (maxRate + 10))
        })
        let bottomFlow = new Array(times.length).fill(1.5)
        return this.getStackArea(bottomFlow, upperFlow, times)
      }
    },
    genProcessSpeed() {
      if (this.task.vertex.indexOf("Reducer") === -1) {
        this.yScale = d3.scaleLinear().domain([0, 1.5]).range([70, 140])
        this.xScale = d3.scaleLinear().domain([this.task.start_time, this.task.end_time]).range([14, 200])

        let processVal = this.task.process_val
        let times = this.task.process_time
        let bottomFlow = new Array(times.length).fill(1.5)
        let upperFlow = new Array(this.timeLength).fill(0)
        for (let idx = 0; idx < times.length; ++idx) {
          upperFlow[idx] = 1.5 - processVal[idx]
        }
        return this.getStackArea(bottomFlow, upperFlow, times)
      }else{
        this.yScale = d3.scaleLinear().domain([0, 1.5]).range([70, 140])
        this.xScale = d3.scaleLinear().domain([this.task.start_time, this.task.end_time]).range([14, 200])

        let processVal = this.task.process_val
        let times = []
        let bottomFlow = []
        let upperFlow = []
        for (let idx = 0; idx < this.task.process_val.length; ++idx) {
          if (processVal[idx] < 0) continue
          upperFlow.push( 1.5 - processVal[idx])
          bottomFlow.push(1.5);
          times.push(this.task.process_time[idx])
        }

        return this.getStackArea(bottomFlow, upperFlow, times)
      }
    },
    getSampleTrend(shuffleList) {
      let trend = []
      shuffleList.forEach(sf => {
        trend.push({
          'startTime': sf.end_time - sf.time_taken,
          'endTime': sf.end_time,
          'rate': sf.rate,
          'size': sf.csize
        })
      })
      trend.sort((a, b) => (a.endTime > b.endTime) ? 1 : -1)
      let gap = trend.lengt > 5 ? Math.round(trend.length / 5) : 1
      let res = []

      for (let idx = 0; idx < trend.length; idx += gap) {
        let size = 0, time = 0, length = d3.min([idx + gap, trend.length])
        for (let i = idx; i < length; ++i) {
          size += trend[i].size
          time += trend[i].endTime - trend[i].startTime
        }
        // if (trend[length - 1] !== undefined)
        res.push({'time': trend[length - 1].endTime, 'rate': size / time / 1000})
      }
      return res
    },
    getStackArea(bottomFlow, upperFlow, times) {
      let points = []
      for (let idx = 0; idx < times.length; idx += 1) {
        let xTmp = this.xScale(times[idx])
        let yTmp0 = this.yScale(bottomFlow[idx])
        let yTmp1 = this.yScale(upperFlow[idx])
        points.push([xTmp, yTmp0, yTmp1])
      }
      return areaGen(points)
    },
    handleReduceTask() {
      let tmpScale = d3.scaleLinear()
          .domain([0, 400])
          .range([40, 0])
      d3.select(this.$el).select('.paraAxis').call(d3.axisLeft(tmpScale).ticks(2).tickFormat(d => {
        return d
      }).tickSize(2))
      d3.select(this.$el).select('.paraAxis').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)
      let duration = this.task.end_time - this.task.start_time
      // let duration = this.task.input_time[this.task.input_time.length - 1] - this.task.input_time[0]
      tmpScale = d3.scaleLinear()
          .domain([0, duration])
          .range([0, 180])
      d3.select(this.$el).select('.timeAxis').call(d3.axisBottom(tmpScale).ticks(4).tickFormat(d => {
        return d / 1000 + "s"
      }).tickSize(2))
      d3.select(this.$el).select('.timeAxis').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)

      tmpScale = d3.scaleLinear()
          .domain([0, 400])
          .range([40, 0])
      d3.select(this.$el).select('.paraAxisPro').call(d3.axisLeft(tmpScale).ticks(2).tickFormat(d => {
        return d
      }).tickSize(2))
      d3.select(this.$el).select('.paraAxisPro').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)

      duration = this.task.end_time - this.task.start_time
      // duration = this.task.process_time[this.task.process_time.length - 1] - this.task.process_time[0]
      tmpScale = d3.scaleLinear()
          .domain([0, duration])
          .range([0, 180])
      d3.select(this.$el).select('.timeAxisPro').call(d3.axisBottom(tmpScale).ticks(4).tickFormat(d => {
        return d / 1000 + "s"
      }).tickSize(2))
      d3.select(this.$el).select('.timeAxisPro').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)
    },
    handleMapTask() {
      let tmpScale = d3.scaleLinear()
          .domain([0, 400])
          .range([40, 0])
      d3.select(this.$el).select('.paraAxis').call(d3.axisLeft(tmpScale).ticks(2).tickFormat(d => {
        return d
      }).tickSize(2))
      d3.select(this.$el).select('.paraAxis').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)
      let duration = this.task.end_time - this.task.start_time
      // let duration = this.task.input_time[this.task.input_time.length - 1] - this.task.input_time[0]
      tmpScale = d3.scaleLinear()
          .domain([0, duration])
          .range([0, 180])
      d3.select(this.$el).select('.timeAxis').call(d3.axisBottom(tmpScale).ticks(4).tickFormat(d => {
        return d / 1000 + "s"
      }).tickSize(2))
      d3.select(this.$el).select('.timeAxis').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)

      tmpScale = d3.scaleLinear()
          .domain([0, 400])
          .range([40, 0])
      d3.select(this.$el).select('.paraAxisPro').call(d3.axisLeft(tmpScale).ticks(2).tickFormat(d => {
        return d
      }).tickSize(2))
      d3.select(this.$el).select('.paraAxisPro').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)

      duration = this.task.end_time - this.task.start_time
      // duration = this.task.process_time[this.task.process_time.length - 1] - this.task.process_time[0]
      tmpScale = d3.scaleLinear()
          .domain([0, duration])
          .range([0, 180])
      d3.select(this.$el).select('.timeAxisPro').call(d3.axisBottom(tmpScale).ticks(4).tickFormat(d => {
        return d / 1000 + "s"
      }).tickSize(2))
      d3.select(this.$el).select('.timeAxisPro').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)
    }
  }
}
</script>

<style scoped>

</style>