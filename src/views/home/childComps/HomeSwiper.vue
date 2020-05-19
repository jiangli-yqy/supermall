<template>
  <swiper>
    <swiper-item
      v-for="item in banners"
      :key="item.image"
    >
      <a :href="item.link">
        <img
          :src="item.image"
          alt=""
          @load="swiperImageLoad"
        >
      </a>
    </swiper-item>
  </swiper>
</template>
<script>
import { Swiper, SwiperItem } from "components/common/swiper/index.js"

export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 控制图片加载事件发送次数
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    swiperImageLoad() {
      // console.log('swiperImageLoad');
      // 只需要发出一次事件就可以了，不用发送四次
      // this.$emit('swiperImageLoad')
      if (!this.isLoad) {
        this.$emit('swiperImageLoad');
        this.isLoad = true;
      }
    }
  }
}
</script>