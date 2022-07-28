<template>
  <div>
    <svg v-if="tasksLayoutDone" class="vertexFlowClass" style="width: 100%; height: 100%">
      <g>
        <g v-for="(cntFlow, id) in connectedFlow" :key="id">
          <ConnectedFlow :flow="cntFlow"></ConnectedFlow>
        </g>
      </g>
      <g>
        <g v-for="(vertexFlow, idx) in vertexesFlow" :key="idx">
          <VertexFlow :vertexFlow="vertexFlow"
          ></VertexFlow>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import {mapState} from "vuex";
import VertexFlow from "@/components/Dataflow/flow/VertexFlow";
import ConnectedFlow from "@/components/Dataflow/flow/ConnectedFlow";

export default {
  name: "Dataflow",
  props: ["dataflow"],
  components: {VertexFlow, ConnectedFlow},
  data() {
    return {
      width: -1,
      height: -1,
      rectX: -1,
      rectY: -1,
      vertexesFlow: [],
      connectedFlow: []
    }
  },
  mounted() {
    this.width = this.$el.getBoundingClientRect().width - 10
    this.height = this.$el.getBoundingClientRect().height - 10
    this.rectX = this.$el.getBoundingClientRect().x
    this.rectY = this.$el.getBoundingClientRect().y
    // this.$store.commit("dataflow/getTasksFlow", {appName: "Query29"})
    this.$store.commit("dataflow/appLayout", {
      dataflow: this.dataflow,
      x: 0,
      width: this.width,
      y: 0,
      height: this.height
    })
  },
  watch: {
    // tasksFlowInitDone(newV, oldV) {
    //   if (newV) {
    //     this.$store.commit("dataflow/appLayout", {appName: "Query29", x: this.rectX, width: this.width,y:this.rectY, height: this.height})
    //   }
    // },
    tasksLayoutDone(newV, oldV) {
      if (newV) {
        this.connectedFlow = this.dataflow.connectedFlows
        // this.vertexesFlow = this.dataflow.vertexFlowList
        this.vertexesFlow = [this.dataflow.vertexFlowMap.get("Map 8")]
      }
    }
  },
  methods: {},
  computed: {
    ...mapState('dataflow', {
      // tasksFlowInitDone: state => state.tasksFlowInitDone,
      // tasksLayoutDone: state => state.tasksLayoutDone,
      // flowMap: state => state.flowMap
    }),
    tasksLayoutDone() {
      return this.dataflow.tasksLayoutDone
    }
    // vertexesFlow() {
    //   return this.tasksLayoutDone ? this.flowMap["Query29"] : []
    // }
  }
}

</script>

<style scoped>

</style>