<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @navClick="navClick" ref="nav" />
    <scroll class="content" ref="scroll" @scrollC="contentScroll" :probe-type="3">
      <ul>
        <li v-for="item in $store.state.cartList" :key="item.index">{{item}}</li>
      </ul>
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommends" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addCart="addCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import { debounce } from "common/utils";
import { itemImgListenerMixin, backTopMixin } from "common/mixin";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
  },
  mixins: [itemImgListenerMixin, backTopMixin],
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
      themeTopYs: [],
      currentIndex: 0,
    };
  },
  created() {
    // 1.保存传入的iid
    // this.iid = this.$route.params.iid;
    this.iid = this.$route.query.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      // 1.获取顶部的图片轮播数据
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6.取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      // 1.第一次获取，值不对。
      // 值不对的原因：this.$refs.params.$el 压根没有渲染
      // this.themeTopYs.push(0);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      // this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44);
      // console.log(this.themeTopYs);

      // 2.第二次获取，值不对。
      // 值不对的原因：图片没有计算在内
      // this.$nextTick(() => {
      //   // 根据最新的数据，对应的DOM是已经被渲染出来
      //   // 但是图片依然没有加载完(目前获取到offsetTop不包含其中的图片)
      //   // offsetTop 值不对的时候，都是因为图片的问题
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44);
      //   console.log(this.themeTopYs);
      // });
    });

    // 3.获取推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.recommends = res.data.list;
    });
  },
  methods: {
    imageLoad() {
      // console.log("打印加载图片");
      this.$refs.scroll.refresh();

      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    },

    // 1.导航栏点击哪一个 滚动到对应的主题
    navClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },

    // 2.滚动主题，导航栏上面实现联动
    contentScroll(position) {
      // console.log(position);
      // (1).获取y值
      const positionY = -position.y;
      // (2)positionY 和主题中值进行对比
      // [0, 12760, 13689, 14000]

      // positionY 在 0 和 12760 之间，index = 0
      // positionY 在 =12760 和 13689 之间，index = 1
      // positionY 在 13689 和 14000 之间，index = 2

      // positionY 大于等于 14000，index = 3
      let length = this.themeTopYs.length;
      for (let i = 0; i < length; i++) {
        // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
        //   console.log(i); // 只能取到0,1,2的值。取不到3。所以这个方法不好
        // }
        // 因此得判断i的值，分两种情况，0-2以及3
        // if (
        //   this.currentIndex !== i &&
        //   ((i < length - 1 &&
        //     positionY >= this.themeTopYs[i] &&
        //     positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        // ) {
        //   this.currentIndex = i;
        //   // console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }

        // 第三种方法：搞一个大的值
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // this.isShowBackTop = -position.y > 1000;
      this.listenShowBackTop(position);
    },

    // 3.添加到购物车
    addCart() {
      // console.log("添加到购物车");
      // (1)获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // (2)将商品添加到购物车里
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      this.$store.dispatch("addCart", product);
    },
  },
  mounted() {
    // const refresh = debounce(this.$refs.scroll.refresh, 200);
    // this.itemImgListener = () => {
    //   refresh();
    // };
    // this.$bus.$on("itemImageLoad", this.itemImgListener);
    // console.log("Detail.vue 里面自己的mounted");
  },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
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
  background-color: #fff;
  z-index: 9;
}

.content {
  height: calc(100% - 44px);
}
</style>