<template>
	<view class="return-order-container" v-if="isShow">
		<!-- 退换货 -->
		<view v-if="haveData == 0" class="no-data">
			<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无退款记录~</text>
		</view>
		<view v-else class="return-main">
			<view class="prompt-msg">
				若收到货，请自行寄回商品，商家收到货后会给予您退款
			</view>
			<view class="main-every" v-for="(item, index) in refundList" :key="index">
				<view style="text-align: right; font-size: 30rpx; color: #FE7722">
					{{ editState(item.status,item.payStatus) }}
				</view>
				<view class="every-top">
					<view class="top-img">
						<image v-if="item.img" :src="imgUrl + item.img.trim()" mode="aspectFill">
						</image>
						<image v-else src="../static/imgs/common/nopic.jpg" mode="aspectFill"></image>
					</view>

					<view class="top-right">
						<view class="right-name">
							{{ item.productName }}
						</view>
						<view class="right-price">
							<text style="font-size: 30rpx;">退款：</text>
							<text style="font-size: 24rpx;">￥</text>{{ " " + formatNumberRgx(item.refundAmount) }}
						</view>
					</view>
				</view>
				<view class="every-bottom">
					<view class="button-del" v-show="item.status == -1 || item.payStatus == 2" @click="delReturn(item)">
						删除售后单
					</view>
					<view class="button-del" @click="returnCancel(item.id)" v-show="item.status == 0">
						取消退款
					</view>
					<view class="button-detail" @click="checkReturnMsg(item)">退款详情</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				isShow: false,
				haveData: 1,
				refundList: [],
			};
		},
		onLoad() {
			this.getRefundsList();
		},
		methods: {
			// 取消退款
			returnCancel(id) {
				uni.showModal({
					content: "确定取消该退款？",
					confirmColor: "#50B2B2",
					success: (ret) => {
						if (ret.confirm) {
							uni.request({
								url: this.$baseUrl + "/refundSave",
								method: "POST",
								data: {
									id: id,
								},
								header: {
									"content-type": "application/json",
									token: uni.getStorageSync("token"),
								},
								complete: (res) => {
									console.log('取消退款', res);

									if (res.data.code == 200) {
										this.getRefundsList()
										uni.showToast({
											icon: "none",
											title: "取消成功",
										});
									} else {
										uni.showToast({
											icon: "none",
											title: res.data.data,
										});
									}
								},
							});
						}
					},
				});
			},

			// 删除退货/退款记录
			delReturn(item) {
				console.log(item);

				uni.showModal({
					title: "删除售后单",
					content: "确定删除该售后单？删除后不可恢复",
					confirmText: "删除",
					confirmColor: "#55B8B8",
					success: (val) => {
						console.log(val);
						if (val.confirm == true) {
							console.log("删除售后单");
							uni.request({
								url: this.$baseUrl + "/refundDel?id=" + item.id,
								header: {
									"content-type": "application/json",
									token: uni.getStorageSync("token"),
								},
								complete: (res) => {
									console.log(res);
									if (res.data.code == 200) {
										this.getRefundsList();
										uni.showToast({
											icon: "none",
											title: "删除成功",
										});
									} else {
										uni.showToast({
											icon: "none",
											title: res.data.message,
										});
									}
								},
							});
						}
					},
				});
			},
			// 查看退款详情
			checkReturnMsg(item) {
				console.log(item);
				// 查看退款详情时，同时发送请求获取退款结果
				uni.navigateTo({
					url: "./returnOrderDetail?id=" + item.id
				})
			},
			// 获取退换货列表
			getRefundsList() {
				uni.showLoading({
					title: "加载中..."
				})
				uni.request({
					url: this.$baseUrl + "/refundList",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("退换货列表");
						console.log(res);
						this.refundList = res.data.data;
						if (this.refundList.length == 0) {
							this.haveData = 0;
						} else {
							this.haveData = 1;
						}

						uni.hideLoading();
						this.isShow = true;
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.return-order-container {
		min-height: 100vh;
		padding-bottom: 40rpx;
		background-color: #F2F3F5;

		.return-main {
			padding: 0 23rpx;

			.prompt-msg {
				font-size: 24rpx;
				padding: 20rpx 0;
			}

			.main-every {
				padding: 30rpx 20rpx;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 10rpx;

				.every-top {
					margin-top: 42rpx;
					display: flex;

					.top-img image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 10rpx;
					}

					.top-right {
						margin-left: 20rpx;
						padding: 24rpx 0;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						font-size: 26rpx;

						.right-price {
							margin-top: 20rpx;
							font-size: 36rpx;
						}
					}
				}

				.every-bottom {
					margin-top: 20rpx;
					display: flex;
					justify-content: flex-end;

					.button-del,
					.button-detail {
						padding: 10rpx 30rpx;
						font-size: 28rpx;
						border-radius: 60rpx;
					}

					.button-del {
						color: #c3c3c3;
						border: 1px solid #c3c3c3;
					}

					.button-detail {
						margin-left: 20rpx;
						background-color: #55B8B8;
						color: #fff;
					}
				}
			}
		}
	}
</style>
