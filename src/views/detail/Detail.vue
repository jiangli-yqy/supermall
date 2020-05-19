<template>
  <div id="detail">
    <detail-nav-bar
      class="detail-nav"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-images-info
        :images-info="detailInfo"
        @imgLoad="imgLoad"
      ></detail-images-info>
      <detail-param-info
        ref="params"
        :param-info="paramInfo"
      ></detail-param-info>
      <detail-comment-info
        ref="comment"
        :comment-info="commentInfo"
      ></detail-comment-info>
      <goods-list
        ref="recommends"
        :goods="recommends"
      ></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top
      @click.native="backClick"
      v-show="isShowBackTop"
    />

    <!-- <toast
      :message="message"
      :show="show"
    /> -->
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll.vue'
import GoodsList from "components/content/goods/GoodsList.vue";
import BackTop from 'components/content/backtop/BackTop.vue'
// import Toast from 'components/common/toast/Toast.vue'

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailImagesInfo from "./childComps/DetailImagesInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";


import { getDetail, Goods, Shop, GoodsParams, getRecommend } from 'network/detail';

import { debounce } from 'common/utils.js'

export default {
  name: "Detail",
  components: {
    Scroll,
    GoodsList,
    BackTop,
    // Toast,
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImagesInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopsY: [],
      currentIndex: 0,
      isShowBackTop: false,
      // message: "",
      // show: false
    }
  },
  created() {
    // console.log(this.$route.params);
    //保存传入的iid
    this.iid = this.$route.params.iid

    //根据iid请求详情页数据
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.result;
      // 获取轮播图数据
      this.topImages = data.itemInfo.topImages;
      //获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //创建店铺信息
      this.shop = new Shop(data.shopInfo)
      //获取商品详细信息
      this.detailInfo = data.detailInfo
      // console.log(data.detailInfo);
      //获取参数信息
      this.paramInfo = new GoodsParams(data.itemParams.info, data.itemParams.rule)
      //取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      //更新Y值
      // this.$nextTick(() => {
      // 根据最新数据，DOM已经渲染完了，但是图片还没有加载完
      //   this.themeTopsY = [];
      //   this.themeTopsY.push(0);
      //   this.themeTopsY.push(this.$refs.params.$el.offsetTop);
      //   this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopsY.push(this.$refs.recommends.$el.offsetTop);
      //   console.log(this.themeTopsY);
      // })
    })

    //请求详情数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })
  },

  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    this.$bus.$on('homeGoodsItemImageLoad', () => {
      // this.$refs.scroll.refresh()
      // 对refresh调用非常频繁的问题进行防抖操作（debounce）/节流操作（throttle）
      //防抖
      refresh()
    })

    // 获取Y值
    // this.themeTopsY.push(0);
    // this.themeTopsY.push(this.$refs.params.$el.offsetTop);
    // this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopsY.push(this.$refs.recommends.$el.offsetTop);
  },

  //可以在这里更新Y，但是每改变一个数据都会更新，更新太频繁
  // updated() {
  //   this.themeTopsY = [];
  //   this.themeTopsY.push(0);
  //   this.themeTopsY.push(this.$refs.params.$el.offsetTop);
  //   this.themeTopsY.push(this.$refs.comment.$el.offsetTop);
  //   this.themeTopsY.push(this.$refs.recommends.$el.offsetTop);
  //   console.log(this.themeTopsY);

  // },
  methods: {
    imgLoad() {
      this.$refs.scroll.refresh();
      // 图片加载完获取classList
      this.getClassList();


      this.themeTopsY = [];
      this.themeTopsY.push(0);
      this.themeTopsY.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopsY.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopsY.push(this.$refs.recommends.$el.offsetTop - 44);
      // console.log(this.themeTopsY);
    },
    // 获取classList
    getClassList() {
      // Array.from() 将伪数组转换成纯数组
      this.detailClassList = [];
      this.detailClassList = Array.from(document.getElementsByClassName("detail-set-scroll"));
      let maxValue = 10000000;
      this.detailClassList.push({ offsetTop: maxValue });
      // console.log(this.detailClassList);
    },

    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -(this.themeTopsY[index]), 200)
    },

    contentScroll(position) {
      // console.log(position);
      //获取Y值
      const positionY = -position.y;
      let len = this.themeTopsY.length;
      this.themeTopsY.push(Number.MAX_VALUE);
      // for (let i in this.themeTopsY) 
      for (let i = 0; i < len - 1; i++) {
        // i = parseInt(i);
        // console.log(i);

        // i是个字符串
        // if (this.currentIndex !== i && ((i < len - 1 && positionY >= this.themeTopsY[i] && positionY < this.themeTopsY[i + 1]) || (i === len - 1 && positionY >= this.themeTopsY[i]))) {
        // console.log(i);
        if (this.currentIndex !== i && (positionY >= this.themeTopsY[i] && positionY < this.themeTopsY[i + 1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = i
        }
      }

      // 是否显示回到顶部
      this.isShowBackTop = positionY > 1000 ? true : false;
    },

    backClick() {
      // console.log(this.$refs.scroll);
      //this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      // 封装的组件的scrollTo方法，而不是组件scroll的scroll属性的scrollTo方法
      this.$refs.scroll.scrollTo(0, 0, 500)
    },


    // 添加购物车
    addToCart() {
      // console.log('------');
      // 获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //将商品添加到购物车 使用vueX
      // this.$store.cartList.push(product)
      // 使用mutations调用commit
      // this.$store.commit('addCart', product);
      // 使用actions调用dispatch
      this.$store.dispatch('addCart', product).then(res => {
        // console.log(res);
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = '';
        // }, 1500)

        // 封装效果
        this.$toast.show(res, 2000)
        // console.log(this.$toast);

      })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 58px);
}
</style>