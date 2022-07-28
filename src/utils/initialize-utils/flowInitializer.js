import {VertexFlow} from "@/models/VertexFlow";
import {DataFlow} from "@/models/DataFlow";

export function initVertexFlow(state, flows, flowName) {
    let dataFlow = new DataFlow()
    dataFlow.flowName = flowName
    dataFlow.startTime = flows.start_time
    dataFlow.endTime = flows.end_time


    let vertexesFlow = flows.vertexes_flow
    let vertexes = flows.vertexes
    dataFlow.vertexList = vertexes
    dataFlow.cntSrcToDstMap = flows.connect
    vertexes.forEach(vName => {
        let vertex = new VertexFlow()
        let flow = vertexesFlow[vName]
        vertex.vertexName = vName
        vertex.startTime = flow["start_time"]
        vertex.endTime = flow["end_time"]

        vertex.initTasksFlow(flow["start_time"], flow["end_time"], flow["tasks_flow"])

        dataFlow.vertexFlowMap.set(vName, vertex)
        dataFlow.vertexFlowList.push(vertex)
    })
    dataFlow.initCntRelation()

    state.flowMap.set(flowName, dataFlow)
    state.flows.push(dataFlow)
}