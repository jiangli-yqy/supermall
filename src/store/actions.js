export default {
  // {state,commit} = context
  addCart(context, payload) {
    return new Promise((resolve,reject) => {
      let oddProduct = null;
    for (let item of context.state.cartList) {
      if (item.iid === payload.iid) {
        oddProduct = item;
      }
    }
    if (oddProduct) {
      // oddProduct.count += 1;
      context.commit('addCounter', oddProduct)
      resolve('当前的商品数量+1')
    } else {
      payload.count = 1;
      // context.state.cartList.push(payload)
      context.commit('addToCart', payload)
      resolve('添加了新的商品')
    }
    })
  }
}