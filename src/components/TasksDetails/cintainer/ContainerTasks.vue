<template>
  <div style="height: 100%; ">
    <svg :style="{height: height}" width="100%">
      <defs>
        <linearGradient v-for="[taskId, colorTicks] in Array.from(inputColorPropMap.entries())"
                        :key="taskId"
                        :id="'grad-inputMapSpeed-' + taskId"
                        x1="0" x2="1" y1="0" y2="0">
          <stop v-for="(colorTick, idx) in colorTicks" :key="idx"
                :offset="colorTick.percent + '%'" :stop-color="colorTick.color"/>
        </linearGradient>

        <linearGradient v-for="[taskId, colorTicks] in Array.from(processColorPropMap.entries())"
                        :key="'p' +taskId"
                        :id="'grad-processMapSpeed-' + taskId"
                        x1="0" x2="1" y1="0" y2="0">
          <stop v-for="(colorTick, idx) in colorTicks" :key="idx"
                :offset="colorTick.percent + '%'" :stop-color="colorTick.color"/>
        </linearGradient>

        <linearGradient v-for="[taskId, colorTicks] in Array.from(proReducerColorPropMap.entries())"
                        :key="'r-p' +taskId"
                        :id="'grad-processReducerSpeed-' + taskId"
                        x1="0" x2="1" y1="0" y2="0">
          <stop v-for="(colorTick, idx) in colorTicks" :key="idx"
                :offset="colorTick.percent + '%'" :stop-color="colorTick.color"/>
        </linearGradient>
      </defs>
      <g transform="translate(3,0)">
        <Task v-if="initDone" v-for="(taskItem, index) in mapTasks"
              :key="index"
              :task="taskItem"
              :xScale="xScale"
              :height="height - 2"
              :dataflow="dataflow"
              @click.native="handleTaskClick(taskItem, $event)"></Task>

        <ReducerTask v-if="initDone"
                     v-for="(taskItem, index) in reducerTasks" :key="'r' + index"
                     :task="taskItem"
                     :xScale="xScale"
                     :height="height - 2"
                     :dataflow="dataflow"
                     @click.native="handleTaskClick(taskItem, $event)"></ReducerTask>
      </g>

    </svg>

  </div>
</template>

<script>
import Task from "@/components/TasksDetails/cintainer/Task";
import ReducerTask from "@/components/TasksDetails/cintainer/ReducerTask";

import * as d3 from "d3";
import DetailsInfo from "@/components/TasksDetails/cintainer/DetailsInfo";

const inputColorGen = d3.interpolateRgb('rgb(226,189,177)', 'rgb(189,0,38)')
// const inputColorGenTmp = d3.interpolateRgb('rgba(252,235,211,0.3)', 'rgba(189,0,38,0.3)')
const inputColorGenTmp = d3.interpolateRgb('rgba(226,189,177,0.3)', 'rgba(189,0,38,0.3)')

const processColorGen = d3.interpolateRgb('rgb(158,202,225)', 'rgb(8,81,156)')
const processColorGenTmp = d3.interpolateRgb('rgba(158,202,225,0.3)', 'rgba(8,81,156, 0.3)')


export default {
  name: "ContainerTasks",
  components: {DetailsInfo, Task, ReducerTask},
  props: ["mapTasks", "dataflow", "height", "reducerTasks"],
  data() {
    return {
      xScale: null,
      initDone: false
    }
  },
  mounted() {
    let width = this.$el.getBoundingClientRect().width
    this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, width])
    // console.log(width)
    this.initDone = true
  },
  methods: {
    handleTaskClick(task, e) {
      let totalWidth = window.screen.width
      let totalHeight = window.screen.height
      this.dataflow.selectedTask = task
      this.dataflow.isClickToShowDetails = !this.dataflow.isClickToShowDetails
      // 250px
      this.dataflow.clickedPosInfo.left = e.x < totalWidth - 500 ? totalWidth - 400 : totalWidth * 0.4 + 100

      console.log()
      // console.log(this.dataflow.clickedPosInfo)
      // console.log(task)
      console.log(e.x, e.y)
    },
    generateInputColorMap() {
      let colorMap = new Map()
      const timePer = function (time, startTime, endTime) {
        if (time === startTime) {
          return 0
        }
        return (time - startTime) / (endTime - startTime) * 100
      }
      this.mapTasks.forEach(task => {
        let colorTicks = []
        let inputTime = task.input_time
        let inputVal = task.input_val
        let startTime = task.start_time
        let endTime = task.end_time

        for (let idx = 0; idx < inputTime.length; ++idx) {
          let color = task.vertex === "Map 1" ? inputColorGen(inputVal[idx]) : inputColorGen(inputVal[idx]) //inputColorGenTmp(inputVal[idx])
          // let color = task.vertex === "Map 1" ? inputColorGen(inputVal[idx]) : inputColorGenTmp(inputVal[idx])
          colorTicks.push({percent: timePer(inputTime[idx], startTime, endTime), color: color})
        }
        colorMap.set(task.task_id, colorTicks)
      })
      return colorMap
    },
    generateProcessColorMap() {
      let colorMap = new Map()
      const timePer = function (time, startTime, endTime) {
        if (time === startTime) {
          return 0
        }
        return (time - startTime) / (endTime - startTime) * 100
      }
      this.mapTasks.forEach(task => {
        let colorTicks = []
        let processTime = task.process_time
        let processVal = task.process_val
        let startTime = task.start_time
        let endTime = task.end_time

        for (let idx = 0; idx < processTime.length; ++idx) {
          let color = task.vertex === "Map 1" ? processColorGen(processVal[idx]) : processColorGen(processVal[idx]) //processColorGenTmp(processVal[idx])
          // let color = task.vertex === "Map 1" ? processColorGen(processVal[idx]) : processColorGenTmp(processVal[idx])

          colorTicks.push({
            percent: timePer(processTime[idx], startTime, endTime),
            color: color
          })
        }
        colorMap.set(task.task_id, colorTicks)
      })
      return colorMap
    },
    genReducerProColorMap() {
      let colorMap = new Map()
      const timePer = function (time, startTime, endTime) {
        if (time === startTime) {
          return 0
        }
        return (time - startTime) / (endTime - startTime) * 100
      }
      this.reducerTasks.forEach(task => {
        let colorTicks = []
        let processTime = task.process_time
        let processVal = task.process_val
        let startTime = task.process_begin_time
        let endTime = task.end_time

        for (let idx = 0; idx < processTime.length; ++idx) {
          let color = task.vertex === "Map 1" ? processColorGen(processVal[idx]) : processColorGen(processVal[idx]) //processColorGenTmp(processVal[idx])
          // let color = task.vertex === "Map 1" ? processColorGen(processVal[idx]) : processColorGenTmp(processVal[idx])

          colorTicks.push({
            percent: timePer(processTime[idx], startTime, endTime),
            color: color
          })
        }
        colorMap.set(task.task_id, colorTicks)
      })
      return colorMap
    }
  },
  computed: {
    inputColorPropMap() {
      return this.generateInputColorMap()
    },
    processColorPropMap() {
      return this.generateProcessColorMap()
    },
    proReducerColorPropMap() {
      return this.genReducerProColorMap()
    }
  }
}
</script>

<style scoped>

</style>