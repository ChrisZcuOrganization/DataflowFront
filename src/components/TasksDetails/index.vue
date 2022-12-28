<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <el-row v-for="c in containers" :key="c" style="margin: 0px; height: 25px">
      <el-col class="borderedRect" :span="1">
        <div style="font-family: 'Arial','Times New Roman';font-size: 1px; margin-top: 3px;">
          {{ c }}
        </div>
      </el-col>
      <el-col :span="23" class="borderedRect">
        <ContainerTasks style="height: 17px; width: calc(100% - 5px);"
                        :mapTasks="containersTasks[c]['map']"
                        :reducerTasks="containersTasks[c]['reducer']"
                        :height="17"
                        :dataflow="dataflow"></ContainerTasks>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as d3 from "d3"
import ContainerTasks from "@/components/TasksDetails/cintainer/ContainerTasks";

export default {
  name: "TasksDetails",
  components: {ContainerTasks},
  props: ["dataflow"],
  data() {
    return {
      width: -1,
      xScale: null,
      initDone: false
    }
  },
  mounted() {
    // this.width = this.$el.getBoundingClientRect().width
    // this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.width])
    // this.initDone = true
  },
  computed: {
    containersTasks() {
      return this.dataflow.containerTasks
    },
    containers() {
      return d3.keys(this.dataflow.containerTasks).sort(d3.ascending)
    }
  },


}
</script>

<style scoped>

</style>