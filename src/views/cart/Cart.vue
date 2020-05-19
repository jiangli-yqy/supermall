<template>
  <div id="cart">
    <!-- 顶部导航栏 -->
    <nav-bar class="cart-nav">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <!-- 中间列表展示 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>
<script>
import NavBar from "components/common/navbar/NavBar.vue";


import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'


import { mapGetters } from 'vuex'


export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    // }
    // 把GETTERS里面的东西直接拿到这里用的方法
    ...mapGetters(['cartLength', 'cartList'])
  },
}
</script>

<style scoped>
#cart {
  /* padding-top: 44px; */
  height: 100vh;
  /* vh   视口高度；100vh，100%视口 */
  position: relative;
}

.cart-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
</style>