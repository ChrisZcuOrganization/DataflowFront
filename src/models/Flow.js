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
        this.maxHeight = d3.max(heights)
    }
}
