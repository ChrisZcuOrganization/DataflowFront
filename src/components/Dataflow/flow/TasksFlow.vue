<template>
  <g>
    <g v-for="(model, id) in pathModels" :key="id" class="tasksFlow">
      <path :d="model.get('beforeProFlow')" fill="red"
            stroke="rgb(125, 125, 125)"
            stroke-width="0"></path>
      <path :d="model.get('leftFlow')" fill="green"
            stroke="rgb(125, 125, 125)"
            stroke-width="0"></path>
      <path :d="model.get('processedFlow')" fill="blue"
            stroke="rgb(125, 125, 125)"
            stroke-width="0"></path>
    </g>
    <!--    <g>-->
    <!--      <path :d="testModel" fill="blue"-->
    <!--            stroke="rgb(125, 125, 125)"-->
    <!--            stroke-width="0"></path>-->
    <!--    </g>-->
  </g>
</template>

<script>
import {areaGen, curveGen, lineAreaGen} from "@/utils/util"

export default {
  name: "Flow",
  props: ['flows', 'overviewFlow','xScale', 'yScale'],
  data() {
    return {}
  },
  mounted() {
  },
  computed: {
    testModel() {
      let timeLength = this.flows[0].flow.times.length
      let baseLine = new Array(timeLength).fill(0)
      let _this = this
      let processed = new Array(timeLength).fill(0)
      this.flows.forEach(taskFlow => {
        let flow = taskFlow.flow
        for (let idx = 0; idx < timeLength; idx += 1) {
          processed[idx] += (flow.beforeProFlow[idx])
        }
      })
      return this.getStackArea(baseLine, processed, this.flows[0].flow.times)
    },
    pathModels() {
      let models = []
      let timeLength = this.flows[0].flow.times.length
      // let baseLine = new Array(timeLength).fill(0)

      let maxBeforeHeight = this.overviewFlow.beforeProFlow[0]
      let baseLine = new Array(timeLength).fill(0)
      for (let idx = 0; idx < timeLength; ++idx) {
        baseLine[idx] = maxBeforeHeight - this.overviewFlow.beforeProFlow[idx]
      }

      let _this = this
      this.flows.forEach(tasksFlow => {
        let mapTmp = new Map()
        let flow = tasksFlow.flow
        // console.log(baseLine)
        let upperFlow = new Array(this.timeLength).fill(0)

        for (let idx = 0; idx < timeLength; idx += 1) {
          upperFlow[idx] = (baseLine[idx] + flow.beforeProFlow[idx])
        }

        mapTmp.set("beforeProFlow", _this.getStackArea(baseLine, upperFlow, flow.times))


        for (let idx = 0; idx < timeLength; idx += 1) {
          baseLine[idx] += (flow.beforeProFlow[idx])
          upperFlow[idx] = (baseLine[idx] + flow.leftFlow[idx])
        }
        mapTmp.set("leftFlow", _this.getStackArea(baseLine, upperFlow, flow.times))

        for (let idx = 0; idx < timeLength; idx += 1) {
          baseLine[idx] += (flow.leftFlow[idx])
          upperFlow[idx] = (baseLine[idx] + flow.processedFlow[idx])
        }
        mapTmp.set("processedFlow", _this.getStackArea(baseLine, upperFlow, flow.times))
        models.push(mapTmp)

        for (let idx = 0; idx < timeLength; idx += 1) {
          baseLine[idx] += (flow.processedFlow[idx])
        }
      })
      return models
    },
    simpledPathModels() {
      let models = []
      let timeLength = this.flows[0].flow.times.length
      let baseLine = new Array(timeLength).fill(0)
      let _this = this
      console.log("begin simpled tasks model")
      this.flows.forEach(tasksFlow => {
        let flow = tasksFlow.flow
        models.push(_this.simpledArea(flow, baseLine))
      })
      return models
    }


  },
  methods: {
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
    getLinearStackArea(bottomFlow, upperFlow, times) {
      let points = []
      for (let idx = 0; idx < times.length; idx += 1) {
        let xTmp = this.xScale(times[idx])
        let yTmp0 = this.yScale(bottomFlow[idx])
        let yTmp1 = this.yScale(upperFlow[idx])
        points.push([xTmp, yTmp0, yTmp1])
      }
      return lineAreaGen(points)
    },
    simpledArea(flow, baseLine) {
      let mapTmp = new Map()

      let simpledIndexes = this.flowSimple(flow)

      let simpledBeforeIdx = simpledIndexes["simpledBeforeFlow"]
      let simpledBeforeBtm = []
      let simpledBeforeUpr = []

      let simpledTimes = []

      let logList = []
      let timeList = []
      for (let idx = 0; idx < simpledBeforeIdx.length; idx += 1) {
        simpledBeforeBtm.push(baseLine[simpledBeforeIdx[idx]])
        simpledBeforeUpr.push(baseLine[simpledBeforeIdx[idx]] + flow.beforeProFlow[simpledBeforeIdx[idx]])
        logList.push(flow.beforeProFlow[simpledBeforeIdx[idx]])
        timeList.push(flow.times[simpledBeforeIdx[idx]])
        simpledTimes.push(flow.times[simpledBeforeIdx[idx]])
      }
      // console.log(simpledBeforeIdx, simpledBeforeBtm, logList, timeList)

      mapTmp.set("beforeProFlow", this.getStackArea(simpledBeforeBtm, simpledBeforeUpr, simpledTimes))

      let simpledLeftIdx = simpledIndexes["simpledLeftFlow"]
      let simpledLeftBtm = []
      let simpledLeftUpr = []

      simpledTimes = []
      for (let idx = 0; idx < flow.times.length; idx += 1) {
        baseLine[idx] += (flow.beforeProFlow[idx])
      }
      for (let idx = 0; idx < simpledLeftIdx.length; idx += 1) {
        simpledLeftBtm.push(baseLine[simpledLeftIdx[idx]])
        simpledLeftUpr.push(baseLine[simpledLeftIdx[idx]] + flow.leftFlow[simpledLeftIdx[idx]])
        simpledTimes.push(flow.times[simpledLeftIdx[idx]])
      }
      mapTmp.set("leftFlow", this.getStackArea(simpledLeftBtm, simpledLeftUpr, simpledTimes))


      let simpledProcessedIdx = simpledIndexes["simpledProcessedFlow"]
      let simpledProcessedBtm = []
      let simpledProcessedUpr = []

      simpledTimes = []
      for (let idx = 0; idx < flow.times.length; idx += 1) {
        baseLine[idx] += (flow.leftFlow[idx])
      }
      for (let idx = 0; idx < simpledProcessedIdx.length; idx += 1) {
        simpledProcessedBtm.push(baseLine[simpledProcessedIdx[idx]])
        simpledProcessedUpr.push(baseLine[simpledProcessedIdx[idx]] + flow.processedFlow[simpledProcessedIdx[idx]])
        simpledTimes.push(flow.times[simpledProcessedIdx[idx]])
      }
      mapTmp.set("processedFlow", this.getStackArea(simpledProcessedBtm, simpledProcessedUpr, simpledTimes))

      for (let idx = 0; idx < flow.times.length; idx += 1) {
        baseLine[idx] += (flow.processedFlow[idx])
      }
      return mapTmp
    },
    flowSimple(flow) {
      let beforeFlow = flow.beforeProFlow
      let leftFlow = flow.leftFlow
      let processedFlow = flow.processedFlow

      let times = flow.times

      return {
        "simpledBeforeFlow": this.directPointSample(beforeFlow, times),
        "simpledLeftFlow": this.directPointSample(leftFlow, times),
        "simpledProcessedFlow": this.directPointSample(processedFlow, times)
        // "simpledLeftFlow":[],
        // "simpledProcessedFlow": []
      }

    },
    directPointSample(flowPoints, times) {
      let simpledTimes = [times[0]]
      let simpledFlow = [flowPoints[0]]
      let indexes = [0]
      for (let idx = 1; idx < times.length; idx += 1) {
        if (flowPoints[idx] !== simpledFlow.slice(-1)[0]) {

          simpledTimes.push(times[idx - 1])
          simpledFlow.push(flowPoints[idx - 1])
          indexes.push(idx - 1)

          simpledTimes.push(times[idx])
          simpledFlow.push(flowPoints[idx])
          indexes.push(idx)
          if (flowPoints[idx] === 0) {
            break
          }
        }
      }
      // indexes.push(times.length - 1)
      return indexes
    }
  }
}
</script>

<style scoped>

</style>