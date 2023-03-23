<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <el-row v-for="c in containers" :key="c" style="margin: 0px; height: 25px">
      <el-col class="borderedRectTmp" :span="1">
        <div style="height:17px; font-family: 'Arial','Times New Roman';font-size: 15px; margin-top: 3px;">
          {{ c }}
        </div>
      </el-col>
      <el-col :span="23" class="borderedRectTmp">
        <ContainerTasks style="height: 20px; width: calc(100% - 5px);"
                        :mapTasks="containersTasks[c]['map']"
                        :reducerTasks="containersTasks[c]['reducer']"
                        :height="20"
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
      console.log(this.dataflow.containerTasks["08-51"]['map'])
      return d3.keys(this.dataflow.containerTasks).sort(d3.ascending)
    }
  },


}
</script>

<style scoped>
.borderedRectTmp {
  border: 1px solid rgba(128, 128, 128, 0.9);
  background-color: #f5f5f5;
}
</style>