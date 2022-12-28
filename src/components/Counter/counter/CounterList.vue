<template>
  <div style="height: 100%; margin-top: 2px">
    <div v-for="(c, index) in counterList" :key="index">
      <div @click="counterClick(c,index)"
           :style="{width: rectStyle.width, height:rectStyle.height, margin: rectStyle.mt, board: rectStyle.board, background: c.color}">
        <p :id="'textBoard' + index"
           style="height: 18px;border-width: 2px; border-color: grey; border-style: solid;font-size:11px; dominant-baseline: middle;text-anchor:middle; margin-top: 4px;">
          {{ c.key }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3"

const varColorGen = d3.interpolateRgb('rgb(204,236,230)', 'rgb(25,123,57)')

export default {
  name: "CounterList",
  props: ["tasksList", "counterMap"],
  mounted() {
  },
  data() {
    return {}
  },
  methods: {
    counterClick(c, index) {
      this.$emit("counterChange", c)
    }
  },
  computed: {
    rectStyle() {
      // <div :style="width: calc(100% - 4px);height: 20px; margin-top: 1px; border:; background-color: c.color">
      return {width: "calc(100% - 4px)", height: "20px", mt: "1px", board: "1px solid grey"}
    },
    counterList() {
      let counterList = [], minDeVia = 2, maxDeVia = 0
      for (let [key, value] of this.counterMap) {
        let scale = d3.scaleLinear().domain(d3.extent(value.values)).range([0, 1])
        let tmp = []
        value.values.forEach(v => {
          tmp.push(scale(v))
        })
        counterList.push({key: key, deviation: d3.deviation(tmp), color: varColorGen(d3.deviation(tmp))})
        minDeVia = d3.min([minDeVia, d3.deviation(tmp)])
        maxDeVia = d3.max([maxDeVia, d3.deviation(tmp)])
      }
      let scale = d3.scaleLinear().domain([minDeVia, maxDeVia]).range([0, 1])
      for (let item of counterList) {
        item.deviation = scale(item.deviation)
      }
      counterList.sort((a, b) => {
        return a.deviation > b.deviation ? -1 : 1
      })
      return counterList
    }
  },
  watch: {
    // tasksList() {
    //   console.log(this.counterList)
    // }
  }
}
</script>

<style scoped>

</style>