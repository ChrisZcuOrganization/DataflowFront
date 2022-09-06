import * as d3 from "d3"

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
}