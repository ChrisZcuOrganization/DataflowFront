import Vue from 'vue'
import Vuex from 'vuex'
import dataflow from "./models/dataflow"

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        dataflow
    },
    // strict: debug,
    strict: false,
})
