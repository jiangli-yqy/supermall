<template>
  <!-- ref明确拿到某一个子组件 -->
  <div
    class="wrapper"
    ref="wrapper"
  >
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>

import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    // 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 不设置这个属性，默认为false，这种情况下，组件内的button是可以点击的，但是div和子组件这些都不能点击，所以在这里必须设置为true
      click: true,
      // 并不是所有界面应用BScroll的时候都需要实时监听，会影响性能，所以不能写死
      // probeType: 3
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    //监听滚动位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position);
        // 传出位置,通过自定义事件
        this.$emit('scroll', position)
      })
    }
    // 监听滚动到底部
    // this.scroll.on('pullingUp', () => {
    //   this.$emit('pullingUp')
    // })
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // console.log("---------");
      this.scroll && this.scroll.refresh && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>
</style>