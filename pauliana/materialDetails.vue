<template>
	<view class="material-container" v-if="initOk">
		<!-- 原材料详情 -->
		<uni-swiper-dot :info="imgSrc" :current="current" mode="default" :dotsStyles="dotsStyles">
			<swiper class="swiper-box" style="height: 500rpx" @change="swiperChange">
				<swiper-item v-for="(item, index) in imgSrc" :key="index">
					<view class="swiper-item" @click="imagePreview(index)">
						<image :src="item" mode="aspectFill" style="width: 750rpx; height: 500rpx"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<view class="product-price-name">
			<view class="product-name" v-if="materialDetails.productName">
				<view class="name-one">
					<text>{{ materialDetails.productName}}</text>
				</view>
			</view>

			<view class="price-container row" style="justify-content: space-between;" v-if="materialDetails.tagPrice != 0">
				<text style="font-size: 34rpx">单价：{{getPrice(materialDetails.tagPrice, '￥', '', 0)}}</text>
				<text v-if="materialDetails.weight == 0" style="color: #171D26;font-weight: normal;">库存：{{materialDetails.surplusNumber}}</text>
			</view>

			<view class="price-container" v-else>
				价格请咨询客服
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
				<image class="serve-right" src="../static/imgs/common/right.png" mode="aspectFill"></image>
			</view>
		</view>

		<uni-popup ref="servePopup" type="bottom">
			<view class="serve-popup-container">
				<view class="serve-every">
					<view class="title">
						线下门店
					</view>
					<view class="content">
						该店铺拥有线下门店，店家已展示门店信息
					</view>
				</view>
				<view class="serve-every">
					<view class="title">
						快递发货
					</view>
					<view class="content">
						可选择快递发货配送上门，本商品免运费
					</view>
				</view>
				<view class="serve-button" @click="closeServePopup">
					我知道了
				</view>
			</view>
		</uni-popup>
		
		<uni-segmented-control v-if="tabItems.length > 1" style="background-color: #ffffff;padding-bottom: 10rpx;" :current="tabCurrent"
			:values="tabItems" styleType="text" activeColor="#000000" @clickItem="onClickTabItem">
		</uni-segmented-control>
		
		
		<view v-if="tabCurrent == 0" class="product-parameter" style="padding: 0 0 160rpx">
			
			<view class="parameter-main">
				<view v-if="tabItems.length == 1">
					<view class="title"> 裸石参数 </view>
					<view class="line"></view>
				</view>
				<view class="parameter-main-container">
					<view class="container-every" v-if="materialDetails.storageName">
						<view class="title"> 库存地 </view>
						<view class="content"> {{materialDetails.storageName}} </view>
					</view>
					<view class="container-every" @longpress="copyItem(materialDetails.productNumber)">
						<view class="title"> 编号 </view>
						<view class="content"> {{materialDetails.productNumber}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.weight > 0.0">
						<view class="title"> 数量 </view>
						<view class="content"> {{materialDetails.surplusNumber}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.weight > 0.0">
						<view class="title"> 重量 </view>
						<view class="content"> {{materialDetails.weight + '' + materialDetails.chargeUnit}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.quality" @longpress="copyItem(materialDetails.quality)">
						<view class="title"> 品质 </view>
						<view class="content"> {{materialDetails.quality}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.subsection">
						<view class="title"> 品质细分 </view>
						<view class="content"> {{materialDetails.subsection}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.productArea">
						<view class="title"> 产地 </view>
						<view class="content"> {{materialDetails.productArea}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.color">
						<view class="title"> 颜色 </view>
						<view class="content"> {{materialDetails.color}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.shape">
						<view class="title"> 形状 </view>
						<view class="content"> {{materialDetails.shape}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.size" @longpress="copyItem(materialDetails.size)">
						<view class="title"> 尺寸 </view>
						<view class="content"> {{materialDetails.size}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.paired">
						<view class="title"> 配对 </view>
						<view class="content"> {{materialDetails.paired}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.boxNumber">
						<view class="title"> 盒子编号 </view>
						<view class="content"> {{materialDetails.boxNumber}} </view>
					</view>
					
					<view v-if="materialDetails.certs">
						<view v-if="materialDetails.certs.length > 0" class="container-every">
							<view class="title"> 证书编号 </view>
							<view class="content">
								<view v-for="(cert, index) in materialDetails.certs" :key="index">
									<navigator :url="'./materialDetails?productNumber=' + cert">
										{{ cert }}
									</navigator>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="tabCurrent == 1" class="product-parameter" style="padding: 0 0 160rpx">
			<view class="parameter-main">
				<view class="parameter-main-container">
					<view class="container-every" v-if="materialDetails.unitPrice > 0.0">
						<view class="title"> 单价 </view>
						<view class="content"> {{getPrice(materialDetails.unitPrice, materialDetails.currency, '/', 0)}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.totalPrice > 0.0">
						<view class="title"> 总价 </view>
						<view class="content"> {{getPrice(materialDetails.totalPrice, materialDetails.currency, '/', 0)}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.totalHkPrice > 0.0">
						<view class="title"> 总价港币 </view>
						<view class="content"> {{getPrice(materialDetails.totalHkPrice, 'HKD', '/', 0)}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.agentPrice > 0.0">
						<view class="title"> 代理单价 </view>
						<view class="content"> {{getPrice(materialDetails.agentPrice, 'CNY', '/', 0)}} </view>
					</view>
					<view class="container-every" v-if="materialDetails.counterLowestSellPrice > 0.0">
						<view class="title"> 最低销售单价 </view>
						<view class="content"> {{getPrice(materialDetails.counterLowestSellPrice, 'CNY', '/', 0)}} </view>
					</view>
				</view>
			</view>
		</view>


		<view class="product-bottom">
			<view class="bottom-left">
				<view class="left-index" @click="goIndex">
					<image class="index-img" src="../static/imgs/details/index.png" mode="aspectFit"></image>
					<view class="index-font">首页</view>
				</view>
				<button open-type="contact" :plain="true" show-message-card="true"
					:send-message-title="materialDetails.productName" :send-message-img="imgSrc[0]"
					:send-message-path="`/pauliana/materialDetails?id=${detailId}`" class="serviceButton">
					<image class="index-img" src="../static/imgs/details/service.png" mode="aspectFill"></image>
					<view class="index-font">客服</view>
				</button>
				<view class="left-collect" @click="isCollect">
					<image class="index-img" :src="materialDetails.isFavorite == 0 ? collect1 : collect2"
						mode="aspectFit">
					</image>
					<view class="index-font">{{
		        materialDetails.isFavorite == 0 ? "收藏" : "已收藏"
		      }}</view>
				</view>
			</view>

			<!-- <view class="bottom-right">
				<view class="add-cart" @click="sureOrder(0)">加入购物车</view>
				<view class="buy-button" @click="sureOrder(1)">立即购买</view>
			</view> -->
		</view>
		<uni-popup ref="numPopup" type="bottom">
			<view class="num-popup-container">
				<view class="img-right">
					<image @click="closePopup" src="../static/imgs/details/close.png" mode="aspectFill"></image>
				</view>
				<view class="img-left">
					<image class="img" :src="imgSrc[0]" mode="aspectFill"></image>
					<view class="price">
						<view class="product-name">
							{{materialDetails.productName}}
						</view>

						<view class="price-container" style="margin: 0;" v-if="materialDetails.tagPrice != 0">
							<view>
								<text
									style="font-size: 34rpx">{{ '￥' + formatNumberRgx(materialDetails.discountPrice)}}</text>
								<text v-if="materialDetails.isVipProduct == 1"
									style="margin-left: 8rpx;font-weight: normal;">会员价</text>
							</view>
							<text v-if="materialDetails.isVipProduct == 1">
								<text
									style="margin-left: 18rpx;font-size: 24rpx;color: #AAADB2;text-decoration: line-through;">{{'￥' + 
								    formatNumberRgx(materialDetails.tagPrice)
								  }}</text>
							</text>
						</view>

						<view class="price-container" v-else>
							价格请咨询客服
						</view>
					</view>

				</view>
				<view class="number">
					<text class="title">购买数量</text>
					<view class="price-num">
						<view class="num-button num-minus" @click="numChangeValue(0)">
							<view class="minus"
								:style="{'background-color': materialDetails.num > 1 ? '#000' : '#AAADB2'}"></view>
						</view>
						<text class="num-input">{{ materialDetails.num }}</text>
						<view class="num-button num-add" @click="numChangeValue(1)">
							<image src="../static/imgs/order/add.png" mode="aspectFill"
								style="width: 16rpx;height: 16rpx;"></image>
						</view>
					</view>
				</view>
				<view class="buy-button" @click="sureButtonClick">
					确认
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: this.$baseUrl,
				initOk: false,
				dotsStyles: {
					selectedBackgroundColor: "#50b2b2",
					selectedBorder: "#50b2b2",
				},
				detailId: null,
				productNumber: "",
				materialDetails: {},
				imgSrc: [],
				imgSrc2: [],

				//设置默认的分享参数
				share: {
					title: "PAULIANA 宝莉安娜高级珠宝",
					path: "/pauliana/materialDetails?id=" + this.detailId,
					imageUrl: "",
					desc: "",
					content: "",
				},
				orderImg: "",
				
				tabItems: ["裸石详情"],
				tabCurrent: 0,

				addType: 0,
				productType: null,
				current: 0,
				collect1: require("../static/imgs/details/collect.png"),
				collect2: require("../static/imgs/details/collect01.png"),
			};
		},
		onLoad(option) {
			if (option.id) this.detailId = option.id;
			else this.productNumber = option.productNumber;

			this.getDetails();
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
			this.share.path = "/pauliana/materialDetails?id=" + this.detailId;
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
			this.share.path = "/pauliana/materialDetails?id=" + this.detailId;
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
			// 指示点
			swiperChange(e) {
				this.current = e.detail.current;
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
						url: this.$baseUrl + "/favoriteSave?productId=" + this.materialDetails
							.id + "&type=2",
						header: {
							token: uni.getStorageSync("token"),
						},
						complete: (res) => {
							console.log("添加与取消收藏");
							console.log(res);

							if (this.checkBack(res, true) == false) return;
							else {
								this.getDetails(this.materialDetails.id);
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
							productId: this.materialDetails.id,
							num: this.materialDetails.num,
							type: this.productType
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
			onClickTabItem(e) {
				if (this.tabCurrent != e.currentIndex) {
					this.tabCurrent = e.currentIndex;
				}
			},
			closePopup() {
				this.$refs.numPopup.close();
			},
			// 购买数量变化
			numChangeValue(sel) {
				console.log(sel);
				if (sel == 0 && this.materialDetails.num > 1) {
					console.log("减减减");
					this.materialDetails.num -= 1;
				} else if (sel == 1) {
					console.log("加加加");
					this.materialDetails.num += 1;
				}
			},
			// 确定购买
			sureOrderClick() {
				let list = [{
					productId: this.materialDetails.id,
					imgSrc: this.imgSrc[0].length > 0 ? this.orderImg : "",
					name: encodeURIComponent(this.materialDetails.productName),
					num: this.materialDetails.num,
					currency: "CNY",
					productAmount: this.materialDetails.tagPrice,
					tagPrice: this.materialDetails.tagPrice,
					discountPrice: this.materialDetails.discountPrice,
					isDiscount: this.materialDetails.isDiscount,
					type: this.productType
				}];
				console.log("跳转传参");
				console.log(JSON.stringify(list));

				uni.navigateTo({
					url: "../order/confirmAnOrder?productList=" +
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
					this.addCart()
				} else if (this.addType == 1) {
					this.sureOrderClick()
				}
			},
			// 获取宝石详情
			getDetails() {
				uni.showLoading({
					title: "加载中......",
				});
				let url = "";
				if (this.detailId > 0) url = "/productOrMaterialInfo?productId=" + this.detailId;
				else url = "/productOrMaterialInfo?productNumber=" + this.productNumber;

				uni.request({
					url: this.$baseUrl + url + "&type=2",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (ret) => {
						uni.hideLoading();
						console.log('宝石详情', ret);

						if (this.checkBack(ret, true) == false) return;

						this.productType = ret.data.data.type;
						this.materialDetails = ret.data.data.materialInfoRes;
						this.$set(this.materialDetails, "num", 1);
						console.log(this.materialDetails);

						uni.setNavigationBarTitle({
							title: this.materialDetails.materialName,
						});

						// 产品
						this.imgSrc = [];
						if (
							this.materialDetails.img != "" &&
							this.materialDetails.img != null
						) {
							if (this.materialDetails.img.indexOf("|") == -1) {
								this.imgSrc.push(
									this.imgUrl + "/file/" + this.materialDetails.img
								);

								this.orderImg = "/file/" + this.materialDetails.img;
							} else {
								let p = this.materialDetails.img.split("|");

								for (let i = 0; i < p.length; i++) {
									this.imgSrc.push(this.imgUrl + "/file/" + p[i].trim());
								}

								this.orderImg = "/file/" + p[0].trim();
							}
						}

						// 详情图
						this.imgSrc2 = [];
						if (
							this.materialDetails.detailImg != "" &&
							this.materialDetails.detailImg != null
						) {
							if (this.materialDetails.detailImg.indexOf("|") == -1) {
								this.imgSrc2.push(
									this.imgUrl + "/file/" + this.materialDetails.detailImg
								);
							} else {
								let f = this.materialDetails.detailImg.split("|");
								for (let i = 0; i < f.length; i++) {
									this.imgSrc2.push(this.imgUrl + "/file/" + f[i].trim());
								}
							}
						}
						
						//证书
						this.materialDetails.certs = [];
						let certs = [];
						if(this.materialDetails.certificateNumber){
							if (this.materialDetails.certificateNumber.indexOf(",") > 0)
							  certs = this.materialDetails.certificateNumber.split(",");
							else certs = this.materialDetails.certificateNumber.split("，");
						}
						for (let i = 0; i < certs.length; ++i) {
						  let tmp = certs[i].trim();
						  if (tmp.length > 0) this.materialDetails.certs.push(tmp);
						}

						//其他权限
						if(this.materialDetails.agentPrice || this.materialDetails.counterLowestSellPrice){
							this.tabItems = ['裸石详情', '价格'];
						}
						
						setTimeout(() => {
						  this.scrollTop++;
						}, 500);

						this.initOk = true;
					},
				});
			},
			// 查看大图
			imagePreview(i) {
				uni.previewImage({
					current: i,
					urls: this.imgSrc,
				});
			},
			imagePreview2(index) {
				uni.previewImage({
					current: index,
					urls: this.imgSrc2,
				});
			},
			copyItem(src){
				uni.setClipboardData({
					data: src, //要被复制的内容
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
		},
	};
</script>

<style lang="scss" scoped>
	.material-container {
		width: 100%;
		// height: 100vh;
		background-color: #F7F8FA;

		.uni-swiper__dots-nav {
			justify-content: flex-end;
		}


		.price-container {
			margin-top: 56rpx;
			margin-bottom: 56rpx;
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #55B8B8;
			font-weight: bold;
		}

		.product-price-name {
			padding: 48rpx 30rpx;
			text-align: left;
			background-color: #fff;

			.product-name {

				.name-one {
					color: #171D26;
					font-size: 34rpx;
					font-weight: 900;
					font-family: 'PingFang SC-Heavy';
				}

				.name-two {
					margin-top: 20rpx;
					font-size: 30rpx;
					color: #505459;
					font-weight: 500;
					font-family: 'PingFang SC-Medium';
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
						color: #888D94;
					}

					.serve-left-content {
						margin-left: 48rpx;
						display: flex;
						align-items: center;
						color: #171D26;
						font-size: 28rpx;

						.circle {
							width: 6rpx;
							height: 6rpx;
							border-radius: 50%;
							background-color: #171D26;
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
					color: #171D26;
					font-weight: bold;
					font-family: 'PingFang SC-Bold';
				}

				.content {
					padding-top: 28rpx;
					font-size: 26rpx;
					color: #888D94;
					font-family: 'PingFang SC-Medium';
				}
			}

			.serve-button {
				margin-top: 302rpx;
				height: 88rpx;
				line-height: 88rpx;
				font-size: 28rpx;
				color: #fff;
				background-color: #55B8B8;
				text-align: center;
			}
		}

		.product-parameter {
			padding: 0rpx 40rpx;
			text-align: left;

			.parameter {
				padding: 26rpx 40rpx;
				color: #888D94;
				font-size: 24rpx;
				text-align: center;
			}

			.parameter-main {
				padding-top: 10rpx;
				padding-bottom: 40rpx;
				text-align: center;
				background-color: #fff;

				.title {
					color: #171D26;
					font-size: 30rpx;
					font-weight: bold;
				}

				.line {
					width: 80rpx;
					height: 4rpx;
					margin: 0 auto;
					margin-top: 16rpx;
					background-color: #55B8B8;
				}

				.parameter-main-container {
					margin: 60rpx 30rpx 0;
					border: 2rpx solid #E1E3E5;
					border-bottom: none;

					.container-every {
						display: flex;
						align-items: center;
						border-bottom: 2rpx solid #E1E3E5;

						.title,
						.content {
							font-size: 24rpx;
							color: #888D94;
							font-weight: normal;
						}

						.title {
							width: 164rpx;
							padding: 26rpx 0;
							border-right: 2rpx solid #E1E3E5;
							text-align: center;
						}

						.content {
							flex: 1;
							padding: 26rpx 0 26rpx 46rpx;
							text-align: left;
						}
					}
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
					color: #5E6166;
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
					border: 4rpx solid #55B8B8;
				}

				.add-cart {
					background-color: #fff;
					color: #55B8B8;
				}

				.buy-button {
					background-color: #55B8B8;
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
					height: 160rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					font-size: 22rpx;
					color: #55B8B8;

					.product-name {
						color: #171D26;
						font-size: 30rpx;
						font-weight: bold;
					}

					.discount-price {
						font-size: 34rpx;
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
					color: #171D26;
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
						color: #171D26;
						background-color: #F4F5F6;
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
						background-color: #F4F5F6;
					}
				}
			}

			.buy-button {
				height: 88rpx;
				margin-top: 254rpx;
				line-height: 88rpx;
				text-align: center;
				background: #55B8B8;
				color: #fff;
				font-size: 28rpx;
				border-radius: 4rpx;
			}
		}
	}
</style>
