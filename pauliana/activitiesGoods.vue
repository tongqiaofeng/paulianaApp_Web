<template>
  <view class="container">
    <view class="recommend-goods-box">
      <GoodsList :scrollTop="scrollTop" :goodsList="recList" />
      <text class="font-tip" v-if="loadStatus">没有更多了!</text>
    </view>
  </view>
</template>

<script>
const app = getApp();
import * as Api from "@/api/api";
import { api_host } from "@/utils/request";

import GoodsList from "@/components/goods-list/goods-list";

export default {
  components: { GoodsList },
  data() {
    return {
      imgUrl: this.$baseUrl,
      localImgUrl: app.globalData.localImgUrl,
      apiHost: api_host,
      searchValue: "",
      scrollTop: 0,

      recList: [], // 推荐产品
      loadStatus: false, // 加载数据状态
    };
  },
  onLoad() {
    this.getActivityList();
  },
  methods: {
    // 活动列表
    async getActivityList() {
      const { data: res } = await Api.activityList();
      console.log("活动列表", res);

      if (res.code == 200) {
        this.activityList = res.data;
      }
    },

    goJewelryDetails(productId) {
      uni.navigateTo({
        url: `/pauliana/jewelryDetails?id=${productId}`,
      });
    },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getActivityList();

    setTimeout(() => {
      uni.showToast({
        title: "刷新成功",
        icon: "none",
      });
      uni.stopPullDownRefresh();
    }, 500);
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding-bottom: 60rpx;

  // recommend
  .recommend-goods-box {
    width: 100%;
    padding: 0 30rpx;
    margin-top: 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
}
</style>
