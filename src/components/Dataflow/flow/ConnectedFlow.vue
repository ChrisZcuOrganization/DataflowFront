<template>
  <g>
    <path :d="pathModels" fill="#cab2d6"
          stroke="#cab2d6"
          stroke-width="1"></path>
  </g>
</template>

<script>
import {areaGen} from "@/utils/util";

export default {
  name: "ConnectedFlow",
  props: ["flow"],
  created() {
  },
  computed: {
    pathModels() {
      let srcInfo = this.flow[0]
      let dstInfo = this.flow[1]
      let points = [
        srcInfo,
        dstInfo
      ]
      return areaGen(points)
    }
  }
}
</script>

<style scoped>

</style>