<template>
	<view class="mine-container">
		<!-- 积分使用详情，订单发货、退款、物流等，优惠券列表、领取等 -->
		<view class="mine-top">
			<view :style="{ height: height + 'px' }"></view>
			<view class="top-user">
				<view class="mine-headPic">
					<view style="display: flex; align-items: center">
						<view class="mine-img-div">
							<image v-if="headPic" :src="headPic" mode="aspectFill" class="mine-img"></image>
							<image v-else src="../static/imgs/mine/avatar.png" class="mine-img"></image>
						</view>
						<view class="mine-nick">
							<text style="font-size: 34rpx">PAULIANA</text>
							<view v-if="token == '' || token == null" class="wechat-login">
								<navigator url="/my/phoneLogin" hover-class="none">
									微信登录
								</navigator>
							</view>
							<view class="wechat-login" v-else>
								{{ nick }}
							</view>
						</view>
					</view>

					<view class="logout-button" @click="logout" v-if="token">
						退出登录
					</view>
				</view>
			</view>

			<view class="mine-integral" @click="goCorrespondingPage('../my/integral')">
				<image class="inte-back-img" src="../static/imgs/mine/back.png" mode="aspectFill"></image>
				<view class="inte-main">
					<view style="font-size: 28rpx">会员积分</view>
					<view style="font-size: 52rpx">{{ integralNum }}</view>
				</view>
			</view>
		</view>

		<view class="mine-second">
			<view class="second-title">
				<text class="title">我的订单</text>
				<view class="title-right" @click="goCorrespondingPage('../order/orderList?page=0')">
					<text>全部</text>
					<image class="img" src="../static/imgs/mine/right.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="line"></view>
			<view class="second-main">
				<view class="second-every" @click="goCorrespondingPage('../order/orderList?page=1')">
					<image src="../static/imgs/mine/order001.png" mode="aspectFill"></image>
					<text>待付款</text>
				</view>
				<view class="second-every" @click="goCorrespondingPage('../order/orderList?page=2')">
					<image src="../static/imgs/mine/order002.png" mode="aspectFill"></image>
					<text>待发货</text>
				</view>
				<view class="second-every" @click="goCorrespondingPage('../order/orderList?page=3')">
					<image src="../static/imgs/mine/order003.png" mode="aspectFill"></image>
					<text>待收货</text>
				</view>
				<view class="second-every" @click="goCorrespondingPage('../order/returnOrder')">
					<image src="../static/imgs/mine/order004.png" mode="aspectFill"></image>
					<text>退款/售后</text>
				</view>
			</view>
		</view>

		<view class="mine-third">
			<view class="third-every" @click="goCorrespondingPage('../order/addr/addressAdmin')">
				<image src="../static/imgs/mine/addr.png" mode="aspectFill"></image>
				<text>地址管理</text>
			</view>
			<view class="line"></view>
			<view class="third-every" @click="goCorrespondingPage('../my/collectGoods')">
				<image src="../static/imgs/mine/collect.png" mode="aspectFill"></image>
				<text>我的收藏</text>
			</view>
			<view class="line"></view>
			<view class="third-every" @click="goCorrespondingPage('../my/discountCoupon')">
				<image src="../static/imgs/mine/activity.png" mode="aspectFill"></image>
				<text>优惠券</text>
			</view>
			<view class="line"></view>
			<button open-type="contact" :plain="true" class="serviceButton third-every">
				<image src="../static/imgs/mine/service.png" mode="aspectFill"></image>
				<text>联系我们</text>
			</button>
		</view>

		
		<view v-if="authority.manage.show">
			<view class="mine-third">
				<view v-if="authority.manage.stoneStock" class="third-every" @click="goCorrespondingPage('../manage/stoneList')">
					<image src="../static/imgs/mine/stone.png" mode="aspectFill"></image>
					<text>裸石查询</text>
				</view>
				<view v-if="authority.manage.productStock" class="line"></view>
				<view v-if="authority.manage.productStock" class="third-every" @click="goCorrespondingPage('../manage/productList')">
					<image src="../static/imgs/mine/product.png" mode="aspectFill"></image>
					<text>成品查询</text>
				</view>
				<view v-if="authority.manage.reportView" class="line"></view>
				<button v-if="authority.manage.reportView" open-type="contact" :plain="true" class="serviceButton third-every">
					<image src="../static/imgs/mine/reportview.png" mode="aspectFill"></image>
					<text>报表查阅</text>
				</button>
			</view>
			<view style="margin-top: 32rpx;height: 1rpx;"></view>
		</view>
		
		<view v-else class="mine-product-list">
			<view class="title"> 精选推荐 </view>
			<view class="recommend-box">
				<GoodsList :marginTop="0" :scrollTop="scrollTop" :goodsList="jewelryList" />
			</view>
		</view>

		<uni-popup ref="wechatLoginPopup" type="bottom">

		</uni-popup>
	</view>
</template>

<script>
	import * as Api from "@/api/api";
	import GoodsList from "@/components/goods-list/goods-list";

	export default {
		components: {
			GoodsList
		},
		data() {
			return {
				scrollTop: 0,
				height: null,

				headPic: "",
				nick: "",
				token: "",
				integralNum: 0,
				openId: null,
				sessionKey: "",

				jewelryList: [],
				authority:'',
			};
		},
		onLoad() {
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: (data) => {
					this.height = data.statusBarHeight;
				},
			});

			this.token = uni.getStorageSync("token");
			console.log(this.token);
			if (this.token) {
				this.headPic = uni.getStorageSync("headPic");
				this.nick = uni.getStorageSync("nick");
				this.integralNum = uni.getStorageSync("totalIntegral");
				this.authority = uni.getStorageSync("authority");
				this.getUserInfo();
			}
		},
		onShow() {
			this.token = uni.getStorageSync("token");
			console.log(this.token);

			if (this.token) {
				this.getIntegral();
				this.getUserInfo();
			}

			this.getRecommendProductList();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			// 获取用户积分
			getIntegral() {
				uni.request({
					url: this.$baseUrl + "/totalIntegralGet",
					method: "GET",
					header: {
						"content-type": "application/json",
						token: this.token,
					},
					complete: (res) => {
						console.log("用户积分", res);

						this.integralNum = res.data.data;
						uni.setStorageSync("totalIntegral", res.data.data);
					},
				});
			},
			// 获取用户信息
			getUserInfo() {
				uni.request({
					url: this.$baseUrl + "/userMsgGet",
					method: "GET",
					header: {
						"content-type": "application/json",
						token: this.token,
					},
					complete: (ret) => {
						console.log("用户信息", ret);
						if (this.checkBack(ret, true) == true) {
							this.setUserInfo(ret.data);

							this.nick = uni.getStorageSync("nick");
							this.headPic = uni.getStorageSync("headPic");
							this.token = uni.getStorageSync("token");
							this.authority = uni.getStorageSync("authority");
							
							console.log('headPic', this.headPic)

							uni.setStorageSync("userAddress", ret.data.data.recvAddress);
						}
					},
				});
			},
			// 查看商品详情
			checkDetails(item) {
				console.log(item);

				uni.navigateTo({
					url: "../pauliana/jewelryDetails?id=" + item.id,
				});
			},
			// 推荐产品
			async getRecommendProductList() {
				const {
					data: res
				} = await Api.recommendProductList();
				this.jewelryList = res.data;
				setTimeout(() => {
					this.scrollTop++;
				}, 500);
			},
			// 会员等级
			gradeMembership(grade) {
				if (grade == 0) {
					return "新晋会员";
				} else if (grade > 0 && grade < 10000) {
					return "普通会员";
				} else if (grade > 9999 && grade < 50000) {
					return "白银会员";
				} else if (grade > 49999 && grade < 300000) {
					return "黄金会员";
				} else if (grade > 299999 && grade <= 1000000) {
					return "铂金会员";
				} else if (grade > 1000000) {
					return "钻石会员";
				}
			},

			// 页面跳转
			goCorrespondingPage(url) {
				if (this.token) {
					uni.navigateTo({
						url: url,
					});
				} else {
					uni.showToast({
						icon: "none",
						title: "登录即可查看该功能",
					});
				}
			},

			// 退出登录
			logout() {
				this.token = "";
				this.nick = "";
				this.headPic = "";
				this.integralNum = 0;

				uni.setStorageSync("token", "");
				uni.setStorageSync("nick", "");
				uni.setStorageSync("headPic", "");
				uni.setStorageSync("phoneNumber", "");
				uni.setStorageSync("totalIntegral", "");
			},
		},
	};
</script>

<style lang="scss" scoped>
	.hide {
		display: none;
	}

	.mine-container {
		min-height: 100vh;
		background-color: #f2f3f5;

		.mine-top {
			height: 547rpx;
			padding: 0 30rpx;
			display: flex;
			flex-direction: column;
			background: url("../static/imgs/mine/background.png") no-repeat;
			background-size: 100%;
			position: relative;

			.top-user {
				margin-top: 120rpx;

				.mine-headPic {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.mine-img-div {
						margin-right: 30rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.mine-img {
							width: 136rpx;
							height: 136rpx;
							border-radius: 50%;
						}
					}

					.mine-nick {
						color: #ffffff;

						.wechat-login {
							margin-top: 18rpx;
							font-size: 24rpx;

							button {
								padding: 0;
								line-height: 1;
								border: none;
								color: #fff;
								font-size: 28rpx;
								color: #fff;
							}
						}
					}

					.logout-button {
						padding: 9rpx 18rpx;
						font-size: 22rpx;
						color: #fff;
						border: 2rpx solid #fff;
						border-radius: 66rpx;
					}
				}
			}

			.mine-integral {
				height: 170rpx;

				.inte-back-img {
					position: absolute;
					bottom: 0;
					left: 30rpx;
					right: 30rpx;
					width: 691rpx;
					height: 170rpx;
					z-index: 0;
				}

				.inte-main {
					position: absolute;
					bottom: 34rpx;
					left: 56rpx;
					color: #55b8b8;
					z-index: 1;
				}
			}
		}

		.mine-second {
			background-color: #fff;

			.second-title {
				padding: 40rpx 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					font-size: 34rpx;
					color: #171d26;
					font-weight: bold;
				}

				.title-right {
					font-size: 26rpx;
					color: #888d94;

					.img {
						width: 12rpx;
						height: 20rpx;
						margin-left: 20rpx;
					}
				}
			}

			.line {
				margin-left: 30rpx;
				width: calc(100% - 30rpx);
				height: 4rpx;
				background-color: #f2f3f5;
				box-sizing: border-box;
			}

			.second-main {
				padding: 30rpx 56rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.second-every {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: #505459;
					font-size: 24rpx;

					image {
						width: 57rpx;
						height: 56rpx;
						margin-bottom: 10rpx;
					}
				}
			}
		}

		.mine-third {
			margin-top: 32rpx;
			padding: 62rpx 56rpx;
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.third-every {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #505459;
				font-size: 24rpx;

				image {
					width: 81rpx;
					height: 80rpx;
					margin-bottom: 20rpx;
				}
			}

			.line {
				width: 4rpx;
				height: 132rpx;
				background-color: #f2f3f5;
			}

			.serviceButton {
				padding: 0;
				margin: 0;
				line-height: unset;
				border: none;
			}
		}

		.mine-product-list {
			margin-top: 32rpx;
			background-color: #fff;

			.title {
				padding: 44rpx 30rpx;
				font-size: 34rpx;
				color: #171d26;
				font-weight: bold;
			}

			.recommend-product-list {
				padding: 20rpx;
				display: grid;
				justify-content: space-between;
				grid-template-columns: repeat(auto-fill, 344rpx);
				grid-gap: 20rpx;

				.item {
					padding: 20rpx;
					margin-bottom: 20rpx;

					.img {
						width: 304rpx;
						height: 304rpx;
						border-radius: 30rpx;
					}

					.product-title {
						margin: 30rpx 0;
						font-size: 28rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						color: #1f2033;
					}

					.price {
						margin-top: 22rpx;
						font-size: 28rpx;
						color: #55b8b8;
					}
				}
			}

			.recommend-box {
				width: 100%;
				padding: 0 30rpx 40rpx 30rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
