<template>
  <view class="goods-list" :style="{ marginTop: marginTop + 'rpx' }">
    <view
      class="goods-item"
      v-for="item in goodsList"
      :key="item.id"
      @click="goJewelryDetails(item)"
    >
      <view class="goods-cover-img">
        <EasyLoadimage
          v-if="isEasyImage"
          class="goods-img"
          mode="aspectFill"
          :imageSrc="apiHost + item.img"
          :scrollTop="scrollTop"
        />

        <image
          v-else
          class="goods-img"
          mode="aspectFill"
          :src="apiHost + item.img"
        ></image>
      </view>
      <view class="goods-name ellipsis">{{ item.productName }}</view>
      <view v-if="item.tagPrice != 0 && item.type == 1">
        <image
          class="discount-icon"
          v-if="localImgUrl && item.isDiscount == 1"
          :src="localImgUrl + '/common/discount_icon.png'"
        ></image>
        <view :class="{ marginTop30: item.isDiscount != 1 }" class="price">
          <text>
            ￥
            <text style="font-size: 30rpx">{{
              item.isDiscount == 1
                ? formatNumberRgx(item.discountPrice)
                : formatNumberRgx(item.tagPrice)
            }}</text>
          </text>
        </view>
      </view>
      <view v-if="item.tagPrice != 0 && item.type == 2">
        <image
          class="discount-icon"
          v-if="localImgUrl && item.isVipProduct == 1"
          :src="localImgUrl + '/common/vip_icon.png'"
        ></image>
        <view :class="{ marginTop30: item.isVipProduct != 1 }" class="price">
          <text>
            ￥
            <text style="font-size: 30rpx">{{
              item.isVipProduct == 1
                ? formatNumberRgx(item.discountPrice)
                : formatNumberRgx(item.tagPrice)
            }}</text>
          </text>
        </view>
      </view>

      <view
        v-if="item.tagPrice == 0"
        class="price"
        :style="{ marginTop: '30rpx' }"
        >价格请咨询客服</view
      >
    </view>
  </view>
</template>

<script>
const app = getApp();
import { api_host } from "@/utils/request";

import EasyLoadimage from "@/components/easy-loadimage/easy-loadimage";
export default {
  components: { EasyLoadimage },
  name: "goods-list",
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否懒加载图片
    isEasyImage: {
      type: Boolean,
      default: true,
    },
    scrollTop: {
      type: Number,
      default: 0,
    },
    marginTop: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      localImgUrl: app.globalData.localImgUrl,
      apiHost: api_host
    };
  },
  methods: {
    goJewelryDetails(item) {
      if (item.type == 1) {
        uni.navigateTo({
          url: `/pauliana/jewelryDetails?id=${item.id}`,
        });
      } else if (item.type == 2) {
        uni.navigateTo({
          url: `/pauliana/materialDetails?id=${item.id}`,
        });
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.goods-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  .goods-item {
    font-family: "PingFang SC-Medium";
    font-weight: 500;
    margin-top: 50rpx;
    width: 330rpx;

    &:nth-of-type(1),
    &:nth-of-type(2) {
      margin-top: 0;
    }

    .goods-cover-img {
      width: 304rpx;
      height: 304rpx;
      overflow: hidden;
      padding-left: 13rpx;

      .goods-img {
        width: 100%;
        height: 100%;
        border-radius: 4rpx;
      }
    }

    .goods-name {
      font-size: 28rpx;
      color: #1f2033;
      // line-height: 28rpx;
      margin-top: 30rpx;
      padding-left: 13rpx;
    }

    .discount-icon {
      width: 76rpx;
      height: 32rpx;
      margin-top: 14rpx;
      margin-bottom: 14rpx;
      padding-left: 13rpx;
    }

    .goods-price {
      font-size: 28rpx;
      color: #55b8b8;
      line-height: 28rpx;
      padding-left: 13rpx;

      &::before {
        content: "￥";
        font-size: 28rpx;
        color: #55b8b8;
      }
    }

    .price {
      font-size: 24rpx;
      color: #55b8b8;
      line-height: 24rpx;
      padding-left: 13rpx;
      // margin-top: 30rpx;
    }

    .marginTop30 {
      margin-top: 30rpx;
    }
  }
}
</style>
