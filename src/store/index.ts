
import { createStore } from 'vuex'
import getters from './getters'
const modules = {}
const modulesContext = require.context('./modules', true, /\.ts$/)
modulesContext.keys().forEach(_module => {
  const componentConfig = modulesContext(_module)
  const ctrl = componentConfig.default || componentConfig
  const moduleName = _module.split('.')[1].slice(1)
  modules[moduleName] = ctrl
})

export default createStore({
  modules,
  getters
})

