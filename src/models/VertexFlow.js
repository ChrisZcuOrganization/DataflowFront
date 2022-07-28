import {TaskFlow} from "@/models/TaskFlow";
import {Flow} from "@/models/Flow";
import {MBR} from "@/models/MBR";
import * as d3 from "d3";

export class VertexFlow {
    vertexName
    startTime
    endTime

    /**The exact flow unit*/
    flow
    xOff
    yOff

    xScale
    yScale

    taskFlows = []

    /**MBR layout*/
    MBR

    srcVertexesFlow = []
    dstVertexesFlow = []

    leaderVertex
    leadingVertexes = []
    maxScore

    constructor() {
        this.flow = new Flow()
        this.xScale = d3.scaleLinear()
        this.yScale = d3.scaleLinear()
    }

    initTasksFlow(startTime, endTime, tasksFlows) {
        let flowHeights = new Array(tasksFlows[0][0].length).fill(0)

        let beforeFlow = new Array(tasksFlows[0][0].length).fill(0)
        let leftFlow = new Array(tasksFlows[0][0].length).fill(0)
        let processedFlow = new Array(tasksFlows[0][0].length).fill(0)

        let stepLen = (this.endTime - this.startTime) / flowHeights.length
        this.flow.times = new Array(tasksFlows[0][0].length).fill(0)
        for (let i =0; i < this.flow.times.length; i +=1){
            this.flow.times[i] = i * stepLen + this.startTime
        }

        let _this = this
        tasksFlows.forEach(f => {
            let taskFlow = new TaskFlow(f,stepLen, _this.startTime)
            _this.taskFlows.push(taskFlow)
            for (let idx = 0; idx < flowHeights.length; idx += 1) {
                flowHeights[idx] += (f[0][idx] + f[1][idx] + f[2][idx])
                beforeFlow[idx] += f[0][idx]
                leftFlow[idx] += (f[1][idx])
                processedFlow[idx] += f[2][idx]
            }
        })
        // console.log(leftFlow)
        this.flow.initFlow(flowHeights, beforeFlow, leftFlow, processedFlow)
        this.maxScore = this.flow.maxHeight
    }

    updateXScale(range) {
        this.xScale.domain([this.startTime, this.endTime]).range(range)
        this.xOff = this.xScale(this.startTime)
    }

    updateYScale(range) {
        this.yScale.domain([0, this.flow.maxHeight]).range(range)
        this.yOff = this.yScale(this.yOff)
    }
}