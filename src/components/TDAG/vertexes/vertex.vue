<template>
  <g :transform="'translate('+[5 + xOff,globalOff + yOff]+ ')'" @click="handleClick">
    <rect :width="totalWidth" :height="height" fill="none" :stroke="color" :stroke-width="boardWidth"></rect>
    <rect :width="inputWidth" :height="height" fill="rgb(252,78,42)" stroke="grey" stroke-width="2"
          opacity="0.8"></rect>
    <rect :width="proWidth" :height="3 * height / 4" :x="xScale(vertex.processStartTime) - xOff"
          :y="1 * height / 4"
          fill="rgb(141,211,199)" stroke="grey" stroke-width="2"></rect>
    <rect :width="outputWidth" :height="height / 2" fill="rgb(252,205,229)" stroke="grey"
          :x="xScale(vertex.outputStartTime)  - xOff"
          :y=" height / 2"
          stroke-width="2"></rect>
    <text font-size="15" font-family="Arial" :transform="'translate('+[textXOff,0]+ ')'">
      {{ vertex.vertexName.replace('Reducer ', 'R').replace('Map ', 'M') }}
    </text>
  </g>
</template>

<script>
export default {
  name: "vertex",
  props: ["vertex", "height", "marginTop", "xScale", "dataflow", "globalOff"],
  data() {
    return {
      initDone: false
    }
  },
  methods: {
    handleClick() {
      this.vertex.isShowOprInfo = !this.vertex.isShowOprInfo
      // if (this.vertex.isShowDataInfo)
      //   this.dataflow.selectedVertex = this.vertex.vertexName
      if (this.dataflow.selectedVertex === this.vertex.vertexName)
        this.dataflow.selectedVertex = ""
      else
        this.dataflow.selectedVertex = this.vertex.vertexName
      console.log(this.vertex.vertexName)
    }
  },
  computed: {
    yOff() {
      if (this.vertex.TDAGYOff !== undefined) {
        this.initDone = true
        return this.vertex.TDAGYOff * (this.marginTop + this.height)
      }
    },
    xOff() {
      return this.xScale(this.vertex.totalStartTime)
    },
    totalWidth() {
      return this.xScale(this.vertex.totalEndTime) - this.xScale(this.vertex.totalStartTime)
    },
    inputWidth() {
      return this.xScale(this.vertex.inputEndTime) - this.xScale(this.vertex.totalStartTime)
    },
    proWidth() {
      return this.xScale(this.vertex.processEndTime) - this.xScale(this.vertex.processStartTime)
    },
    outputWidth() {
      return this.xScale(this.vertex.totalEndTime) - this.xScale(this.vertex.outputStartTime)
    },
    color() {
      if (this.vertex.isShowOprInfo || this.vertex.isShowDataInfo) {
        return "rgb(254,178,76)"
      }
      return this.dataflow.selectedVertex !== this.vertex.vertexName ? "grey" : "rgb(254,178,76)"
    },
    boardWidth() {
      if (this.vertex.isShowOprInfo || this.vertex.isShowDataInfo) {
        return 8
      }
      return this.dataflow.selectedVertex !== this.vertex.vertexName ? 2 : 8
    },
    textXOff() {
      return this.vertex.totalEndTime + 1000 >= this.dataflow.endTime ? -20 : 0
    },
    isReducer() {
      return this.vertex.vertexName.indexOf("Reducer") !== -1
    }
  }
}
</script>

<style scoped>

</style>