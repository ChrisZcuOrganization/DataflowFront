import {VertexFlow} from "@/models/VertexFlow";
import {DataFlow} from "@/models/DataFlow";

export function initVertexFlow(state, flows, flowName) {
    let dataFlow = new DataFlow()
    dataFlow.flowName = flowName
    dataFlow.startTime = flows.start_time
    dataFlow.endTime = flows.end_time
    // dataFlow.endTime = flows.start_time + 75811
    // console.log(flows.end_time - flows.start_time)
    // console.log(dataFlow.startTime, dataFlow.endTime)
    // console.log(flows)
    let queryFlow = flows.overall_flow
    dataFlow.initFlow(-1, queryFlow.before_flow, queryFlow.left_flow, queryFlow.processed_flow)
    let vertexesFlow = flows.vertexes_flow
    let vertexes = flows.vertexes
    dataFlow.vertexList = vertexes
    dataFlow.cntSrcToDstMap = flows.connect
    vertexes.forEach(vName => {
        let vertex = new VertexFlow()
        let flow = vertexesFlow[vName]
        vertex.vertexName = vName

        vertex.operatorsList = flow["operators"]
        vertex.startTime = flow["start_time"]
        vertex.totalStartTime = flow["total_start_time"]
        vertex.processStartTime = flow["process_start_time"]
        vertex.outputStartTime=flow["output_start_time"]
        vertex.processEndTime = flow["process_end_time"]
        vertex.inputEndTime = flow["input_end_time"]
        vertex.endTime = flow["end_time"]
        vertex.totalEndTime = flow["total_end_time"]

        vertex.srcDataDis = flow["src_data_dis"]
        vertex.calDataDis = flow["cal_data_dis"]

        vertex.tasksList = flow["tasks_list"]

        vertex.initTasksFlow(flow["start_time"], flow["end_time"], flow["tasks_flow"])

        dataFlow.vertexFlowMap.set(vName, vertex)
        dataFlow.vertexFlowList.push(vertex)
    })
    dataFlow.initCntRelation()

    state.flowMap.set(flowName, dataFlow)
    state.flows.push(dataFlow)
}