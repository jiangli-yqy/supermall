<template>
  <div class="tab-bar-item" @click="itemClick">
    <!-- <slot v-if="!isActive" name="item-icon"></slot>
    <slot v-else name="item-icon-active"></slot> -->
        <!-- <img src="../../assets/img/tabbar/home.svg" alt="">
        <div>首页</div> -->
        <!-- <slot name="item-text"></slot> -->
        <!-- 插槽最好包装一层 -->
        <div v-if="!isActive"><slot name="item-icon"></slot></div>
        <div v-else><slot name="item-icon-active"></slot></div>
        <!-- <div :class="{active: isActive}"><slot name="item-text"></slot></div> -->
        <div :style="activeStyle"><slot name="item-text"></slot></div>
        </div>
      <!-- <div class="tab-bar-item">
        <img src="../../assets/img/tabbar/category.svg" alt="">
        分类
        </div>
      <div class="tab-bar-item">
        <img src="../../assets/img/tabbar/shopcart.svg" alt="">
        购物车
        </div>
      <div class="tab-bar-item">
        <img src="../../assets/img/tabbar/profile.svg" alt="">
        我的
        </div> -->
</template>
<script>
export default {
  name: "TabBarItem",
  props: {
    path: String,
    activeColor: {
      type: String,
      default: "red"
    }
  },
  data() {
    return {
      // isActive: true,
    }
  },
  computed:{
    isActive() {
      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      this.$router.push(this.path)
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}
.tab-bar-item img{
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-bottom: 2px;
}
/* .active{
  color: red;
} */
</style>