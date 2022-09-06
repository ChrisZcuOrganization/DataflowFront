import * as d3 from "d3";

export class Flow {
    heights = []
    times = []

    beforeProFlow = []
    leftFlow = []
    processedFlow = []


    maxHeight

    constructor() {
    }

    initFlow(heights, beforeFlow, leftFlow, processedFlow) {
        this.beforeProFlow = beforeFlow
        this.leftFlow = leftFlow
        this.processedFlow = processedFlow

        this.heights = heights

        let tmpMax = 0
        for (let id =0; id < leftFlow.length; ++id ){
            let tmpSum = leftFlow[id] + processedFlow[id]
            tmpMax = d3.max([tmpSum, tmpMax])
        }
        this.maxHeight = d3.max(heights) + tmpMax
    }
}
