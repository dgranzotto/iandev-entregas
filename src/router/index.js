import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// import { loading, dismissLoading } from '../ui-util'
import uiUtil from '../ui-util'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,
    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    // console.log('Router Before: ')
    // console.log(to)
    // console.log(from)
    // console.log(next)
    if (from.matched.length > 1 && from.matched[1].instances.default.beforeLeave) { // chama o método beforeLeave() quando o mesmo existir
      if (from.matched[1].instances.default.beforeLeave(to)) {
        uiUtil.loading()
        next()
      } else {
        next(false)
      }
    } else {
      uiUtil.loading()
      next()
    }
  })

  Router.afterEach((to, from, next) => {
    // console.log('Router After: ')
    // console.log(to)
    // console.log(from)
    // console.log(next)
    uiUtil.dismissLoading()
    // window.scrollTo(0, 0)
  })

  return Router
}
