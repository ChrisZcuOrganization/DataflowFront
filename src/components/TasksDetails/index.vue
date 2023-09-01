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
    <div class="tooltip" v-if="isClickToShowDetails"
         :style="{
                    top: topPos + 'px',
                    left: leftPos + 'px',
                    width: '250px',
                    height: '200px'
                } ">
      <div class="tooltip-text" style="font-weight: bold;">
<!--        this.task.input_time[this.task.input_time.length - 1] - this.task.input_time[0]-->
        Total time(s):  {{ (selectedTask.end_time - selectedTask.start_time) / 1000}}
      </div>
      <div v-if="selectedTask.vertex.indexOf('Reducer') === -1" class="tooltip-text" style="font-weight: bold;">
        Data from: {{selectedTask.data_machine}}
      </div>
      <div style="height:200px;">
        <DetailsInfo v-if="initDone"
                     :task="selectedTask"
                     :xScale="xScale"
                     :dataflow="dataflow"
                     style="height:200px;"
        ></DetailsInfo>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3"
import ContainerTasks from "@/components/TasksDetails/cintainer/ContainerTasks";
import DetailsInfo from "@/components/TasksDetails/cintainer/DetailsInfo";

export default {
  name: "TasksDetails",
  components: {ContainerTasks, DetailsInfo},
  props: ["dataflow"],
  data() {
    return {
      width: -1,
      xScale: null,
      initDone: false
    }
  },
  mounted() {
    console.log(this.dataflow.containerTasks['07-46']['map'])
    this.width = this.$el.getBoundingClientRect().width
    this.xScale = d3.scaleLinear().domain([this.dataflow.startTime, this.dataflow.endTime]).range([0, this.width])
    this.initDone = true
  },
  computed: {
    containersTasks() {
      return this.dataflow.containerTasks
    },
    containers() {
      console.log(this.dataflow.containerTasks["08-51"]['map'])
      return d3.keys(this.dataflow.containerTasks).sort(d3.ascending)
    },
    isClickToShowDetails(){
      return this.dataflow.isClickToShowDetails
    },
    selectedTask(){
      return this.dataflow.selectedTask
    },
    topPos(){
      return this.dataflow.clickedPosInfo.top
    },
    leftPos(){
      return this.dataflow.clickedPosInfo.left
    }
  },
  watch:{
    leftPos(){
      console.log("111", this.dataflow.clickedPosInfo)
    }
  }


}
</script>

<style scoped>
.borderedRectTmp {
  border: 1px solid rgba(128, 128, 128, 0.9);
  background-color: #f5f5f5;
}
.tooltip {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 4px;

  background: white;
  border: #999999 solid 1px;
  border-radius: 4px;
}
.tooltip-text {
  font-size: 12px;
  text-align: left;
  font-family: system-ui, serif;
}
</style>