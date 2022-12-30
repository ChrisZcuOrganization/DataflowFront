<template>
  <el-row style="height: 100%; width: 100%;" :gutter="8">
    <el-col :span="24" style="height: 100%; width: 100%; overflow-y: scroll;">
      <el-row style="height: 50px; width: 100%">
        Query information: execution time, allocated container (number, memory, cpu core) (only highlight difference for
        comparison)
      </el-row>
      <div v-if="tasksFlowInitDone">
        <div v-for="dataflow in flows" :key="flows.flowName">
          <el-col style="height: 100%; width: 40%;">
            <el-row>
              <div class="borderedRect" style="width: 100%; margin-top: 2px; margin-left: 2px;">
                <div style="height: 300px; margin: 2px;">
                  <TDAG style="margin-top: 10px"
                        :dataflow="dataflow"
                        :height="20"
                        :marginTop="15"></TDAG>
                </div>
              </div>
            </el-row>
            <el-row>
              <div class="borderedRect" style="width: 100%; margin-top: 2px; margin-left: 2px;">
                <div class="borderedRect"
                     style="width: calc(100% - 8px); margin-top: 2px; margin-left: 2px;margin-right: 2px;">
                  <Dataflow style="width: 100%; height: 180px; margin-top: 2px; margin-left: 2px;"
                            :dataflow="dataflow"
                            :isQueryFlow="true"
                            :height="420"/>
                </div>
                <div class="borderedRect" style="width: calc(100% - 8px); margin: 2px;">
                  <Dataflow style="width: 100%; height: 365px; margin-top: 2px; margin-left: 2px;"
                            :dataflow="dataflow"
                            :isQueryFlow="false"
                            :height="410"/>
                </div>
              </div>
            </el-row>
          </el-col>
          <el-col style="height: 100%; width: 60%;">
            <div class="borderedRect" style="height: 100%; width: calc(100% - 8px); margin: 2px;">
              <div class="borderedRect" style="height: 50px; width: calc(100% - 8px); margin: 2px;">
                <Parallelism style="margin: 2px" :dataflow="dataflow"></Parallelism>
              </div>
              <div class="borderedRect" style="height: 550px; width: calc(100% - 8px); margin: 2px;">
                <TasksDetails style="width: 100%; height: 100%; margin: 2px"
                              :dataflow="dataflow"></TasksDetails>
              </div>
              <div class="borderedRect" style="height: 254px; width: calc(100% - 8px); margin: 2px;">
                <Counter style="width: 100%; height: 100%;" :dataflow="dataflow"></Counter>
              </div>
            </div>
          </el-col>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Dataflow from "@/components/Dataflow"
import TDAG from "@/components/TDAG"

import {mapState} from "vuex";
import TasksDetails from "@/components/TasksDetails";
import Counter from "@/components/Counter";
import Parallelism from "@/components/Parallelism";

export default {
  name: "MainView",
  components: {Parallelism, Counter, TasksDetails, Dataflow, TDAG},
  mounted() {

    this.$store.commit("dataflow/getTasksFlow", {appName: "query29"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "Query29/resource_competition"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query54_cold"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query54_hot"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query0_11"})
  },
  computed: {
    ...mapState('dataflow', {
      flowMap: state => state.flowMap,
      flows: state => state.flows,
      tasksFlowInitDone: state => state.tasksFlowInitDone
    }),
  }
}
</script>

<style>
.borderedRect {
  border: 2px solid rgba(128, 128, 128, 0.9);
  background-color: #f5f5f5;
}

</style>