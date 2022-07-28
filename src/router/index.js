import VueRouter from 'vue-router'
import MainView from "@/views/MainView"
const routes = [
    {path: "/Dataflow", component: MainView},
    {path: '/', redirect: '/Dataflow'},
]

export default new VueRouter({
    mode: 'history',
    routes
})
