import Vue from 'vue'
import Vuex from 'vuex'

// 1.安装插件
Vue.use(Vuex)

// 2.创建实例对象
const store = new Vuex.Store({
  state: {
    // cartList: [商品1，商品2，商品3]
    cartList: []
  },
  mutations: {
    // mutations唯一的目的就是修改state中状态
    // mutations中的每一个方法尽可能完成的事件比较单一一点
    addCounter(state, payload) {
      payload.count++
    },
    addToCart(state, payload) {
      state.cartList.push(payload)
    }
  },
  actions: {
    addCart(context, payload) {
      // payload新添加的商品
      // 数组常用的方法有哪些？push/pop/unshift/shift/sort/reverse/map/filter/reduce/join
      // let oldProduct = null
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item
      //   }
      // }
      // 1.查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit('addCounter', oldProduct)
      } else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit('addToCart', payload)
      }
    }
  },
  getters: {

  },
  modules: {

  }
})

// 3.挂载Vue实例上
export default store