import VueRouter from 'vue-router'
import MainView from "@/views/MainView"
const routes = [
    {path: '/', redirect: '/dataflow'},
    {path: "/dataflow", component: MainView},
]

export default new VueRouter({
    mode: 'hash',
    routes
})
