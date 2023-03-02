<template>
  <view class="brand-detail-container" v-if="backImgUrl">
    <view
      class="top-main"
      :style="{ 'background-image': 'url(' + imgUrl + backImgUrl + ')' }"
    >
      <view class="top-logo">
        <image
          src="../static/imgs/index/brand/logo.png"
          mode="aspectFill"
        ></image>
      </view>
      <view class="top-font-one">
        <view class="font01">
          <image
            src="../static/imgs/index/brand/vector01.png"
            mode="aspectFill"
          ></image>
        </view>
        <view class="font02">
          <view>为别人的审美而设计珠宝</view>
          <view>不如按照自己的心意来</view>
          <view>定制属于你的独一无二</view>
        </view>
        <view class="font03">
          <image
            src="../static/imgs/index/brand/vector02.png"
            mode="aspectFill"
          ></image>
        </view>
      </view>
      <view class="top-font-two">
        <view> 宝莉安娜一直秉承着追求完美的信念 </view>
        <view> 是一家可以根据客户需求 </view>
        <view> 进行私人定制的高级珠宝公司 </view>
      </view>
      <view class="top-font-two">
        <view> 拥有着全球一流的宝石猎人团队 </view>
        <view> 承诺为客户提供最顶级的宝石品质 </view>
        <view> 我们一直致力于Fine Jewelry的设计与制作 </view>
        <view> 从世界各地的文化和理念中汲取灵感 </view>
        <view> 为中高端客户提供原创设计 </view>
        <view> 进而制作出彰显属于TA们自身格调与品位的珠宝饰品 </view>
      </view>

      <view class="center-main">
        <image
          class="center-title"
          src="../static/imgs/index/brand/title01.png"
          mode="aspectFill"
        ></image>
        <view class="center-img">
          <image :src="imgUrl + img01" mode="aspectFill"></image>
          <view class="img-right">
            <image :src="imgUrl + img02" mode="aspectFill"></image>
          </view>
        </view>
      </view>

      <view class="bottom-main">
        <image
          class="bottom-title"
          src="../static/imgs/index/brand/title02.png"
          mode="aspectFill"
        ></image>
        <view class="bottom-img">
          <image
            style="z-index: 10"
            :src="imgUrl + img03"
            mode="aspectFill"
          ></image>
          <view class="img-right">
            <image :src="imgUrl + img04" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "brandDetails",
  data() {
    return {
      imgUrl: this.$baseUrl,
      backImgUrl: "",
      img01: "",
      img02: "",
      img03: "",
      img04: "",
    };
  },
  onLoad() {
    this.getImgList();
  },
  methods: {
    getImgList() {
      uni.request({
        url: this.$baseUrl + "/brandIntroduction",
        header: {
          "content-type": "application/json",
        },
        complete: (res) => {
          console.log("图片", res);
          let data = res.data.data;
          this.backImgUrl = data[0];
          this.img01 = data[1];
          this.img02 = data[2];
          this.img03 = data[3];
          this.img04 = data[4];
        },
      });
    },
    backPage() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.brand-detail-container {
  .top-main {
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100%;

    .back-img {
      padding-left: 40rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      image {
        width: 17rpx;
        height: 30rpx;
      }
    }

    .top-logo {
      width: 100%;
      padding-top: 40rpx;
      display: flex;
      justify-content: center;

      image {
        width: 402rpx;
        height: 120rpx;
      }
    }

    .top-font-one {
      margin-top: 80rpx;
      display: flex;
      justify-content: center;

      .font01,
      .font03 {
        image {
          width: 15rpx;
          height: 31rpx;
          margin: 0 24rpx;
        }
      }

      .font01 {
        padding-top: 20rpx;
      }

      .font03 {
        padding-bottom: 20rpx;
        display: flex;
        align-items: flex-end;
      }

      .font02 {
        line-height: 75rpx;
        color: #171d26;
        font-size: 34rpx;
        font-weight: bold;
        text-align: center;
      }
    }

    .top-font-two {
      margin-top: 60rpx;
      font-size: 26rpx;
      color: #5c6066;
      line-height: 52rpx;
      text-align: center;
    }

    .center-main {
      margin-top: 154rpx;
      padding-left: 60rpx;

      .center-title {
        width: 690rpx;
        height: 226rpx;
      }

      .center-img {
        margin-top: 90rpx;
        display: flex;
        justify-content: flex-start;

        image {
          width: 296rpx;
          height: 428rpx;
        }

        .img-right {
          margin-left: 38rpx;
          margin-top: 72rpx;
        }
      }
    }

    .bottom-main {
      margin-top: 136rpx;
      padding-right: 60rpx;

      .bottom-title {
        width: 690rpx;
        height: 226rpx;
      }

      .bottom-img {
        margin-top: 84rpx;
        display: flex;
        justify-content: flex-end;

        image {
          width: 356rpx;
          height: 508rpx;
        }

        .img-right {
          margin-left: -84rpx;
          margin-top: 110rpx;

          image {
            z-index: 0;
          }
        }
      }
    }
  }
}
</style>
