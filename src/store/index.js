import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList: []
  },
  mutations,
  // 有判断逻辑的步骤和异步操作最好放在actions
  // actions: {
  //   // {state,commit} = context
  //   addCart(context, payload) {
  //     let oddProduct = null;
  //     for (let item of context.state.cartList) {
  //       if (item.iid === payload.iid) {
  //         oddProduct = item;
  //       }
  //     }
  //     if (oddProduct) {
  //       // oddProduct.count += 1;
  //       context.commit('addCounter', oddProduct)
  //     } else {
  //       payload.count = 1;
  //       // context.state.cartList.push(payload)
  //       context.commit('addToCart', payload)
  //     }
  //   }
  // },
  actions,
  getters,
  modules: {
  }
})
