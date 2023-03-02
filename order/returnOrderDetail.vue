<template>
  <view class="return-detail-container" v-if="isShow">
    <!-- 退货退款详情页 -->
    <view class="detail-top">
      <view class="top-main">
        <view class="main-title-time">
          <view class="title">
            {{ editState(returnDetail.status, returnDetail.payStatus) }}
          </view>
          <view class="time" v-show="returnDetail.refundTime">
            <!-- 剩余商家同意时间 -->
            {{ returnDetail.refundTime }}
          </view>
        </view>
        <uni-steps
          :options="stepsList"
          active-icon="circle"
          :active="active"
          activeColor="#55B8B8"
        />
      </view>
    </view>
    <view class="detail-product">
      <view class="product-msg">
        <view class="msg-top">
          <view class="msg-img">
            <image
              v-if="returnDetail.img"
              :src="imgUrl + returnDetail.img.trim()"
              mode="aspectFill"
            >
            </image>
            <image
              v-else
              src="../static/imgs/common/nopic.jpg"
              mode="aspectFill"
            ></image>
          </view>

          <view class="product-right">
            <view class="name">
              {{ returnDetail.productName }}
            </view>
            <view class="price-num">
              <view class="price">
                <text style="font-size: 24rpx">￥</text>
                <text>{{ formatNumberRgx(returnDetail.refundAmount) }}</text>
              </view>
              <view class="num">
                {{ "x" + returnDetail.num }}
              </view>
            </view>
          </view>
        </view>
        <view class="msg-every">
          <view class="every-left">
            <text class="title">退款类型</text>
            <text class="content">{{
              returnDetail.type == 0 ? "仅退款" : "退货退款"
            }}</text>
          </view>
        </view>
        <view class="msg-every">
          <view class="every-left">
            <text class="title">退款原因</text>
            <text class="content">{{ returnDetail.reason }}</text>
          </view>
        </view>
        <view class="msg-every">
          <view class="every-left">
            <text class="title">退款金额</text>
            <text class="content"
              >￥ {{ formatNumberRgx(returnDetail.refundAmount) }}</text
            >
          </view>
        </view>
        <view class="msg-every">
          <view class="every-left">
            <text class="title">申请时间</text>
            <text class="content">{{ returnDetail.createTime }}</text>
          </view>
        </view>
        <view class="msg-every">
          <view class="every-left">
            <text class="title">退款编号</text>
            <text class="content">{{ returnDetail.outRefundNo }}</text>
          </view>
          <view class="every-right" @click="copyOut"> 复制 </view>
        </view>
        <!-- <view class="msg-every" v-show="returnDetail.refundTime">
					<view class="every-left">
						<text class="title">退款时间</text>
						<text class="content">{{returnDetail.refundTime}}</text>
					</view>
				</view> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      imgUrl: this.$baseUrl,
      height: null,
      returnId: null,
      returnDetail: {},
      stepsList: [
        {
          title: "同意退款",
        },
        {
          title: "微信处理中",
        },
        {
          title: "到账成功",
        },
      ],
      active: -1,
    };
  },
  onLoad(option) {
    uni.getSystemInfo({
      success: (data) => {
        // 将其赋值给this
        this.height = data.statusBarHeight;
        console.log("height");
        console.log(this.height);
      },
    });

    this.returnId = option.id;
    this.getReturnInfo();
  },
  methods: {
    // 复制退款编号
    copyOut() {
      console.log("复制");
      uni.setClipboardData({
        data: this.returnDetail.outTradeNo, //要被复制的内容
        success: () => {
          //复制成功的回调函数
          uni.showToast({
            //提示
            title: "复制成功",
            icon: "none",
          });
        },
      });
    },
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // 获取退款详情
    getReturnInfo() {
      uni.showLoading({
        title: "加载中...",
      });
      uni.request({
        url:
          this.$baseUrl +
          "/refundInfo?id=" +
          this.returnId,
        header: {
          "content-type": "application/json",
          token: uni.getStorageSync("token"),
        },
        complete: (res) => {
          uni.hideLoading();
          console.log("退款详细信息");
          console.log(res);
          this.returnDetail = res.data.data;

          if (this.returnDetail.status == 1) {
            this.active = 0;
          }

          if (this.returnDetail.payStatus == 1) {
            this.active = 1;
          }

          if (this.returnDetail.payStatus == 2) {
            this.active = 2;
          }

          this.isShow = true;
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.return-detail-container {
  height: 100vh;
  background-color: #f1f1f1;

  .detail-top {
    padding: 36rpx 24rpx 20rpx;
    background-color: #85dbdb;

    .top-main {
      padding: 39rpx 30rpx 40rpx;
      background-color: #fff;
      border-radius: 20rpx;

      .main-title-time {
        margin-bottom: 47rpx;
        text-align: left;

        .title {
          font-size: 34rpx;
          color: #000;
          font-weight: bold;
        }

        .time {
          margin-top: 9rpx;
          color: #999999;
          font-size: 22rpx;
        }
      }
    }
  }

  .detail-product {
    margin-top: 20rpx;
    padding: 0 24rpx;

    .product-msg {
      padding: 32rpx 20rpx;
      background-color: #fff;
      border-radius: 20rpx;

      .msg-top {
        margin-top: 39rpx;
        display: flex;
        justify-content: space-between;

        .msg-img {
          margin-right: 19rpx;

          image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 20rpx;
          }
        }

        .product-right {
          padding-bottom: 17rpx;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name {
            font-size: 26rpx;
            text-align: left;
          }

          .price-num {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              font-size: 36rpx;
            }

            .num {
              color: #999999;
              font-size: 24rpx;
            }
          }
        }
      }

      .msg-every {
        margin-top: 40rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .every-left {
          display: flex;
          align-items: center;

          .title {
            margin-right: 41rpx;
            font-size: 24rpx;
            color: #999999;
          }

          .content {
            font-size: 24rpx;
            color: #000;
          }
        }

        .every-right {
          font-size: 24rpx;
          color: #55b8b8;
        }
      }
    }
  }
}
</style>
