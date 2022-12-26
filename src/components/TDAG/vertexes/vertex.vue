<template>
  <g :transform="'translate('+[xOff,globalOff + yOff]+ ')'" @click="handleClick">
    <rect :width="width" :height="height" :fill="color" stroke="grey" stroke-width="2"></rect>
    <text font-size="15" font-family="Arial" :transform="'translate('+[textXOff,0]+ ')'">{{ vertex.vertexName.replace('Reducer ', 'R').replace('Map ', 'M') }}</text>
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
    width() {
      return this.xScale(this.vertex.totalEndTime) - this.xScale(this.vertex.totalStartTime)
    },
    color() {
      return "white"
    },
    textXOff(){
      return this.vertex.totalEndTime + 1000 >= this.dataflow.endTime ? -20 : 0
    }
  }
}
</script>

<style scoped>

</style>