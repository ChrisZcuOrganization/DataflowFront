import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
// Vue.use(VueAxios, axios);
Vue.prototype.axios = axios

const dataServerUrl = "http://10.16.3.177:5000";

// function getConfiguration(param, callback){
// const url = `${dataServerUrl}/get_configuration`;
//   axios.post(url, param)
//       .then(response =>{
//           callback(response.data)
//       }, errResponse => {
//           console.log(errResponse)
//       })
// }

function getTestFlow(param, callback) {
    const url = `${dataServerUrl}/api/test`;
    // const url = `/api/test`;

    axios.get(url, param)
        .then(response => {
            callback(response.data)
        }, errResponse => {
            console.log("error from getTestFlow request", errResponse)
        })
}

function getTasksFlow(param, callback) {
    const url = `${dataServerUrl}/api/tasks_flow/`;
    axios.post(url, param)
        .then(response => {
            callback(response.data)
        }, errResponse => {
            console.log("error from getTaskFlow request", errResponse)
        })
}
function getMapTasksDetails(param, callback){
    const url = `${dataServerUrl}/api/tasks_details/`;
    axios.post(url, param)
        .then(resp => {
            callback(resp.data)
        }, errResp=>{
            console.log("error from getMapTasksDetails request", errResp)
        })
}
export default {
    getTestFlow,
    getTasksFlow,
    getMapTasksDetails
}
