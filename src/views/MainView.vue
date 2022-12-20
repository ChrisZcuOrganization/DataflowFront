<template>
  <el-row style="height: 100%; width: 100%;" :gutter="8">
    <el-col :span="24" style="height: 100%; width: 100%; overflow-y: scroll;">
      <el-row style="height: 40px; width: 100%">
        Query information: execution time, allocated container (number, memory, cpu core) (only highlight difference for comparison)
      </el-row>
      <div v-for="dataflow in flows" :key="flows.flowName">
        <el-col style="height: 100%; width: 50%;">
          <el-row>
            <div class="borderedRect" style="width: 100%; margin-top: 2px; margin-left: 2px;">
              <div style="height: 200px;">
                TDAG, cite from GHive demo, used without details about layout
              </div>
            </div>
          </el-row>
          <el-row>
            <div class="borderedRect" style="width: 100%; margin-top: 2px; margin-left: 2px;">
              <div class="borderedRect"
                   style="width: calc(100% - 8px); margin-top: 2px; margin-left: 2px;margin-right: 2px;">
                <Dataflow style="width: 100%; height: 130px; margin-top: 2px; margin-left: 2px;"
                          :dataflow="dataflow"
                          :isQueryFlow="true"
                          :height="300"/>
              </div>
              <div class="borderedRect" style="width: calc(100% - 8px); margin: 2px;">
                <Dataflow style="width: 100%; height: 300px; margin-top: 2px; margin-left: 2px;"
                          :dataflow="dataflow"
                          :isQueryFlow="false"
                          :height="300"/>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col style="height: 100%; width: 50%;">
          <div class="borderedRect" style="height: 100%; width: calc(100% - 8px); margin: 2px;">
            <div class="borderedRect" style="height: 340px; width: calc(100% - 8px); margin: 2px;">
              Tasks speed details
            </div>
            <div class="borderedRect" style="height: 300px; width: calc(100% - 8px); margin: 2px;">
              Tasks counter distribution
            </div>
          </div>
        </el-col>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Dataflow from "@/components/Dataflow"
import {mapState} from "vuex";

export default {
  name: "MainView",
  components: {Dataflow},
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
      flows: state => state.flows
    }),
  }
}
</script>

<style scoped>
.borderedRect {
  border: 2px solid rgba(128, 128, 128, 0.9);
}

</style>