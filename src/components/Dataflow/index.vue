<template>
  <div style="width: 100%; height: 100%">
    <div v-if="isQueryFlow" style="width: 100%; height: 100%">
      <div style="width: 100%; height: 100%">
        <svg v-if="tasksLayoutDone" class="vertexFlowClass" style="width: 100%; height: 100%">
          <g transform="translate(10,0)">
            <QueryFlow :queryFlow="dataflow.flow"
                       :xScale="dataflow.xScale" :yScale="dataflow.yScale"></QueryFlow>
          </g>
        </svg>
      </div>
    </div>
    <div v-if="!isQueryFlow" style="width: 100%; height: 100%">
      <div style="width: 100%; height: 100%; ">
<!--        <svg t="1658991951479" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"-->
<!--             p-id="2343" width="220" height="32" @click="changeDetailsShow"-->
<!--             transform="translate(500,0)">-->
<!--&lt;!&ndash;          <g>&ndash;&gt;-->
<!--&lt;!&ndash;            <text x="-4000" y="700" font-size="500">{{ dataflow.flowName }}</text>&ndash;&gt;-->
<!--&lt;!&ndash;          </g>&ndash;&gt;-->
<!--          <rect x="100" y="50" height="800" width="800" fill="white"></rect>-->
<!--          <path-->
<!--              d="M818.176 314.368c-26.624-52.224-94.208-149.504-220.16-92.16-77.824 35.84-121.856 56.32-121.856 56.32l-112.64 49.152c-31.744 15.36-101.376-6.144-140.288-20.48-11.264-4.096-21.504 8.192-16.384 19.456 26.624 52.224 94.208 149.504 220.16 92.16 77.824-35.84 234.496-103.424 234.496-103.424 31.744-15.36 101.376 6.144 140.288 20.48 11.264 2.048 21.504-9.216 16.384-21.504zM547.84 479.232c-14.336 8.192-70.656 33.792-70.656 33.792l-56.32 24.576C393.216 552.96 332.8 532.48 296.96 518.144c-10.24-5.12-19.456 8.192-14.336 18.432 22.528 51.2 82.944 143.36 193.536 87.04 68.608-34.816 126.976-57.344 126.976-57.344 27.648-15.36 88.064 5.12 123.904 19.456 10.24 4.096 19.456-8.192 14.336-19.456-23.552-51.2-83.968-143.36-193.536-87.04z m-40.96 226.304c-11.264 6.144-30.72 18.432-30.72 18.432-21.504 13.312-66.56-4.096-93.184-17.408-7.168-4.096-14.336 8.192-10.24 18.432 16.384 46.08 61.44 129.024 144.384 77.824 30.72-19.456 30.72-18.432 30.72-18.432 22.528-11.264 66.56 4.096 93.184 16.384 7.168 4.096 14.336-8.192 10.24-18.432-16.384-45.056-58.368-123.904-144.384-76.8z"-->
<!--              p-id="2344" :fill="isDetailedFlow ? '#1296db' : '#2c2c2c'">-->
<!--          </path>-->
<!--        </svg>-->
        <svg v-if="tasksLayoutDone" class="vertexFlowClass" style="width: 100%; height: 100%;">
          <g transform="translate(10,10)">
            <g v-if="false">
              <g v-for="(cntFlow, id) in connectedFlow" :key="id">
                <ConnectedFlow :flow="cntFlow"></ConnectedFlow>
              </g>
            </g>
            <g>
              <g v-for="(vertexFlow, idx) in vertexesFlow" :key="idx">
                <VertexFlow :vertexFlow="vertexFlow"
                            :isDetailedFlow="isDetailedFlow"
                            :dataflow = "dataflow"
                ></VertexFlow>
              </g>
              <g v-for="(vertexFlow, idx) in vertexesFlow" :key="'i' + idx">
                <dataflowInfo :flow="vertexFlow.flow"
                              :vertexFlow="vertexFlow"
                              :xScale="vertexFlow.xScale"
                              :yScale="vertexFlow.yScale"
                              :boundHeight="boundHeight"
                ></dataflowInfo>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import VertexFlow from "@/components/Dataflow/flow/VertexFlow";
import ConnectedFlow from "@/components/Dataflow/flow/ConnectedFlow";
import QueryFlow from "@/components/Dataflow/flow/QueryFlow";
import DataflowInfo from "@/components/Dataflow/flow/dataflowInfo";

export default {
  name: "Dataflow",
  props: ["dataflow", "isQueryFlow", "height"],
  components: {QueryFlow, VertexFlow, ConnectedFlow,DataflowInfo},
  data() {
    return {
      width: -1,
      // height: -1,
      rectX: -1,
      rectY: -1,
      vertexesFlow: [],
      connectedFlow: [],
      isDetailedFlow: false,
      // isQueryFlow: false
    }
  },
  mounted() {
    this.width = this.$el.getBoundingClientRect().width - 10
    // this.height = this.$el.getBoundingClientRect().height - 35
    let heightTmp = this.height - 50;
    this.rectX = this.$el.getBoundingClientRect().x
    this.rectY = this.$el.getBoundingClientRect().y
    this.$store.commit("dataflow/appLayout", {
      dataflow: this.dataflow,
      x: 0,
      width: this.width,
      y: 0,
      height: heightTmp
    })
  },
  watch: {
    tasksLayoutDone(newV, oldV) {
      if (newV) {
        this.connectedFlow = this.dataflow.connectedFlows
        this.vertexesFlow = this.dataflow.vertexFlowList
        this.queryFlow = this.dataflow.flow
        // this.vertexesFlow = [this.dataflow.vertexFlowMap.get("Map 8")]
      }
    }
  },
  methods: {
    changeDetailsShow() {
      this.isDetailedFlow = !this.isDetailedFlow
    },
  },
  computed: {
    ...mapState('dataflow', {
      // tasksFlowInitDone: state => state.tasksFlowInitDone,
      // tasksLayoutDone: state => state.tasksLayoutDone,
      // flowMap: state => state.flowMap
    }),
    boundHeight(){
      return this.$el.getBoundingClientRect().height - 10
    },
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