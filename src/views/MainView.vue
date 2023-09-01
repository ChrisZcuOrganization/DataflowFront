<template>
  <el-row style="height: 100%; width: 100%;" :gutter="8">
    <el-col :span="24" style="height: 100%; width: 100%; overflow-y: scroll;">
      <!--      <el-row style="height: 60px; width: calc(100% - 12px);margin-top: 2px; margin-left: 6px; margin-right: 6px;"-->
      <!--              class="borderedRect info" @click.native="showFlow">-->
      <!--            <el-col :span="3">-->
      <!--              <el-button>Query 29@TPC-DS</el-button>-->
      <!--            </el-col>-->
      <!--            <el-col :span="3"> Execution time: 76s</el-col>-->
      <!--            <el-col :span="3"> Total data size(GB): 100</el-col>-->
      <!--            <el-col :span="3"> #Containers: 60</el-col>-->
      <!--      </el-row>-->

      <el-row style="height: 60px; width: calc(100% - 22px);margin-top: 2px; margin-left: 11px; margin-right: 8px;"
              class="outborderedRect info">
        <el-row style="margin-top: 5px; margin-left: 3px">
          <el-col :span="4">
            <el-select @change="loadData" v-model="queryName" placeholder="Select Query">
              <el-option
                  v-for="item in queryList"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" :offset="1" style="margin-top: 2px">
            <el-col :span="16" :offset="0" class="infoSelector">
              Execution time(s):
            </el-col>
            <el-col :span="5" style=" height: 35px; line-height: 35px; margin-top: 2px; border:solid 2px grey; background-color: white; border-radius: 2px">
              {{exeTime}}
            </el-col>
          </el-col>
          <el-col :span="4" style="margin-top: 2px">
            <el-col :span="16" class="infoSelector">
              Total data size(GB):
            </el-col>
            <el-col :span="4" style="height: 35px; line-height: 35px; margin-top: 2px; border:solid 2px grey; background-color: white; border-radius: 2px">
              {{dataSize}}
            </el-col>
          </el-col>
          <el-col :span="4" style="margin-top: 2px">
            <el-col :span="12" :offset="0" class="infoSelector">
              #Containers:
            </el-col>
            <el-col :span="4" style="height: 35px; line-height: 35px; margin-top: 2px; border:solid 2px grey; background-color: white; border-radius: 2px">
              {{containerNum}}
            </el-col>
          </el-col>
        </el-row>
      </el-row>
      <div v-if="tasksFlowInitDone">
        <div v-for="dataflow in flows" :key="flows.flowName">
          <el-col style="height: 100%; width: calc(40% - 4px);">
            <el-row>
              <div class="borderedRect" style="width: 100%; margin-top: 6px; margin-left: 7px;">
                <div style="height: 280px; margin: 2px;">
                  <TDAG style="margin-top: 5px"
                        :dataflow="dataflow"
                        :height="16"
                        :marginTop="13"></TDAG>
                </div>
              </div>
            </el-row>
            <el-row>
              <div class="outborderedRect" style="width: 100%; margin-top: 2px; margin-left: 2px;">
                <div class="borderedRect"
                     style="width: calc(100% - 4px); margin-top: 2px; margin-left: 2px;margin-right: 2px;">
                  <!--                  <Dataflow style="width: 100%; height: 180px; margin-top: 2px; margin-left: 2px;"-->
                  <!--                            :dataflow="dataflow"-->
                  <!--                            :isQueryFlow="true"-->
                  <!--                            :height="420"/>-->
                  <div style="width: 100%; height: 180px; margin-top: 2px; margin-left: 2px;">
                    <svg v-if="dataflow.tasksLayoutDone" class="vertexFlowClass" style="width: 100%; height: 100%">
                      <g transform="translate(0,0)">
                        <QueryFlow :queryFlow="dataflow.flow"
                                   :xScale="dataflow.xScale" :yScale="dataflow.yScale"></QueryFlow>
                      </g>
                    </svg>
                  </div>
                </div>
                <div class="borderedRect" style="width: calc(100% - 4px); height: 384px; margin: 2px;">
                  <Dataflow style="width: 100%; height: 375px; margin-top: 2px; margin-left: 2px;"
                            :dataflow="dataflow"
                            :isQueryFlow="false"
                            :height="375"/>
                </div>
              </div>
            </el-row>
          </el-col>
          <el-col style="height: 100%; width: calc(60% - 4px);">
            <div class="outborderedRect" style="height: 100%; width: calc(100% - 8px); margin: 2px;">
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
import QueryFlow from "@/components/Dataflow/flow/QueryFlow";

export default {
  name: "MainView",
  components: {Parallelism, Counter, TasksDetails, Dataflow, TDAG, QueryFlow},
  mounted() {
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query1"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query29"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "Query29/less_reducer"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "Query29/resource_competition"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query54_cold"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query54_hot"})
    // this.$store.commit("dataflow/getTasksFlow", {appName: "query0_11"})
  },
  data() {
    return {
      queryName: "Select Query",
      fold: false,
      queryList: ["Query17@TPC-DS", "Query29@TPC-DS", "Query54@TPC-DS", "Query29_2@TPC-DS", "Query69@TPC-DS", "Query79@TPC-DS", "Query69_2@TPC-DS"],
      // queryList: ["Query29@TPC-DS"],
      exeTime: "0",
      dataSize: "0",
      containerNum: "0"
    }
  },
  methods: {
    // showFlow() {
    //   this.$store.commit("dataflow/getTasksFlow", {appName: "query29"})
    // },
    queryFold() {
      this.queryName = "Query29@TPC-DS"
      this.fold = !this.fold
      console.log(this.fold)
    },
    loadData() {
      this.$store.commit("dataflow/getTasksFlow", {appName: "Query29/less_reducer"})

      // this.$store.commit("dataflow/getTasksFlow", {appName: "query29"})
    }
  },
  computed: {
    ...mapState('dataflow', {
      flowMap: state => state.flowMap,
      flows: state => state.flows,
      tasksFlowInitDone: state => state.tasksFlowInitDone
    }),
  },
  watch: {
    // queryName() {
    //   this.loadData()
    // }
    tasksFlowInitDone(newVal){
      if (newVal){
        this.exeTime = "45"
        this.containerNum = "60"
        this.dataSize = "100"
      }
    }
  }
}
</script>

<style>
.borderedRect {
  border: 2px solid rgba(68, 68, 68, 0.9);
  background-color: #f5f5f5;
}

.outborderedRect {
  border: 2px solid rgba(255, 255, 255, 0.9);
  background-color: #f5f5f5;
}

.info {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  line-height: 2;
  font-size: 20px;
  border: 2px solid rgba(68, 68, 68, 0.9);
}

.infoSelector {
  /*height: 30px;*/
  font-weight: bold;
  font-size: 18px;
  color: #36506a;
}
.el-input .el-input__inner {
  font-size: 1.6em;
  font-weight: bolder;
  padding: 0 20px;
  color: #36506a;
  text-align: center;
  border:solid 3px #36506a;
  height: 45px;
  /*background-color: white;*/
  /*border-radius: 2px*/

}
.el-select-dropdown__item {
  font-size: 1.0em;
  font-weight: bolder;
  padding: 0 20px;
  color: #36506a;
  text-align: center;
  border: grey;
}
</style>