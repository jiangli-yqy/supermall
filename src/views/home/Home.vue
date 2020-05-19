<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      class="tab-control"
      v-show="isTabFixed"
    ></tab-control>

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <!-- :pull-up-load="true" 是否需要上拉加载更多 -->
      <!-- @pullingUp="loadMore" 上拉加载更多接收子组件传递过来的自定义事件 -->
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view />
      <!-- class="tab-control" 吸顶效果不起作用了 -->
      <tab-control
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <!-- 给tab-control动态绑定类，:class="{fixed:isTabFixed}" 再设置相应position:fixed属性行不通-->
      <goods-list :goods="showCoods" />
    </scroll>

    <!-- 组件不能直接监听点击，需加native -->
    <back-top
      @click.native="backClick"
      v-show="isShowBackTop"
    />

  </div>
</template>
<script>
import NavBar from "components/common/navbar/NavBar.vue";
import TabControl from "components/content/tabControl/TabControl.vue";
import GoodsList from "components/content/goods/GoodsList.vue";
import Scroll from 'components/common/scroll/Scroll.vue'
import BackTop from 'components/content/backtop/BackTop.vue'

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import { getHomeMultidata, getHomeGoods } from "network/home/home.js";
import { debounce } from 'common/utils.js'

export default {
  name: "Home",
  components: {
    NavBar,
    TabControl,
    GoodsList,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showCoods() {
      return this.goods[this.currentType].list
    }
  },
  destroyed() {
    console.log("distroyed");
  },
  activated() {
    // console.log("activated");
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log(this.$refs.scroll.scroll.y);
    this.saveY = this.$refs.scroll.getScrollY();
  },
  created() {
    //1、请求多个数据
    this.getHomeMultidata();
    //2、请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  mounted() {
    //1、监听事件总线上的事件
    //监听item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.$bus.$on('homeGoodsItemImageLoad', () => {
      //执行30次
      // this.$refs.scroll.refresh()
      // 对refresh调用非常频繁的问题进行防抖操作（debounce）/节流操作（throttle）
      //防抖
      refresh()
    })

    //2、获取组件的offsetTop(但是组件没有这个属性，所以要拿到组件里面的根元素div的这个属性)
    //但是所有组件都有$el属性，用于获取组件元素
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    // 必须等图片加载完成之后才能拿到最终的offsetTop
    // console.log(this.$refs.tabControl.$el.offsetTop);
  },
  methods: {
    // //防抖函数封装
    // debounce(func, delay) {
    //   let timer = null
    //   return function (...args) {
    //     if (timer) clearTimeout(timer)
    //     timer = setTimeout(() => {
    //       func.apply(this, args)
    //     }, delay);
    //   }
    // },
    //事件监听相关方法
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    backClick() {
      // console.log(this.$refs.scroll);
      //this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      // 封装的组件的scrollTo方法，而不是组件scroll的scroll属性的scrollTo方法
      this.$refs.scroll.scrollTo(0, 0, 500)
    },

    contentScroll(position) {
      // console.log(position);
      // 1、判断backtop是否显示
      this.isShowBackTop = (-position.y) > 1000 ? true : false;

      // 2、决定tabControl 是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop ? true : false;
    },

    loadMore() {
      // console.log("shangla");
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // console.log('swiperImageLoad');
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    // 网络请求相关方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 为了能够继续上拉加载更多，必须在加载完成后
        this.$refs.scroll.finishPullUp()
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  /* vh   视口高度；100vh，100%视口 */
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* .tab-control { */
/* 用better-scroll之后这个属性就不能起作用了 */
/* position: sticky; */
/* top: 44px;
  z-index: 9;
} */

/* 动态绑定类行不通 */
/* .fixed {
  position: fixed;
  left: 0;
  top: 44px;
  right: 0;
} */

.tab-control {
  position: relative;
  z-index: 9;
}

.content {
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px; */
  /* height: 300px; */
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>