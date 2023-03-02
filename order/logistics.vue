<template>
	<view class="logistics-container" v-if="isShow">
		<!-- 物流 -->
		<view class="logistics-main">
			<view class="logistics-top">
				<view class="top-left">
					<image style="width: 40rpx;height: 40rpx;" src="../static/imgs/order/sf.jpg" mode="aspectFill">
					</image>
					<text>顺丰速运：</text>
					<text>{{ logisMsg.mailNo }}</text>
				</view>
				<view class="top-right" @click="copyOut(logisMsg.mailNo)">
					复制
				</view>
			</view>
			<view class="logistics-line">
				<timeline>
					<timelineItem v-for="(item,index) in logisMsg.routes" :key="index" color="#50B2B2"
						:index="index + 1" :length="logisMsg.routes.length">
						<view class="tripItem"
							:style="{height: index + 1 == logisMsg.routes.length ? 'fit-content' : '140rpx'}">
							<view class="title">{{item.acceptTime}}</view>
							<!-- '【' + item.acceptAddress + '】' +  -->
							<view class="tips">{{item.remark}}</view>
						</view>
					</timelineItem>
				</timeline>
			</view>
		</view>

		<view class="main-msg">
			<view class="msg-container" v-for="(items, index3) in productList" :key="index3"
				@click="goProductDetail(items)">
				<view class="msg-img">
					<image v-if="items.img" :src="imgUrl + items.img" mode="aspectFill">
					</image>
					<image v-else src="../static/imgs/common/nopic.jpg" mode="aspectFill">
					</image>
				</view>

				<view class="msg-data">
					<view class="data-name">{{ items.productName }}</view>
					<view class="data-price">
						<text>
							<text style="font-size: 24rpx;">￥</text>
							{{
							  formatNumberRgx(items.productAmount)
							}}
						</text>
						<text style="color: #999999;font-size: 26rpx;font-weight: normal;">
							{{'x' + items.num}}</text>
					</view>
					<view class="main-money">
						<text class="money-title">实付：</text>
						<text class="money">
							<text style="font-weight: normal;font-size: 22rpx;">￥</text>
							{{formatNumberRgx(items.actualAmount)}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import timeline from '@/components/chenbin-timeline/timeLine.vue'
	import timelineItem from '@/components/chenbin-timeline/timelineItem.vue'
	export default {
		components: {
			timeline,
			timelineItem
		},
		data() {
			return {
				imgUrl: this.$baseUrl,
				isShow: false,
				logisMsg: {},
				detailId: null,
				productList: [],
			};
		},
		onLoad(option) {
			this.detailId = option.id;
			this.productList = JSON.parse(decodeURIComponent(option.detailList))
			this.getLogisticsInfo();
		},
		methods: {
			// 查看商品详情
			goProductDetail(item) {
				console.log(item);
				if (item.type == 1) {
					uni.navigateTo({
						url: "/pauliana/jewelryDetails?id=" + item.productId,
					});
				} else if (item.type == 2) {
					uni.navigateTo({
						url: "/pauliana/materialDetails?id=" + item.productId,
					});
				}
			},
			// 复制物流单号
			copyOut(val) {
				console.log("复制");
				uni.setClipboardData({
					data: val, //要被复制的内容
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
			// 获取物流详情
			getLogisticsInfo() {
				uni.showLoading({
					title: "加载中...",
				});
				uni.request({
					url: this.$baseUrl + "/searchRoutes?id=" + this.detailId,
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						uni.hideLoading();
						console.log("物流信息");
						console.log(res);
						this.logisMsg = res.data.data;

						this.isShow = true;
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.logistics-container {
		min-height: 100vh;
		padding: 20rpx;
		background-color: #f2f3f5;

		.main-msg {
			margin-top: 20rpx;
			padding: 24rpx 24rpx 0;
			background-color: #fff;
			border-radius: 10rpx;

			.msg-container {
				padding-bottom: 20rpx;
				display: flex;

				.msg-img {
					margin-right: 20rpx;

					image {
						width: 156rpx;
						height: 156rpx;
					}
				}

				.msg-data {
					flex: 1;
					font-size: 24rpx;

					.data-name {
						width: 65vw;
						padding-top: 5rpx;
						font-size: 28rpx;
						font-weight: bold;
						text-align: left;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

					.data-num {
						font-size: 20rpx;
						margin: 20rpx 0;
						color: #c3c3c3;
					}

					.data-price {
						margin-top: 20rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 26rpx;
					}
				}
			}

			.main-money {
				text-align: left;

				.money-title {
					font-size: 24rpx;
					color: #000;
				}

				.money {
					color: #FF7824;
					font-size: 30rpx;
				}
			}
		}

		.logistics-main {
			padding: 24rpx 24rpx 0;
			background-color: #fff;
			border-radius: 10rpx;

			.logistics-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;

				.top-left {
					display: flex;
					align-items: center;

					image {
						margin-right: 20rpx;
					}
				}

				.top-right {
					color: #50B2B2;
				}
			}

			.logistics-line {
				margin-top: 20rpx;

				.tripItem {
					// padding: 20rpx 30rpx;
					// box-sizing: border-box;
					// background: rgba(255, 255, 255, 1);
					// box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
					// border-radius: 10px;
					margin-bottom: 30rpx;

					.title {
						font-size: 28rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: rgba(51, 51, 51, 1);
					}

					.tips {
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(153, 153, 153, 1);
						margin-top: 20rpx;
					}
				}
			}
		}
	}
</style>
