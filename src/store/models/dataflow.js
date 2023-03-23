import dataService from "@/service/dataService";
import {initVertexFlow} from "@/utils/initialize-utils/flowInitializer";
import {directLayout, neighborLayout} from "@/utils/layout/layoutAlg";
import {initTasksDetails} from "@/utils/initialize-utils/tasksDetailsInit";

const state = () => ({
    flows: [],
    flowMap: new Map(),
    tasksFlowInitDone: false,
    tasksLayoutDone: false,
    allFlowRenderDone: false
})
const actions = {}

const mutations = {
    updateFlowRender(state, {dataflow: dataflow}) {
        for (let vertexFlow of dataflow.vertexList) {
            if (!dataflow.vertexFlowMap.get(vertexFlow).flowRenderDone) {
                state.allFlowRenderDone = false
                return
            }
        }
        state.allFlowRenderDone = true
    },
    getTasksFlow(state, {appName: appName}) {
        dataService.getTasksFlow({"app": appName}, resp => {
            initVertexFlow(state, resp, appName)
            dataService.getMapTasksDetails({"app": appName}, resp => {
                initTasksDetails(state.flowMap.get(appName), resp)
                state.tasksFlowInitDone = true
            })
        })

    },
    appLayout(state, {dataflow: dataflow, x: x, width: width, y: y, height: height}) {
        dataflow.updateXScale([x, x + width])

        // directLayout(dataflow, height)
        neighborLayout(dataflow, y, height)
        dataflow.tasksLayoutDone = true
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}