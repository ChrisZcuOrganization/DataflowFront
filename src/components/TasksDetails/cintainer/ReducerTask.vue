<template>
  <g>
<!--    <linearGradient :id="'grad-shuffle-' + task.taskId"-->
<!--                    x1="0" x2="1" y1="0" y2="0">-->
<!--      <stop v-for="(colorTick, idx) in shuffleColorTick" :key="idx"-->
<!--            :offset="colorTick.percent + '%'" :stop-color="colorTick.color"/>-->
<!--    </linearGradient>-->
<!--    :fill="'url(#grad-shuffle-'+task.taskId+')'"-->

    <g :transform="'translate(' + [startX, 0] + ')'">
      <rect :width="endX - startX" :height="height" fill="white"
            stroke="black" :stroke-width=strokeWidth></rect>
    </g>
    <g :transform="'translate(' + [processStartX, 0] + ')'">
      <rect :width="endX - processStartX" :height="height" :fill="'url(#grad-processReducerSpeed-' + task.task_id + ')'"
            stroke="none" stroke-width="0"></rect>
    </g>
  </g>
</template>

<script>
import * as d3 from "d3";

const inputColorGen = d3.interpolateRgb('rgba(255,255,255,0.98)', 'rgb(189,0,38)')

export default {
  name: "ReducerTask",
  props: ["task", "height", "xScale", "dataflow"],
  methods: {
    getTrend(shuffleList) {
      let trend = []
      shuffleList.forEach(sf => {
        trend.push({'type': 'start', 'time': sf.end_time - sf.time_taken, 'rate': sf.rate})
        trend.push({'type': 'end', 'time': sf.end_time, 'rate': sf.rate})
      })
      trend.sort((a, b) => (a.time > b.time) ? 1 : -1)

      let rate = 0
      let res = []
      trend.forEach(t => {
        if (t.type === 'start') {
          rate += t.rate
        }else{
          rate -= rate
        }
        res.push({'time': t.time, 'rate': rate})
      })
      return res
    },
    genShuffleColorTick() {

      const timePer = function (time, startTime, endTime) {
        if (time === startTime) {
          return 0
        }
        return (time - startTime) / (endTime - startTime) * 100
      }

      let shuffleInfo = this.task.shuffle_info
      let trend = this.getTrend(shuffleInfo)
      let startTime = this.task.start_time
      let endTime = this.task.end_time
      let colorTicks = []
      let maxRate =  d3.max(trend, t => t.rate)
      trend.forEach(sf => {
        colorTicks.push({
          percent: timePer(sf.time, startTime, endTime),
          color: inputColorGen(sf.rate / (maxRate + 10))
        })
      })
      return colorTicks
    }
  },
  computed: {
    startX() {
      return this.xScale(this.task.start_time)
    },
    processStartX() {
      return this.xScale(this.task.process_begin_time)
    },
    endX() {
      return this.xScale(this.task.end_time)
    },
    strokeWidth() {
      return this.task.vertex === this.dataflow.selectedVertex ? 2 : 0
    },
    shuffleInfo() {
      return this.task.shuffle_info
    },
    shuffleColorTick() {
      return this.genShuffleColorTick()
    }
  }
}
</script>

<style scoped>

</style>