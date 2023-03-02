<template>
	<view class="return-price-product-container">
		<!-- 退货退款 -->
		<view class="return-price-product-top">
			<view class="addr-every" v-if="typeSel == 0">
				<text class="every-title">收货状态</text>
				<uni-data-picker style="flex: 1" class="city-sel" placeholder="点击选择收货状态" popup-title="请选择收货状态"
					:localdata="productStatusList" v-model="productStatus" @change="statusChange"
					@popupopened="dataPickerOpen" @popupclosed="dataPickerClose">
				</uni-data-picker>
				<image src="../static/imgs/common/right.png" mode="aspectFill"></image>
			</view>
			<view class="addr-every">
				<text class="every-title">申请原因</text>
				<uni-data-picker style="flex: 1" class="city-sel" placeholder="点击选择申请原因" popup-title="请选择申请原因"
					@change="reasonChange" :localdata="reasonList" v-model="reasonSel" @popupopened="dataPickerOpen"
					@popupclosed="dataPickerClose">
				</uni-data-picker>
				<image src="../static/imgs/common/right.png" mode="aspectFill"></image>
			</view>
			<view class="applied-amount">
				<view class="applied-amount-title">申请金额</view>
				<view class="applied-amount-main">
					<view class="amount-main-left">
						<text style="font-size: 24rpx">￥</text>
						<text>{{ paramsData.price }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="apply-for-instructions">
			<view class="instructions-title">
				<text class="title">申请说明</text>
				<text class="num">您还可以输入{{ 170 - insDetail.length }}字</text>
			</view>
			<view class="instructions-detail">
				<textarea v-if="isTextShow" placeholder="请您填写详细申请说明" placeholder-style="color: #999999;" maxlength="170"
					v-model="insDetail" />
				<view class="instructions-imgs">
					<view class="imgs-upload" @click="uploadImgs">
						<image src="../static/imgs/common/camera.png" mode="aspectFill"></image>
						<text>上传图片</text>
					</view>
					<view v-for="(item, index) in imgList" :key="index" class="img-every">
						<image class="img" v-if="item" :src="imgUrl + item" mode="aspectFill"></image>
						<view class="del-img">
							<uni-icons type="trash" size="24" @click="delImg(index)"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="return-price-product-top" style="padding: 20rpx 20rpx; margin-top: 20rpx">
			<view class="addr-every" style="margin-bottom: 0">
				<text class="every-title">联系电话</text>
				<uni-easyinput style="flex: 1" v-model="paramsData.phone" :inputBorder="false" placeholder="请输入联系电话"
					placeholder-style="color: #999999;font-size: 26rpx;" />
			</view>
		</view>

		<view class="apply-button">
			<view class="button-self" @click="applySubmit">提交申请</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl + "/",
				paramsData: {},

				typeSel: "",
				productStatusList: [{
						text: "未收到货",
						value: "1",
					},
					{
						text: "已收到货",
						value: "0",
					},
				],
				productStatus: "1",
				reasonList: [{
						text: "多拍、错拍、不想要",
						value: "多拍、错拍、不想要",
					},
					{
						text: "不喜欢、效果不好",
						value: "不喜欢、效果不好",
					},
					{
						text: "货物与描述不符",
						value: "货物与描述不符",
					},
					{
						text: "大小/重量与商品描述不符",
						value: "大小/重量与商品描述不符",
					},
					{
						text: "标签/批次/包装/成分等与商品描述不符",
						value: "标签/批次/包装/成分等与商品描述不符",
					},
					{
						text: "质量问题",
						value: "质量问题",
					},
					{
						text: "收到商品少件、破损或污渍",
						value: "收到商品少件、破损或污渍",
					},
					{
						text: "商家发错货",
						value: "商家发错货",
					},
					{
						text: "其他",
						value: "其他",
					},
				],
				reasonSel: "",

				insDetail: "",
				imgList: [],

				isTextShow: true
			};
		},
		onLoad(option) {
			this.paramsData = JSON.parse(option.retParams);
			this.typeSel = option.type;
			console.log(this.paramsData);
			if (this.typeSel == 0) {
				uni.setNavigationBarTitle({
					title: "申请退款",
				});
			} else {
				uni.setNavigationBarTitle({
					title: "申请退货退款",
				});
			}
		},
		methods: {
			dataPickerOpen() {
				this.isTextShow = false;
			},
			dataPickerClose() {
				this.isTextShow = true;
			},
			// 收货状态
			statusChange(val) {
				console.log(this.productStatus);
				console.log(val);
			},
			// 申请原因
			reasonChange(val) {
				console.log(val);
			},

			// 上传图片
			uploadImgs() {
				uni.chooseImage({
					success: (res) => {
						console.log("成功", res);
						const filsList = res.tempFilePaths;

						uni.showLoading({
							title: "图片上传中...",
						});

						for (let i = 0; i < filsList.length; i++) {
							uni.uploadFile({
								url: this.$baseUrl + "/upload", //post请求的地址
								fileType: "image",
								filePath: filsList[i],
								name: "files",
								formData: {
									type: 2,
								},
								success: (res) => {
									console.log("上传图片成功");
									console.log(res);
									this.imgList.push(res.data);

									console.log(this.imgList);
								},
								fail: (err) => {
									console.log("上传失败");
									console.log(err);
								},
							});
						}
						uni.hideLoading();
					},
					fail: (err) => {
						console.log("失败");
						console.log(err);
					},
				});
			},
			// 删除图片
			delImg(index) {
				this.imgList.splice(index, 1);
			},
			// 提交申请
			applySubmit() {
				uni.request({
					url: this.$baseUrl + "/refundSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						orderId: this.paramsData.orderId,
						productId: this.paramsData.productId,
						pics: this.imgList.join("|"),
						productStatus: this.productStatus,
						reason: this.reasonSel,
						refundAmount: this.paramsData.price,
						totalAmount: this.paramsData.totalAmount,
						type: this.typeSel,
						note: this.insDetail,
						phone: this.paramsData.phone,
						num: this.paramsData.num,
					},
					complete: (res) => {
						console.log("退换货");
						console.log(res);
						if (res.data.code == 200) {
							uni.showToast({
								icon: "none",
								title: "申请成功",
								success: () => {
									uni.reLaunch({
										url: "returnOrder",
									});
								},
							});
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.data,
							});
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.return-price-product-container {
		min-height: 100vh;
		padding: 40rpx 24rpx 0;
		background-color: #f2f3f5;

		.return-price-product-top {
			padding: 40rpx 20rpx 0;
			background-color: #fff;
			border-radius: 30rpx;

			.addr-every {
				margin-bottom: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.every-title {
					margin-right: 20rpx;
					font-size: 30rpx;
				}

				.city-sel {
					font-size: 30rpx;
					// font-weight: bold;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}

				image {
					width: 32rpx;
					height: 32rpx;
				}
			}

			.applied-amount {
				padding-bottom: 40rpx;

				.applied-amount-title {
					font-size: 30rpx;
				}

				.applied-amount-main {
					margin-top: 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.amount-main-left {
						display: flex;
						align-items: center;
						font-size: 36rpx;
						font-weight: bold;
						color: #ff7822;
					}
				}
			}
		}

		.apply-for-instructions {
			margin-top: 20rpx;
			padding: 39rpx 19rpx 40rpx;
			background-color: #fff;
			border-radius: 30rpx;

			.instructions-title {
				display: flex;
				justify-content: space-between;

				.title {
					font-size: 30rpx;
					font-weight: bold;
				}

				.num {
					font-size: 24rpx;
					color: #999999;
				}
			}

			.instructions-detail {
				margin-top: 40rpx;
				padding: 31rpx 29rpx 26rpx;
				font-size: 26rpx;
				background-color: #fafafa;
				border-radius: 20rpx;

				.instructions-imgs {
					display: flex;
					flex-wrap: wrap;

					.imgs-upload {
						width: 140rpx;
						height: 140rpx;
						margin-right: 20rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						text-align: center;
						border: 1px dashed #999999;

						image {
							width: 42rpx;
							height: 34rpx;
							margin: 0 auto;
							margin-bottom: 17rpx;
						}

						text {
							font-size: 22rpx;
							color: #aaa;
						}
					}

					.img-every {
						margin-right: 20rpx;
						position: relative;

						.img {
							width: 140rpx;
							height: 140rpx;
						}

						.del-img {
							position: absolute;
							top: 0;
							right: 0;
							background-color: rgba(0, 0, 0, 0.4);
						}
					}
				}
			}
		}

		.apply-button {
			padding: 100rpx 0 40rpx;

			.button-self {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				background-color: #55b8b8;
				color: #fff;
				border-radius: 60rpx;
				text-align: center;
			}
		}
	}
</style>
<style lang="scss">
	.addr-every {
		.input-value {
			padding: 0 !important;
		}

		.selected-list {
			padding: 0 !important;
		}

		.input-value-border {
			border: none !important;
		}

		.input-arrow {
			width: 0 !important;
			height: 0 !important;
			border-left: none !important;
			border-bottom: none !important;
		}

		.placeholder {
			color: #999999 !important;
		}
	}
</style>
