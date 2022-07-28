import {Flow} from "@/models/Flow";

export class TaskFlow {

    container
    exeMachine

    dataMachine

    flow

    constructor(f, stepLen, startTime) {
        this.flow = new Flow()
        let len = f[0].length
        let flowHeights = new Array(len).fill(0)
        let beforeFlow = new Array(len).fill(0)
        let leftFlow = new Array(len).fill(0)
        let processedFlow = new Array(len).fill(0)
        this.flow.times = new Array(len).fill(0)

        for (let idx = 0; idx < len; idx += 1) {
            flowHeights[idx] += (f[0][idx] + f[1][idx] + f[2][idx])
            beforeFlow[idx] += (f[0][idx])
            leftFlow[idx] += (f[1][idx])
            processedFlow[idx] += (f[2][idx])
        }
        this.flow.initFlow(flowHeights, beforeFlow, leftFlow, processedFlow)

        for (let i = 0; i < this.flow.times.length; i += 1) {
            this.flow.times[i] = i * stepLen + startTime
        }

    }
}