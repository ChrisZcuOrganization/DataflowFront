import * as d3 from "d3";

export class DataFlow {
    flowName

    vertexFlowMap = new Map
    vertexFlowList = []
    vertexList

    connectedFlows = []//[(srcX,srcY1,srcY2), (dstX,dstY1,dstY2)]
    cntSrcToDstMap = new Map

    startTime
    endTime

    xScale
    yScale

    tasksFlowInitDone = false
    tasksLayoutDone = false

    constructor() {
        this.xScale = d3.scaleLinear()
        this.yScale = d3.scaleLinear()
    }

    updateXScale(range) {
        console.log("dataflow", [this.startTime, this.endTime], range)
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
                let srcInfo = [srcFlow.xScale(srcFlow.endTime), srcFlow.yScale(0), srcFlow.yScale(srcFlow.flow.heights[srcFlow.flow.heights.length - 1])]
                dsts.forEach(dst => {
                    let dstVex = _this.vertexFlowMap.get(dst)
                    let dstInfo = [dstVex.xScale(dstVex.startTime), dstVex.yScale(0), dstVex.yScale(dstVex.flow.heights[0])]
                    _this.connectedFlows.push([srcInfo, dstInfo])
                })
            }
        })
    }
}