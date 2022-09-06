<template>
  <el-row style="height: 100%; width: 100%;" :gutter="8">
    <el-col :span="24" style="height: 100%; overflow-y: scroll;">
      <div v-for="dataflow in flows" :key="flows.flowName" class="borderedRect"
           style="margin-top: 2px; margin-left: 2px;">
        <Dataflow style="width: 100%; height: 300px; margin-top: 2px; margin-left: 2px;"
                  :dataflow="dataflow"/>
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

    this.$store.commit("dataflow/getTasksFlow", {appName: "Query29"})
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