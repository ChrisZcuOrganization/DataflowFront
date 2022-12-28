<template>
  <div style="height:100%; width: 100%">
    <el-col style="height:248px; width: 25%">
      <div v-if="tasksList.length > 0" class="borderedRect"
           style="height:100%; width: 100%; margin-top:4px; overflow-y: scroll;overflow-x: hidden">
        <counterList @counterChange="handleCounterChange" :tasksList="tasksList" :counterMap="counterMap"/>
      </div>
    </el-col>
    <el-col style="height:248px; width: calc(75% - 10px); margin-left: 10px">
      <el-row style="height: 10%; width: 100%">{{ counterName }}</el-row>
      <el-row style="height: 90%; width: 100%">
        <counterScatter v-if="counterName !== '' && tasksList.length > 0"
                        style="height:100%; width: 100%"
                        :counterValues="counterMap.get(counterName).values"
                        :tasksList="tasksList"
                        :counterName="counterName"/>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import CounterList from "@/components/Counter/counter/CounterList";
import CounterScatter from "@/components/Counter/counter/CounterScatter";

export default {
  name: "Counter",
  components: {CounterScatter, CounterList},
  props: ["dataflow"],
  data() {
    return {
      counterName: ""
    }
  },
  methods: {
    handleCounterChange(c) {
      this.counterName = c.key
    }
  },
  computed: {
    tasksList() {
      return this.dataflow.selectedVertex === "" ? [] : this.dataflow.vertexFlowMap.get(this.dataflow.selectedVertex).tasksList
    },
    counterMap() {
      let counterMap = new Map()
      this.tasksList.forEach(task => {
        for (let key in task.counter) {
          if (!counterMap.has(key)) {
            counterMap.set(key, {tasksIds: [], values: []})
          }
          counterMap.get(key).values.push(task.counter[key])
        }
      })
      return counterMap
    }
  }

}
</script>

<style scoped>

</style>