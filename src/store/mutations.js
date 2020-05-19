export default {
  // mutations 唯一的目的就是修改state中的状态
  // mutations 中每个方法尽可能完成的事情比较单一一点
    // addCart(state,payload) {
    //   let oddProduct = null;
    //   for(let item of state.cartList){
    //     if(item.iid === payload.iid) {
    //       oddProduct = item;
    //     }
    //   }
    //   if(oddProduct) {
    //     oddProduct.count += 1;
    //   }else {
    //     payload.count = 1;
    //     state.cartList.push(payload)
    //   }
    // }
    addCounter(state, payload) {
      payload.count++;
    },
    addToCart(state, payload) {
      payload.checked = true;
      state.cartList.push(payload)
    }
}