import * as d3 from "d3";
import {Flow} from "@/models/Flow";

export class DataFlow {
    flowName

    flow

    vertexFlowMap = new Map
    vertexFlowList = []
    vertexList

    selectedVertex = ""
    selectedTask = null
    isClickToShowDetails = false
    clickedPosInfo = {top: 140, left: 850}
    containerTasks = new Map

    connectedFlows = []//[(srcX,srcY1,srcY2), (dstX,dstY1,dstY2)]
    cntSrcToDstMap = new Map

    edges = [] //(srcVex, dstVex)

    startTime
    endTime

    xScale
    yScale

    tasksFlowInitDone = false
    tasksLayoutDone = false

    constructor() {
        this.xScale = d3.scaleLinear()
        this.yScale = d3.scaleLinear()
        this.flow = new Flow()
    }

    initFlow(heights, beforeFlow, leftFlow, processedFlow) {
        this.flow.initFlow(heights, beforeFlow, leftFlow, processedFlow)
        let stepLen = (this.endTime - this.startTime) / (beforeFlow.length - 1)
        this.flow.times = new Array(beforeFlow.length).fill(0)
        for (let i = 0; i < this.flow.times.length; i += 1) {
            this.flow.times[i] = i * stepLen + this.startTime
        }
    }

    updateXScale(range) {
        // console.log("dataflow", [this.startTime, this.endTime], range)
        this.xScale.domain([this.startTime, this.endTime]).range(range)
    }

    updateYScale(domain, range) {
        this.yScale.domain(domain).range(range)
    }

    updateVertexScale() {
        let _this = this
        this.vertexList.forEach(vex => {
            let vertex = _this.vertexFlowMap.get(vex)
            vertex.updateXScale([_this.xScale(vertex.startTime), _this.xScale(vertex.endTime)])
            vertex.updateYScale([_this.yScale(vertex.yOff), _this.yScale(vertex.yOff + vertex.flow.maxHeight)])
        })
    }

    initCntRelation() {
        let _this = this
        this.vertexList.forEach(vex => {
            if (_this.cntSrcToDstMap[vex]) {
                let srcFlow = _this.vertexFlowMap.get(vex)
                let dsts = _this.cntSrcToDstMap[vex]
                dsts.forEach(dst => {
                    let dstVex = _this.vertexFlowMap.get(dst)
                    dstVex.srcVertexesFlow.push(srcFlow)
                    srcFlow.dstVertexesFlow.push(dstVex)
                })
            }
        })
    }

    initCntFlow() {
        let _this = this
        this.vertexList.forEach(vex => {
            if (_this.cntSrcToDstMap[vex]) {
                let srcFlow = _this.vertexFlowMap.get(vex)
                let dsts = _this.cntSrcToDstMap[vex]
                let srcInfo = [srcFlow.xScale(srcFlow.endTime), srcFlow.yScale(0), srcFlow.yScale(srcFlow.flow.beforeProFlow[0])]
                dsts.forEach(dst => {
                    let dstVex = _this.vertexFlowMap.get(dst)
                    let dstInfo = [dstVex.xScale(dstVex.startTime), dstVex.yScale(0), dstVex.yScale(dstVex.flow.heights[0])]
                    _this.connectedFlows.push([[dstVex.xScale(d3.min([dstVex.totalStartTime, srcFlow.endTime])), srcInfo[1], srcInfo[2]], dstInfo])
                })
            }
        })
    }
}