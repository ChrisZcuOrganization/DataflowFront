<template>
  <div style="width: 100%; height: 100%;">
    <el-col :span="1">
      <svg height="50px" width="100%">
        <g class="paraAxis" transform="translate(37,-2)">
        </g>
      </svg>
    </el-col>
    <el-col :span="23" :offset="0">
      <svg height="50px" width="100%">
        <!--        <g class="paraAxis" transform="translate(0,0)">-->
        <!--        </g>-->
        <path :d="totalParalPath" fill="rgb(150,150,150)"></path>
        <path v-if="isShowTasksParal" :d="tasksParallelism" fill="rgb(253,174,107)"></path>
      </svg>
    </el-col>
  </div>
</template>

<script>
import * as d3 from "d3"
import {areaGen} from "@/utils/util";

export default {
  name: "Parallelism",
  props: ['dataflow'],
  data() {
    return {
      timeScale: null,
      valueScale: null,
      width: 1041.328125,
      height: 45
    }
  },
  methods: {
    getTrend(tasksList) {
      let trend = []
      tasksList.forEach(t => {
        trend.push({'type': 'start', 'time': t.startTime})
        trend.push({'type': 'end', 'time': t.endTime})
      })
      trend.sort((a, b) => (a.time > b.time) ? 1 : -1)

      let count = 0
      let res = []
      trend.forEach(t => {
        if (t.type === 'start') {
          count += 1
        } else {
          count -= 1
        }
        res.push({'time': t.time, 'count': count})
      })
      return res
    },

  },
  mounted() {
    let tmpScale = d3.scaleLinear()
        .domain(this.valueScale.range())
        .range([45, 0])
    d3.select(this.$el).select('.paraAxis').call(d3.axisLeft(tmpScale).ticks(3).tickFormat(d => {
      return d
    }).tickSize(2))
    d3.select(this.$el).select('.paraAxis').selectAll('text').attr("font-size", "10px").attr("stroke-width", 0)
  },
  computed: {
    totalParalPath() {
      let tasksList = []
      this.dataflow.vertexFlowList.forEach(vertex => {
        vertex.tasksList.forEach(t => {
          tasksList.push({startTime: t.task_start_time, endTime: t.task_end_time})
        })
      })
      let trend = this.getTrend(tasksList)
      this.timeScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.width])
      this.valueScale = d3.scaleLinear().domain([0, 45]).range([0, d3.max(trend, t => t.count)])
      let _this = this
      let res = []
      trend.forEach(t => {
        res.push([_this.timeScale(t.time), 45, 45 - _this.valueScale(t.count)])
      })
      return areaGen(res)
    },
    tasksParallelism() {
      let tasksList = []
      this.dataflow.vertexFlowMap.get(this.dataflow.selectedVertex).tasksList.forEach(t => {
        tasksList.push({startTime: t.task_start_time, endTime: t.task_end_time})
      })
      let trend = this.getTrend(tasksList)
      let _this = this
      let res = []
      trend.forEach(t => {
        res.push([_this.timeScale(t.time), 45, 45 - _this.valueScale(t.count)])
      })
      return areaGen(res)
    },
    isShowTasksParal() {
      return this.dataflow.selectedVertex !== ""
    }
  },
}
</script>

<style scoped>
.paraAxis {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
  font-size: 10px;
  /*stroke-width: 0.5;*/
}

</style>