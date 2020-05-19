<template>
  <div class="cart-bottom-bar">
    <div class="check-content">
      <CheckButton
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      ></CheckButton>
      <span>全选</span>
    </div>

    <div class="totalPrice">
      合计：{{totalPrice}}
    </div>

    <div class="calc">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from './CheckButton'

import { mapGetters } from 'vuex'


export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },

    checkLength() {
      return this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.count
      }, 0)
    },

    isSelectAll() {
      if (this.cartList.length === 0) {
        return false
      }
      // if (this.cartList.filter(item => !item.checked).length !== 0) {
      //   return false
      // } else {
      //   return true
      // }
      return !(this.cartList.filter(item => !item.checked).length)
    }
  },

  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach(element => {
          element.checked = false
        });
      } else {
        this.cartList.forEach(element => {
          element.checked = true
        });
      }

      //不能下面这样简化
      // this.cartList.forEach(element => {
      //   element.checked = !this.isSelectAll
      // });
    },
  }
}
</script>

<style scoped>
.cart-bottom-bar {
  height: 60px;
  background-color: #eee;
  position: relative;
  bottom: 60px;
  line-height: 60px;
  display: flex;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.totalPrice {
  margin-left: 50px;
}

.calc {
  margin-left: 50px;
  color: rgb(245, 100, 16);
  /* background-color: rgb(245, 100, 16); */
}
</style>