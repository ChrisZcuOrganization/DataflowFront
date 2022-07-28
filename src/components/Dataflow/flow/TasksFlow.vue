<template>
  <g>
    <g v-for="(model, id) in pathModels" :key="id" class="tasksFlow">
<!--      <path :d="model.get('beforeProFlow')" fill="red"-->
<!--            stroke="rgb(125, 125, 125)"-->
<!--            stroke-width="0"></path>-->
<!--      <path :d="model.get('leftFlow')" fill="green"-->
<!--            stroke="rgb(125, 125, 125)"-->
<!--            stroke-width="0"></path>-->
      <path :d="model.get('processedFlow')" fill="blue"
            stroke="rgb(125, 125, 125)"
            stroke-width="0"></path>
    </g>
  </g>
</template>

<script>
import {areaGen, curveGen} from "@/utils/util"

export default {
  name: "Flow",
  props: ['flows', 'xScale', 'yScale'],
  data() {
    return {}
  },
  mounted() {
  },
  computed: {
    pathModels() {
      let models = []
      let timeLength = this.flows[0].flow.times.length
      let baseLine = new Array(timeLength).fill(0)
      let _this = this
      console.log("begin tasks model")
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
    }
  }
}
</script>

<style scoped>

</style>