<template>
  <view class="details-container">
    <!-- 珠宝成品详情 -->
    <view class="">
      <uni-swiper-dot
        :info="imgSrc"
        :current="current"
        mode="dot"
        :dotsStyles="dotsStyles"
      >
        <swiper
          class="swiper-box"
          style="height: 1000rpx"
          @change="swiperChange"
        >
          <swiper-item v-for="(item, index) in imgSrc" :key="index">
            <view class="swiper-item" @click="imagePreview(index)">
              <EasyLoadimage
                :image-src="item"
                :scroll-top="scrollTop"
                width="750rpx"
                height="1000rpx"
                mode="aspectFill"
              ></EasyLoadimage>
            </view>
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>

    <view class="product-price-name">
      <view class="product-name" v-if="jewelryDetails.productName">
        <view
          class="name-one"
          :style="{
            'text-indent': jewelryDetails.isNewStyle == 1 ? '-.5em' : 0,
          }"
        >
          <text v-if="jewelryDetails.isNewStyle == 1">【新品】</text>
          <text>{{
            jewelryDetails.productName.indexOf("-") == -1
              ? jewelryDetails.productName
              : jewelryDetails.productName.split("-")[0]
          }}</text>
        </view>
        <view
          class="name-two"
          v-if="jewelryDetails.productName.indexOf('-') != -1"
        >
          {{ jewelryDetails.productName.split("-")[1] }}
        </view>
      </view>
      <view class="price-container" v-if="jewelryDetails.tagPrice != 0">
        <view>
          <text style="font-size: 34rpx">{{
            jewelryDetails.isDiscount == 1
              ? "￥" + formatNumberRgx(jewelryDetails.discountPrice)
              : "￥" + formatNumberRgx(jewelryDetails.tagPrice)
          }}</text>
          <text
            v-if="jewelryDetails.isDiscount == 1"
            style="margin-left: 8rpx; font-weight: normal"
            >折后价</text
          >
        </view>
        <text v-if="jewelryDetails.isDiscount == 1">
          <text
            style="
              margin-left: 18rpx;
              font-size: 24rpx;
              color: #aaadb2;
              text-decoration: line-through;
            "
            >{{ "￥" + formatNumberRgx(jewelryDetails.tagPrice) }}</text
          >
        </text>
      </view>
      <view class="price-container" v-else> 价格请咨询客服 </view>

      <view
        class="serve-container"
        style="margin-bottom: 20rpx"
        v-if="jewelryDetails.discount.length > 0"
      >
        <view class="serve-left">
          <text class="serve-title">优惠</text>
          <view
            class="serve-left-content"
            style="display: flex; flex-wrap: wrap"
          >
            <view
              v-for="(item, index) in jewelryDetails.discount"
              :key="index"
              class="discount"
              >{{ item }}
            </view>
          </view>
        </view>
      </view>

      <view class="serve-container" @click="openServePopup">
        <view class="serve-left">
          <text class="serve-title">服务</text>
          <view class="serve-left-content">
            <text>线下门店</text>
            <view class="circle"></view>
            <text>快递发货</text>
          </view>
        </view>
        <image
          class="serve-right"
          src="../static/imgs/common/right.png"
          mode="aspectFill"
        ></image>
      </view>
    </view>

    <uni-popup ref="servePopup" type="bottom">
      <view class="serve-popup-container">
        <view class="serve-every">
          <view class="title"> 线下门店 </view>
          <view class="content"> 该店铺拥有线下门店，店家已展示门店信息 </view>
        </view>
        <view class="serve-every">
          <view class="title"> 快递发货 </view>
          <view class="content"> 可选择快递发货配送上门，本商品免运费 </view>
        </view>
        <view class="serve-button" @click="closeServePopup"> 我知道了 </view>
      </view>
    </uni-popup>

    <view
      class="product-parameter"
      :style="{ padding: jewelryDetails.collocationList ? '0' : '0 0 160rpx' }"
    >
      <view class="parameter">宝贝详情</view>

      <view
        v-for="(item, index) in imgSrc3"
        :key="index"
        @click="imagePreview3(index)"
      >
        <image
          style="vertical-align: bottom; width: 750rpx"
          v-if="item"
          :src="item"
          mode="widthFix"
        ></image>
      </view>
    </view>

    <view
      class="product-collocation"
      style="padding: 0 0 160rpx"
      v-if="jewelryDetails.collocationList"
    >
      <image
        class="title-en"
        src="../static/imgs/details/recommend.png"
        mode="aspectFill"
      ></image>
      <view class="title-cn"> 搭配推荐 </view>
      <view class="collocation-main">
        <navigator
          :url="'../pauliana/jewelryDetails?id=' + item.id"
          hover-class="none"
          v-for="item in jewelryDetails.collocationList"
          :key="item.id"
        >
          <EasyLoadimage
            v-if="item.img"
            :image-src="imgUrl + item.img.trim()"
            :scroll-top="scrollTop"
            width="330rpx"
            height="440rpx"
            mode="aspectFill"
          >
          </EasyLoadimage>
          <view class="coll-name">
            {{ item.productName }}
          </view>
        </navigator>
      </view>
    </view>

    <view class="product-bottom">
      <view class="bottom-left">
        <view class="left-index" @click="goIndex">
          <image
            class="index-img"
            src="../static/imgs/details/index.png"
            mode="aspectFit"
          ></image>
          <view class="index-font">首页</view>
        </view>
        <button
          open-type="contact"
          :plain="true"
          show-message-card="true"
          :send-message-title="jewelryDetails.productName"
          :send-message-img="imgSrc[0]"
          :send-message-path="`/pauliana/jewelryDetails?id=${detailId}`"
          class="serviceButton"
        >
          <image
            class="index-img"
            src="../static/imgs/details/service.png"
            mode="aspectFill"
          ></image>
          <view class="index-font">客服</view>
        </button>
        <view class="left-collect" @click="isCollect">
          <image
            class="index-img"
            :src="jewelryDetails.isFavorite == 0 ? collect1 : collect2"
            mode="aspectFit"
          >
          </image>
          <view class="index-font">{{
            jewelryDetails.isFavorite == 0 ? "收藏" : "已收藏"
          }}</view>
        </view>
      </view>

      <view class="bottom-right">
        <view class="add-cart" @click="sureOrder(0)">加入购物车</view>
        <view class="buy-button" @click="sureOrder(1)">立即购买</view>
      </view>
    </view>
    <uni-popup ref="numPopup" type="bottom">
      <view class="num-popup-container">
        <view class="img-right">
          <image
            @click="closePopup"
            src="../static/imgs/details/close.png"
            mode="aspectFill"
          ></image>
        </view>
        <view class="img-left">
          <view class="img">
            <image class="img" :src="imgSrc[0]" mode="aspectFill"></image>
          </view>

          <view class="price">
            <view class="product-name">
              {{ jewelryDetails.productName }}
            </view>
            <view
              class="price-container"
              style="margin: 0"
              v-if="jewelryDetails.tagPrice != 0"
            >
              <view>
                <text style="font-size: 34rpx">{{
                  jewelryDetails.isDiscount == 1
                    ? "￥" + formatNumberRgx(jewelryDetails.discountPrice)
                    : "￥" + formatNumberRgx(jewelryDetails.tagPrice)
                }}</text>
                <text
                  v-if="jewelryDetails.isDiscount == 1"
                  style="margin-left: 8rpx; font-weight: normal"
                  >折后价</text
                >
              </view>
              <text v-if="jewelryDetails.isDiscount == 1">
                <text
                  style="
                    margin-left: 18rpx;
                    font-size: 24rpx;
                    color: #aaadb2;
                    text-decoration: line-through;
                  "
                  >{{ "￥" + formatNumberRgx(jewelryDetails.tagPrice) }}</text
                >
              </text>
            </view>
            <view class="price-container" v-else> 价格请咨询客服 </view>
          </view>
        </view>
        <view class="number">
          <text class="title">购买数量</text>
          <view class="price-num">
            <view class="num-button num-minus" @click="numChangeValue(0)">
              <view
                class="minus"
                :style="{
                  'background-color':
                    jewelryDetails.num > 1 ? '#000' : '#AAADB2',
                }"
              ></view>
            </view>
            <text class="num-input">{{ jewelryDetails.num }}</text>
            <view class="num-button num-add" @click="numChangeValue(1)">
              <image
                src="../static/imgs/order/add.png"
                mode="aspectFill"
                style="width: 16rpx; height: 16rpx"
              ></image>
            </view>
          </view>
        </view>
        <view class="buy-button" @click="sureButtonClick"> 确认 </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import EasyLoadimage from "@/components/easy-loadimage/easy-loadimage";
export default {
  components: { EasyLoadimage },
  data() {
    return {
      scrollTop: 0,
      imgUrl: this.$baseUrl,
      role: "",
      token: uni.getStorageSync("token"),
      jewelryDetails: {
        discount: [],
      },
      imgSrc: [],
      orderImg: "",
      imgSrc3: [],
      dotsStyles: {
        width: 6,
        height: 6,
        backgroundColor: "#fff",
        border: "#fff",
        selectedBackgroundColor: "#b0edd5",
        selectedBorder: "#b0edd5",
      },
      current: 0,
      current2: 0,
      collect1: require("../static/imgs/details/collect.png"),
      collect2: require("../static/imgs/details/collect01.png"),

      isShow: "0",
      detailId: null,
      //设置默认的分享参数
      share: {
        title: "PAULIANA 宝莉安娜高级珠宝",
        path: "/pauliana/jewelryDetails?id=" + this.detailId,
        imageUrl: "",
        desc: "",
        content: "",
      },
      showPrice1: false,
      showPrice2: false,
      showPrice3: false,
      showPrice4: false,

      addType: 0,
      productType: null,
    };
  },
  onLoad(option) {
    this.detailId = option.id;
    this.getDetails();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    uni.showLoading({
      title: "正在刷新",
    });
    this.getDetails();
    uni.stopPullDownRefresh();
  },
  // 分享好友
  onShareAppMessage(res) {
    this.share.path = "/pauliana/jewelryDetails?id=" + this.detailId;
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl,
      desc: this.share.desc,
      content: this.share.content,
      success: (res) => {
        uni.showToast({
          title: "分享成功",
          icon: "none",
        });
      },
      fail: (res) => {
        uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  },
  // 分享朋友圈
  onShareTimeline(res) {
    this.share.path = "/pauliana/jewelryDetails?id=" + this.detailId;
    return {
      title: this.share.title,
      path: this.share.path,
      imageUrl: this.share.imageUrl,
      desc: this.share.desc,
      content: this.share.content,
      success: (res) => {
        uni.showToast({
          title: "分享成功",
          icon: "none",
        });
      },
      fail: (res) => {
        uni.showToast({
          title: "分享失败",
          icon: "none",
        });
      },
    };
  },
  methods: {
    openServePopup() {
      this.$refs.servePopup.open();
    },
    closeServePopup() {
      this.$refs.servePopup.close();
    },
    // 是否显示内部图
    isShowChange(e) {
      console.log(e);
      if (this.isShow == "0") {
        this.isShow = "1";
      } else if (this.isShow == "1") {
        this.isShow = "0";
      }
    },
    // 指示点
    swiperChange(e) {
      this.current = e.detail.current;
    },
    swiperChange2(e) {
      this.current2 = e.detail.current;
    },
    //预览轮播图
    imagePreview(index) {
      //uniapp预览轮播图
      uni.previewImage({
        current: index, //预览图片的下标
        urls: this.imgSrc, //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
      });
    },

    imagePreview3(index) {
      //uniapp预览轮播图
      uni.previewImage({
        current: index, //预览图片的下标
        urls: this.imgSrc3, //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
      });
    },
    // 获取商品详情
    getDetails() {
      uni.showLoading({
        title: "加载中......",
      });
      uni.request({
        url:
          this.$baseUrl +
          "/productOrMaterialInfo?productId=" +
          this.detailId +
          "&type=1",
        header: {
          "content-type": "application/json",
          token: uni.getStorageSync("token"),
        },
        complete: (res) => {
          uni.hideLoading();
          console.log(res);

          if (res.data.code === 200) {
            this.productType = res.data.data.type;
            this.jewelryDetails = res.data.data.productInfoRes;

            this.$set(this.jewelryDetails, "num", 1);

            uni.setNavigationBarTitle({
              title: this.jewelryDetails.productName,
            });

            // 产品
            this.imgSrc = [];
            if (
              this.jewelryDetails.img != "" &&
              this.jewelryDetails.img != null
            ) {
              if (this.jewelryDetails.img.indexOf("|") == -1) {
                this.imgSrc.push(
                  this.imgUrl + "/file/" + this.jewelryDetails.img
                );
                this.orderImg = "/file/" + this.jewelryDetails.img;
              } else {
                let p = this.jewelryDetails.img.split("|");

                for (let i = 0; i < p.length; i++) {
                  this.imgSrc.push(this.imgUrl + "/file/" + p[i].trim());
                }

                this.orderImg = "/file/" + p[0].trim();
              }
            }

            // 详情图
            this.imgSrc3 = [];
            if (
              this.jewelryDetails.detailImg != "" &&
              this.jewelryDetails.detailImg != null
            ) {
              if (this.jewelryDetails.detailImg.indexOf("|") == -1) {
                this.imgSrc3.push(
                  this.imgUrl + "/file/" + this.jewelryDetails.detailImg
                );
              } else {
                let f = this.jewelryDetails.detailImg.split("|");
                for (let i = 0; i < f.length; i++) {
                  this.imgSrc3.push(this.imgUrl + "/file/" + f[i].trim());
                }
              }
            }

            //证书
            this.jewelryDetails.certs = [];
            let certs = [];
            if (this.jewelryDetails.certificateNumber.indexOf(",") > 0)
              certs = this.jewelryDetails.certificateNumber.split(",");
            else certs = this.jewelryDetails.certificateNumber.split("，");
            for (let i = 0; i < certs.length; ++i) {
              let tmp = certs[i].trim();
              if (tmp.length > 0) this.jewelryDetails.certs.push(tmp);
            }

            //证书
            this.jewelryDetails.discount = [];
            // let discount = [];
            // if (this.jewelryDetails.activityInfo.indexOf(",") > 0)
            // 	discount = this.jewelryDetails.activityInfo.split(",");
            // else discount = this.jewelryDetails.activityInfo.split("，");
            // for (let i = 0; i < discount.length; ++i) {
            // 	let tmp = discount[i].trim();
            // 	if (tmp.length > 0) this.jewelryDetails.discount.push(tmp);
            // }

            setTimeout(() => {
              this.scrollTop++;
            }, 500);
          } else {
            uni.showToast({
              icon: "none",
              title: res.data.data,
            });
          }
        },
      });
    },
    // 返回首页
    goIndex() {
      uni.switchTab({
        url: "../pages/index",
      });
    },
    // 收藏
    isCollect() {
      if (uni.getStorageSync("token").length == 0) {
        uni.showToast({
          title: "请登录",
          icon: "none",
          success: () => {
            uni.switchTab({
              url: "../pages/mine",
            });
          },
        });
      } else {
        uni.request({
          url:
            this.$baseUrl +
            "/favoriteSave?productId=" +
            this.jewelryDetails.id +
            "&type=1",
          header: {
            token: uni.getStorageSync("token"),
          },
          complete: (res) => {
            console.log("添加与取消收藏");
            console.log(res);

            if (this.checkBack(res, true) == false) return;
            else {
              this.getDetails(this.jewelryDetails.id);
            }
          },
        });
      }
    },
    // 添加购物车
    addCart() {
      if (uni.getStorageSync("token").length == 0) {
        uni.showToast({
          title: "请登录",
          icon: "none",
          success: () => {
            uni.switchTab({
              url: "../pages/mine",
            });
          },
        });
      } else {
        uni.request({
          url: this.$baseUrl + "/shoppingCartAdd",
          method: "POST",
          header: {
            "content-type": "application/json",
            token: uni.getStorageSync("token"),
          },
          data: {
            productId: this.jewelryDetails.id,
            num: this.jewelryDetails.num,
            type: this.productType,
          },
          complete: (res) => {
            console.log("添加购物车");
            console.log(res);
            if (res.data.code == 200) {
              uni.showToast({
                icon: "none",
                title: "添加成功",
              });
            } else {
              uni.showToast({
                icon: "none",
                title: res.data.data,
              });
            }

            this.$refs.numPopup.close();
          },
        });
      }
    },
    closePopup() {
      this.$refs.numPopup.close();
    },
    // 购买数量变化
    numChangeValue(sel) {
      console.log(sel);
      if (sel == 0 && this.jewelryDetails.num > 1) {
        console.log("减减减");
        this.jewelryDetails.num -= 1;
      } else if (sel == 1) {
        console.log("加加加");
        this.jewelryDetails.num += 1;
      }
    },
    // 确定购买
    sureOrderClick() {
      let list = [
        {
          productId: this.jewelryDetails.id,
          imgSrc: this.imgSrc[0].length > 0 ? this.orderImg : "",
          name: encodeURIComponent(this.jewelryDetails.productName),
          num: this.jewelryDetails.num,
          currency: "CNY",
          productAmount:
            this.jewelryDetails.isDiscount == 0
              ? this.jewelryDetails.tagPrice
              : this.jewelryDetails.discountPrice,
          tagPrice: this.jewelryDetails.tagPrice,
          discountPrice:
            this.jewelryDetails.isDiscount == 0
              ? this.jewelryDetails.tagPrice
              : this.jewelryDetails.discountPrice,
          isDiscount: this.jewelryDetails.isDiscount,
          type: this.productType,
        },
      ];
      console.log("跳转传参");
      console.log(JSON.stringify(list));

      uni.navigateTo({
        url:
          "../order/confirmAnOrder?productList=" +
          encodeURIComponent(JSON.stringify(list)),
      });
    },

    // 加入购物车/立即购买
    sureOrder(val) {
      if (uni.getStorageSync("token").length == 0) {
        uni.showToast({
          title: "登录即可使用该功能",
          icon: "none",
          // success: () => {
          // 	setTimeout(() => {
          // 		uni.switchTab({
          // 			url: "../pages/mine",
          // 		});
          // 	}, 1000)
          // },
        });
      } else {
        this.addType = val;
        this.$refs.numPopup.open();
      }
    },
    // 确定加入购物车/立即购买
    sureButtonClick() {
      if (this.addType == 0) {
        this.addCart();
      } else if (this.addType == 1) {
        this.sureOrderClick();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.details-container {
  width: 100%;
  // height: 100vh;
  background-color: #f7f8fa;

  .uni-swiper__dots-nav {
    justify-content: flex-end;
  }

  .price-container {
    margin-top: 56rpx;
    margin-bottom: 96rpx;
    display: flex;
    align-items: center;
    font-size: 22rpx;
    color: #55b8b8;
    font-weight: bold;
  }

  .product-price-name {
    padding: 48rpx 30rpx;
    text-align: left;
    background-color: #fff;

    .product-name {
      .name-one {
        color: #171d26;
        font-size: 34rpx;
        font-weight: 900;
        font-family: "PingFang SC-Heavy";
      }

      .name-two {
        margin-top: 20rpx;
        font-size: 30rpx;
        color: #505459;
        font-weight: 500;
        font-family: "PingFang SC-Medium";
      }
    }

    .serve-container {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .serve-left {
        display: flex;
        align-items: center;

        .serve-title {
          font-size: 28rpx;
          color: #888d94;
        }

        .serve-left-content {
          margin-left: 48rpx;
          display: flex;
          align-items: center;
          color: #171d26;
          font-size: 28rpx;

          .circle {
            width: 6rpx;
            height: 6rpx;
            border-radius: 50%;
            background-color: #171d26;
            margin: 0 10rpx;
          }

          .discount {
            font-size: 24rpx;
            color: #ff8b62;
            border: 1rpx solid #ff8b62;
            border-radius: 10rpx;
            margin-top: 10rpx;
            margin-left: 20rpx;
            padding: 5rpx 10rpx;
          }
        }
      }

      .serve-right {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }

  .serve-popup-container {
    padding: 0 30rpx 24rpx;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    background-color: #fff;

    .serve-every {
      .title {
        padding-top: 60rpx;
        font-size: 30rpx;
        color: #171d26;
        font-weight: bold;
        font-family: "PingFang SC-Bold";
      }

      .content {
        padding-top: 28rpx;
        font-size: 26rpx;
        color: #888d94;
        font-family: "PingFang SC-Medium";
      }
    }

    .serve-button {
      margin-top: 302rpx;
      height: 88rpx;
      line-height: 88rpx;
      font-size: 28rpx;
      color: #fff;
      background-color: #55b8b8;
      text-align: center;
    }
  }

  .product-parameter {
    padding: 30rpx 40rpx;
    text-align: left;

    .parameter {
      padding: 26rpx 40rpx;
      color: #888d94;
      font-size: 24rpx;
      text-align: center;
    }
  }

  .product-collocation {
    margin-top: 46rpx;
    text-align: center;

    .title-cn {
      color: #171d26;
      text-align: center;
      letter-spacing: 4rpx;
    }

    .title-en {
      width: 317rpx;
      height: 31rpx;
    }

    .title-cn {
      margin-top: 10rpx;
      font-size: 34rpx;
      font-weight: bold;
    }

    .collocation-main {
      padding: 0 30rpx;
      margin-top: 60rpx;
      display: grid;
      justify-content: space-between;
      grid-template-columns: repeat(auto-fill, 330rpx);
      grid-gap: 30rpx;

      .coll-name {
        margin-top: 34rpx;
        color: #171d26;
        font-size: 24rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .product-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 18rpx 30rpx 18rpx 30rpx;
    display: flex;
    justify-content: space-between;
    background-color: #fff;

    .bottom-left {
      display: flex;

      .serviceButton {
        margin-right: 40rpx;
        padding: 0;
        line-height: unset;
        border: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .left-index,
      .left-collect {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .left-index {
        margin-right: 40rpx;
      }

      .index-img {
        width: 44rpx;
        height: 44rpx;
      }

      .index-font {
        margin-top: 4rpx;
        font-size: 20rpx;
        color: #5e6166;
      }

      .left-collect {
        text-align: center;
      }
    }

    .bottom-right {
      display: flex;
      justify-content: flex-end;

      .add-cart,
      .buy-button {
        width: 202rpx;
        height: 80rpx;
        margin-left: 12rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        border: 4rpx solid #55b8b8;
      }

      .add-cart {
        background-color: #fff;
        color: #55b8b8;
      }

      .buy-button {
        background-color: #55b8b8;
        color: #fff;
      }
    }
  }

  .num-popup-container {
    padding: 38rpx 30rpx 16rpx;
    background-color: #fff;

    .img-right {
      text-align: right;

      image {
        width: 32rpx;
        height: 32rpx;
      }
    }

    .img-left {
      display: flex;
      align-items: center;

      .img {
        width: 200rpx;
        height: 200rpx;
        margin-right: 32rpx;
      }

      .price {
        height: 200rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 22rpx;
        color: #55b8b8;

        .product-name {
          color: #171d26;
          font-size: 30rpx;
          font-weight: bold;
        }

        .discount-price {
          font-size: 22rpx;
        }
      }
    }

    .number {
      margin-top: 116rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 32rpx;
        color: #171d26;
        font-weight: bold;
      }

      .price-num {
        display: flex;
        align-items: center;

        .num-button {
          width: 56rpx;
          height: 56rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40rpx;
          cursor: pointer;
          color: #171d26;
          background-color: #f4f5f6;
        }

        .num-minus {
          font-size: 38rpx;
          border-top-left-radius: 4rpx;
          border-bottom-left-radius: 4rpx;

          .minus {
            width: 16rpx;
            height: 2rpx;
          }
        }

        .num-add {
          border-top-right-radius: 4rpx;
          border-bottom-right-radius: 4rpx;
        }

        .num-input {
          width: 70rpx;
          height: 56rpx;
          line-height: 56rpx;
          text-align: center;
          font-size: 28rpx;
          color: #000;
          background-color: #f4f5f6;
        }
      }
    }

    .buy-button {
      height: 88rpx;
      margin-top: 254rpx;
      line-height: 88rpx;
      text-align: center;
      background: #55b8b8;
      color: #fff;
      font-size: 28rpx;
      border-radius: 4rpx;
    }
  }
}
</style>
