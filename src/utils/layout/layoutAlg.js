import * as d3 from "d3"
import {Graph} from "@/models/Graph";

function sortedVertexFlow(dataflow) {
    let vexTimeTuples = []
    let dataflowMap = dataflow.vertexFlowMap
    dataflow.vertexList.forEach(vex => {
        vexTimeTuples.push({
            "vertex": vex,
            "startTime": dataflowMap.get(vex).startTime,
            "endTime": dataflowMap.get(vex).endTime
        })
    })
    vexTimeTuples.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1)
    return vexTimeTuples
}

export function directLayout(dataflow, height) {
    let vexTimeTuples = sortedVertexFlow(dataflow)
    let dataflowMap = dataflow.vertexFlowMap
    dataflowMap.get(vexTimeTuples[0].vertex).yOff = 0

    let lastYOff = 0
    let lastYHeight = dataflowMap.get(vexTimeTuples[0].vertex).flow.maxHeight
    for (let idx = 1; idx < vexTimeTuples.length; idx += 1) {
        dataflowMap.get(vexTimeTuples[idx].vertex).yOff = lastYOff + lastYHeight
        lastYOff = lastYOff + lastYHeight
        lastYHeight = dataflowMap.get(vexTimeTuples[idx].vertex).flow.maxHeight
    }
    dataflow.updateYScale([0, Math.log(lastYOff + lastYHeight)], [0, height])
    dataflow.updateVertexScale()
    dataflow.initCntFlow()
}

function vexInteract(vex1, vex2) {
    if (vex1.endTime <= vex2.startTime) {
        return false
    }
    let endVerifyTime = d3.min([vex1.endTime, vex2.endTime])
    let vex1VerifyIdx = 0
    let vex2VerifiedIdx = 0
    let curTime = vex2.flow.times[vex2VerifiedIdx]
    while (curTime < endVerifyTime) {
        for (; vex1VerifyIdx < vex1.flow.times.length; vex1VerifyIdx += 1) {
            if (vex1.flow.times[vex1VerifyIdx] >= curTime)
                break
        }
        // if (((vex1.yOff - (vex2.flow.heights[vex2VerifiedIdx] + vex2.yOff)) * (vex1.flow.heights[vex1VerifyIdx] + vex1.yOff - vex2.yOff)) < 0) {
        //     return true
        // }
        if (((vex1.yOff - (vex2.flow.processedFlow[vex2VerifiedIdx] + vex2.flow.leftFlow[vex2VerifiedIdx] + vex2.flow.beforeProFlow[0] + vex2.yOff))
            * (vex1.flow.processedFlow[vex2VerifiedIdx] + vex1.flow.leftFlow[vex2VerifiedIdx] + vex1.flow.beforeProFlow[0] + vex1.yOff - vex2.yOff)) < 0)
            return true
        curTime = vex1.flow.times[vex1VerifyIdx] + 1
    }
    return false
}

function verityInteracted(targetVex, vexList) {
    for (let idx = vexList.length - 1; idx > -1; idx -= 1) {
        let verVex = vexList[idx]
        if (vexInteract(verVex, targetVex)) {
            return verVex
        }
    }
    return null
}

export function neighborLayout(dataflow, y, height) {
    let vexTimeTuples = sortedVertexFlow(dataflow)
    let dataflowMap = dataflow.vertexFlowMap
    let maxHeight = 0
    // forward
    let finishedVertexList = []
    vexTimeTuples.forEach(vex => {
        let targetVex = dataflowMap.get(vex.vertex)

        maxHeight = d3.max([maxHeight, targetVex.maxScore])

        targetVex.leaderVertex = targetVex
        targetVex.yOff = 0
        targetVex.srcVertexesFlow.forEach(flow => {
            if (flow.maxScore > targetVex.leaderVertex.maxScore) {
                targetVex.leaderVertex = flow
                targetVex.yOff = flow.yOff + flow.flow.beforeProFlow[0] + d3.max([maxHeight / 10, flow.maxScore / 3])
            }
        })
        let interactedVex = verityInteracted(targetVex, finishedVertexList)
        while (interactedVex) {
            targetVex.yOff = interactedVex.yOff + interactedVex.maxScore
            interactedVex = verityInteracted(targetVex, finishedVertexList)
        }
        finishedVertexList.push(targetVex)
    })
    //reverse
    finishedVertexList = []
    vexTimeTuples.forEach(vex => {
        let targetVex = dataflowMap.get(vex.vertex)
        targetVex.dstVertexesFlow.forEach(flow => {
            if (flow.maxScore > targetVex.leaderVertex.maxScore) {
                targetVex.leaderVertex = flow
                targetVex.yOff = flow.yOff + d3.max([maxHeight / 10, flow.maxScore / 3])
            }
        })
        let interactedVex = verityInteracted(targetVex, finishedVertexList)
        while (interactedVex) {
            targetVex.yOff = interactedVex.yOff + interactedVex.maxScore
            interactedVex = verityInteracted(targetVex, finishedVertexList)
        }
        finishedVertexList.push(targetVex)
    })

    let yOff = 0
    finishedVertexList.forEach(vex => {
        yOff = d3.max([yOff, vex.yOff + vex.maxScore])
    })
    dataflow.updateYScale([0, yOff], [y, y + height])
    dataflow.updateVertexScale()
    dataflow.initCntFlow()

    // TDAGLayout(dataflow)
    TDAGGreedyLayout(dataflow)
    // console.log(dataflow)
}

function offSortedVertexFlow(dataflow) {
    let vexTimeTuples = []
    let dataflowMap = dataflow.vertexFlowMap
    dataflow.vertexList.forEach(vex => {
        vexTimeTuples.push({
            "vertex": vex,
            "yOff": dataflowMap.get(vex).yOff
        })
    })
    vexTimeTuples.sort((a, b) => (a.yOff > b.yOff) ? 1 : -1)
    return vexTimeTuples
}

function isInterRect(vex1, vex2) {
    return !(vex1.endTime < vex2.startTime || vex1.startTime > vex2.endTime)
}

function isAnyInterRect(vex1, vertexNames, lIdx, idx, dataflowMap) {
    for (let i = lIdx; i < idx; ++i) {
        let vertex = dataflowMap.get(vertexNames[i].vertex)
        if (isInterRect(vex1, vertex))
            return true
    }
    return false
}

function processData(dataflow) {
    // console.log(data);
    let graph = new Graph()
    for (let vertexName of dataflow.vertexList) {
        let vertexInfo = dataflow.vertexFlowMap.get(vertexName)
        graph.setNode(vertexName, vertexInfo.totalStartTime, vertexInfo.totalEndTime)
    }

    for (let vertexName of dataflow.vertexList) {
        let childrenIds = dataflow.cntSrcToDstMap[vertexName]
        if (childrenIds !== undefined) {
            for (let cid of childrenIds) {
                graph.setEdge(vertexName, cid)
                dataflow.edges.push({"srcVex": vertexName, "dstVex": cid})
            }
        }
    }
    graph.greedyGraphLayout()

    // let tmp = []
    for (let node of graph.nodes) {
        // tmp.push({"id": node.id, "layer": node.layer, "y": node.y})
        dataflow.vertexFlowMap.get(node.id).TDAGYOff = node.layer
    }
    // tmp.sort((a, b) => (a.y > b.y ? 1 : -1))
    // console.log(tmp)

}

function TDAGGreedyLayout(dataflow) {
    processData(dataflow)

}

function TDAGLayout(dataflow) {
//     let vexTimeTuples = sortedVertexFlow(dataflow)
    let dataflowMap = dataflow.vertexFlowMap
//     let curLine = 0
//     vexTimeTuples.forEach(vex =>{
//         let vertex = dataflowMap.get(vex.vertex)
//
//    })
    let vexYOffTuples = offSortedVertexFlow(dataflow)
    let curLine = 0
    let idx = 0
    for (; idx < vexYOffTuples.length; ++idx) {
        let vexName = vexYOffTuples[idx].vertex
        let vertex = dataflowMap.get(vexName)
        vertex.TDAGYOff = curLine
        idx += 1
        let lIdx = idx - 1
        for (; idx < vexYOffTuples.length; ++idx) {
            let vexNameTmp = vexYOffTuples[idx].vertex
            let vertexTmp = dataflowMap.get(vexNameTmp)
            if (isAnyInterRect(vertex, vexYOffTuples, lIdx, idx, dataflowMap)) {
                --idx;
                break
            } else {
                vertexTmp.TDAGYOff = curLine
                vertex = vertexTmp
            }
        }
        curLine += 1
    }
    // let vertex = dataflowMap.get(vexYOffTuples[idx - 1].vertex)
    // if (vertex.TDAGYOff === undefined)
    //     vertex.TDAGYOff = curLine
}