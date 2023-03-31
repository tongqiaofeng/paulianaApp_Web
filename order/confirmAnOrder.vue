<template>
	<view class="confirm-order-container"	:class="{popupShow:popupShow}">
		<!-- 确认订单 -->
		<HeaderTop :headerHeight="headerHeight" :title="'确认订单'" :color="'#F2F3F5'" />
		<view class="confirm-order-container-top" :style="{'margin-top': headerHeight + 20 + 'px'}" @click="shippingAddress">
			<view class="top-left" v-if="selAddress">
				<view class="left-top">
					<image v-show="selAddress.isDefaultAddress == 1" class="default-sign"
						src="../static/imgs/order/mo.png" mode="aspectFill"></image>
					<text class="addr-name">{{ selAddress.name }}</text>
					<text class="addr-phone">{{ selAddress.phone }}</text>
				</view>
				<view class="left-bottom">
					{{ selAddress.area + selAddress.street }}
				</view>
			</view>
			<view class="top-left" v-else> 请选择收货地址 </view>
			<image class="top-right" src="../static/imgs/order/jiantou.png" mode="aspectFill"></image>
		</view>
		<view class="confirm-order-container-product">
			<view class="product-every" v-for="(item, index) in selList" :key="index">
				<view class="product-img">
					<image v-if="item.imgSrc" :src="imgUrl + item.imgSrc.trim()" mode="aspectFill"></image>
				</view>

				<view class="product-container">
					<view class="name">
						{{ decodeURIComponent(item.name) }}
					</view>
					<view class="product-price">
						<view class="price">
							{{"￥" + formatNumberRgx(item.discountPrice)}}
						</view>
						<view class="price-num">
							<image src="../static/imgs/order/x.png" mode="aspectFill"></image>
							<text>{{item.num}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="delivery-type">
				<text>配送服务</text>
				<view class="type-right">
					<text>快递 免邮</text>
				</view>
			</view>
			<view class="delivery-remark">
				<view>订单备注 </view>
				<view class="remark-main" @click="addRemark">
					<view class="remark" :style="{color: remark ? '#000' : '#999'}">{{remark ? remark : '无备注'}}</view>
					<image style="width: 14rpx;height: 24rpx;" src="../static/imgs/order/jiantou.png" mode="aspectFill">
					</image>
				</view>
			</view>
		</view>
		<uni-popup ref="remarkPopup" type="bottom">
			<view class="popup-container">
				<view class="popup-title">
					<text style="flex: 1;text-align: center;">订单备注</text>
					<uni-icons type="closeempty" size="20" @click="closePopup"></uni-icons>
				</view>
				<textarea :show-confirm-bar="false" class="remark-container" placeholder="选填,请先和商家协商一致,付款后商家可见"
					maxlength="200" placeholder-style="font-size: 28rpx;color: #c3c3c3;" v-model="remark"></textarea>
				<view class="button-sure" @click="closePopup">
					确定
				</view>
			</view>
		</uni-popup>

		<view class="confirm-order-container-product">
			<view class="price-detail-title">
				价格明细
			</view>
			<view class="delivery-price">
				<text class="title">商品总价</text>
				<text class="price-right"
					style="font-size: 32rpx;font-weight: bold;">{{"￥" + formatNumberRgx(totalPrice)}}</text>
			</view>
			<view class="delivery-price" v-if="integralNum > 0">
				<text class="title">积分</text>
				<view @click="isIntegral">
					<text class="price-right">
						{{integralCurrent == 1 ? '减' + integralPrice : '不使用'}}
					</text>
					<image style="width: 14rpx;height: 16rpx;margin-left: 10rpx;" src="../static/imgs/order/jiantou.png"
						mode="aspectFill">
					</image>
				</view>
			</view>
			<uni-popup ref="integralPopup" type="bottom">
				<view class="integral-popup-container">
					<view class="integral-title">
						积分抵扣
					</view>

					<view class="uni-list">
						<radio-group @change="integralRadioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="item in integralRadios"
								:key="item.value">
								<view class="integral-radio">
									<view class="name">{{item.name}}{{item.value == 1 ? integralTotal : ""}}</view>
									<view class="price">
										<text v-if="item.value == 1">可抵扣￥{{integralPrice}}元</text>
										<radio :value="item.value" :checked="item.value == integralCurrent"
											style="transform: scale(0.6)" />
									</view>
								</view>
							</label>
						</radio-group>
					</view>
				</view>
			</uni-popup>

			<view class="delivery-price" v-if="usableCouponList.length > 0">
				<view class="title">
					<text>优惠券</text>
					<view class="title-font" v-if="couponIdList.length > 0">
						已选{{couponIdList.length}}张
					</view>
				</view>

				<view @click="isDiscount">
					<text class="price-right">
						{{couponIdList.length == 0 ? usableCouponList.length + '张可用' : '减' + discountMsg.subtractAmount}}
					</text>
					<image style="width: 14rpx;height: 16rpx;margin-left: 10rpx;" src="../static/imgs/order/jiantou.png"
						mode="aspectFill">
					</image>
				</view>
			</view>
		</view>

		<uni-popup ref="discountPopup" type="bottom" @maskClick="closeDiscount">
			<view class="discount-popup-container">
				<view class="discount-title">
					<text>优惠券</text>
					<image style="width: 26rpx;height: 26rpx;" src="../static/imgs/order/close.png" mode="aspectFill"
						@click="closeDiscount"></image>
				</view>
				<view class="nav">
					<view class="tab-scroll_box">
						<!-- 选项卡类别列表 -->
						<view class="tab-scroll_item" v-for="(item,index) in category" :key="index"
							@click="chenkedChange(index)">
							<view
								:style="{'font-weight': isActive == index ? 'bold' : 'normal','margin-bottom': '30rpx',color: isActive == index ? '#171D26' : '#505459',}">
								<text>{{item.name}}</text>
								<text>{{index == 0 ? '(' + usableCouponList.length + ')' : '(' + unusableCouponList.length + ')'}}</text>
							</view>

							<view class="tab-name-line" v-show="isActive == index"></view>
						</view>
					</view>
				</view>

				<view class="discount-main">
					<view class="swiper-content" v-if="isActive == 0">
						<view class="use-discount-title">
							<text v-if="couponIdList.length > 0">
								已选中推荐优惠，使用优惠券{{couponIdList.length}}张，共抵扣<text
									style="color: #55B8B8;font-weight: bold;">￥{{discountMsg.subtractAmount}}</text>
							</text>
							<text v-else>请选择优惠券</text>
						</view>
						<scroll-view scroll-y="true" style="height: 500rpx;">
							<checkbox-group @change="discountRadioChange">
								<label class="uni-list-cell uni-list-cell-pd" v-for="item in usableCouponList"
									:key="item.id">
									<view class="discount-radio">
										<view class="radio-left">
											<image class="left-img" src="../static/imgs/order/back01.png"
												mode="aspectFill"></image>
											<view class="left-content">
												<view class="content-price">
													￥<text style="font-size: 64rpx;">{{item.subtractAmount}}</text>
												</view>
												<view class="content-condition" v-if="item.reachAmount">
													满{{item.reachAmount}}使用
												</view>
											</view>
										</view>
										<view class="radio-right">
											<view class="right-font">
												<text class="name">{{item.couponName}}</text>
												<view class="time" v-if="item.startTime && item.endTime">
													{{item.startTime.replace(/-/g, '.') + '-' + item.endTime.replace(/-/g, '.')}}
												</view>
												<view class="time" v-if="item.isMutual">
													此券暂不可和已勾选券叠加使用
												</view>
											</view>
											<view class="right-radio">
												<checkbox :value="item.id" :checked="item.checked == true"
													style="transform: scale(0.6)" />
											</view>
										</view>
									</view>
								</label>
							</checkbox-group>
						</scroll-view>
						<view class="discount-btn" @click="selDiscountSure">确定</view>
					</view>

					<view class="swiper-content" v-if="isActive == 1">
						<view style="margin-top: 21rpx;"></view>
						<scroll-view scroll-y="true" style="height: 730rpx;">
							<view v-for="item in unusableCouponList" :key="item.id">
								<view class="discount-radio">
									<view class="radio-left">
										<image class="left-img" src="../static/imgs/order/back01.png" mode="aspectFill">
										</image>
										<view class="left-content">
											<view class="content-price">
												￥<text style="font-size: 64rpx;">{{item.subtractAmount}}</text>
											</view>
											<view class="content-condition" v-if="item.reachAmount">
												满{{item.reachAmount}}使用
											</view>
										</view>
									</view>
									<view class="radio-right">
										<view class="right-font">
											<text class="name">{{item.couponName}}</text>
											<view class="time" v-if="item.startTime && item.endTime">
												{{item.startTime.replace(/-/g, '.') + '-' + item.endTime.replace(/-/g, '.')}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</uni-popup>

		<view class="confirm-order-container-product">
			<view class="delivery-price" style="margin: 0;">
				<view style="display: flex;align-items: center">
					<image src="../static/imgs/pay/wx.png" style="width: 30rpx; height: 28rpx; margin-right: 10rpx"
						mode="aspectFill">
					</image>
					<text class="title"> 微信支付</text>
				</view>
				<view>
					<radio style="transform: scale(0.7);" color="#55B8B8" checked>
					</radio>
				</view>
			</view>
		</view>
		<view class="confirm-order-container-total">
			<text class="total-num">共{{ num }}件</text>
			<view class="total-price">
				<text>合计：</text>
				<text style="font-size: 32rpx;font-weight: bold;color: #55B8B8;">{{
            "￥"+ formatNumberRgx(productSettlementMsg.actualAmountTotal)
          }}</text>
			</view>
			<view class="total-button" @click="createOrder">提交订单</view>
		</view>
	</view>
</template>

<script>
	import HeaderTop from '@/components/header-top/header-top';

	export default {
		components: {
			HeaderTop
		},
		data() {
			return {
				menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
				imgUrl: this.$baseUrl,
				totalPrice: 0,
				selAddress: "",
				selList: [],
				verification: {},
				num: 0,

				remark: "",
				integralPrice: 0,
				integralRadios: [{
					value: "1",
					name: "积分",
					checked: "true"
				}, {
					value: "0",
					name: "不使用",
					checked: "false"
				}],
				integralCurrent: 1,
				integralTotal: 0,
				integralNum: 0,

				isActive: 0,
				category: [{
						id: 1,
						name: '可用优惠券',
					},
					{
						id: 2,
						name: '不可用优惠券',
					},
				],

				orderType: 1,
				popupShow: false,

				usableCouponList: [],
				unusableCouponList: [],
				discountMsg: {},
				couponIdList: [],
				selIdList: [],
				productSettlementMsg: {},

			};
		},
		computed: {
			headerHeight() {
				return this.menuBtnInfo.height + this.menuBtnInfo.top;
			}
		},
		onShow() {
			let addr = uni.getStorageSync("userAddress");
			console.log('默认地址', addr);
			if (addr && this.selAddress == "") {
				this.selAddress = addr;
			}
		},
		onLoad(option) {
			if (option.productList) {
				if (option.type) this.orderType = option.type;
				this.selList = JSON.parse(decodeURIComponent(option.productList));

				for (let item of this.selList) {
					this.num += Number(item.num);
					this.totalPrice += Number(item.discountPrice * item.num);
				}

				this.getIntegral()
			}

			uni.$on('addrSelSure', (val) => {
				// console.log('选中地址信息', val);
				this.selAddress = val;
			})
		},
		methods: {
			// 获取用户积分
			getIntegral() {
				uni.request({
					url: this.$baseUrl + '/totalIntegralGet',
					method: 'GET',
					header: {
						'content-type': 'application/json',
						'token': uni.getStorageSync("token")
					},
					complete: (res) => {
						console.log('用户积分', res);

						this.integralNum = res.data.data;
						uni.setStorageSync("totalIntegral", res.data.data);

						if (this.integralNum > 0) {
							this.integralCurrent = 1;
						} else {
							this.integralCurrent = 0;
						}

						this.getProductSettlementPrice(1)
					},
				})
			},
			// 获取商品相关优惠券及结算金额
			getProductSettlementPrice(val) {
				let data = {};
				if (val) {
					data = {
						productList: this.selList,
						isUsedCoupon: 1,
						isUsedIntegral: this.integralCurrent
					}
				} else {
					data = {
						couponIdList: this.couponIdList,
						productList: this.selList,
						isUsedCoupon: this.couponIdList.length > 0 ? 1 : 0,
						isUsedIntegral: this.integralCurrent
					}
				}
				uni.request({
					url: this.$baseUrl + '/orderForm',
					method: 'POST',
					header: {
						'content-type': 'application/json',
						token: uni.getStorageSync("token"),
					},
					data: data,
					complete: (res) => {
						console.log('商品相关优惠券及结算金额', res);
						if (res.data.code === 200) {
							this.productSettlementMsg = res.data.data;
							this.usableCouponList = this.productSettlementMsg.usableCouponList;
							this.unusableCouponList = this.productSettlementMsg.unusableCouponList;

							if (this.productSettlementMsg.deductionPoints) {
								this.integralTotal = this.productSettlementMsg.deductionPoints;
								this.integralPrice = this.productSettlementMsg.deductionAmount;
								if (this.integralTotal > 0) {
									this.integralCurrent = 1;
								} else {
									this.integralCurrent = 0;
								}
							} else {
								this.integralTotal = this.integralNum;
								this.integralPrice = this.integralTotal / 100;
							}

							if (this.productSettlementMsg.mostEffectiveCouponIdList.length > 0 && val) {
								this.couponIdList = this.productSettlementMsg.mostEffectiveCouponIdList.map(
									String);
								this.selIdList = this.couponIdList;
								this.discountFilter();
							}

							this.discountMsg = {
								subtractAmount: this.productSettlementMsg.reduceAmountTotal
							};
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.data
							})
						}
					},
				})
			},

			// 打开积分界面
			isIntegral() {
				this.$refs.integralPopup.open();
			},
			// 是否积分抵扣
			integralRadioChange(e) {
				console.log(e);
				this.integralCurrent = e.detail.value;

				this.$refs.integralPopup.close();

				this.getProductSettlementPrice();
			},

			// 打开优惠券界面
			isDiscount() {
				this.$refs.discountPopup.open();

				this.selIdList = this.couponIdList;

				this.discountFilter()

				this.isActive = 0;
				this.popupShow = true;
			},
			// 是否优惠券抵扣
			discountRadioChange(e) {
				console.log(e);
				this.selIdList = e.detail.value;

				this.discountFilter()
			},
			// 判断当前选中优惠券的互斥优惠券内是否包含其他未选中的优惠券，
			// 包含的话  选中当前，互斥的取消选中，互斥的优惠券显示 - “此券暂不可和已勾选券叠加使用”
			discountFilter() {
				console.log('优惠券是否选中');
				console.log(this.selIdList);
				console.log(this.couponIdList);

				if (this.selIdList.length > 0) {
					for (let i = 0; i < this.usableCouponList.length; i++) {
						if (this.selIdList.indexOf(this.usableCouponList[i].id + "") == -1) {
							console.log('该项不选中');
							this.$set(this.usableCouponList[i], 'checked', false)
						} else {
							console.log('该项选中');
							this.$set(this.usableCouponList[i], 'checked', true)
						}
					}

					for (let item of this.usableCouponList) {

						let unList = []; // 互斥优惠券
						// 此次选中的优惠券 = 该优惠券，且该优惠券有互斥的
						if (item.mutexCoupon && item.id == this.selIdList[this.selIdList.length - 1]) {
							// 该优惠券的互斥优惠券id列表
							if (item.mutexCoupon.indexOf("-") == -1) {
								unList.push(item.mutexCoupon);
							} else {
								let f = item.mutexCoupon.split("-");
								for (let i = 0; i < f.length; i++) {
									if (f[i]) {
										unList.push(f[i].trim());
									}
								}
							};

							// 互斥优惠券id与已选中优惠券若是相等，则 取消该优惠券选择
							unList.map((n) => {
								for (let j = 0; j < this.selIdList.length; j++) {
									if (this.selIdList[j] == n) {
										this.selIdList.splice(j, 1);
									}
								};

								for (let i = 0; i < this.usableCouponList.length; i++) {
									if (this.usableCouponList[i].id == n) {
										this.$set(this.usableCouponList[i], "isMutual", true);
										this.$set(this.usableCouponList[i], 'checked', false)
									} else {
										this.$set(this.usableCouponList[i], "isMutual", false);

										if (this.selIdList.indexOf(this.usableCouponList[i].id + "") == -1) {
											console.log('该项不选中');
											this.$set(this.usableCouponList[i], 'checked', false)
										} else {
											console.log('该项选中');
											this.$set(this.usableCouponList[i], 'checked', true)
										}
									}
								}
							});
						}
					};
				} else {
					for (let i = 0; i < this.usableCouponList.length; i++) {
						this.$set(this.usableCouponList[i], "isMutual", false);
						this.$set(this.usableCouponList[i], 'checked', false)
					}
				}
			},
			// 确定选择优惠券
			selDiscountSure() {
				this.couponIdList = this.selIdList;

				this.getProductSettlementPrice();
				this.closeDiscount()
			},

			closeDiscount() {
				this.$refs.discountPopup.close();
				this.popupShow = false;

				this.$nextTick(() => {
					uni.pageScrollTo({
						scrollTop: 2000, //滚动到页面的目标位置（单位px）
						duration: 0 //滚动动画的时长，默认300ms，单位 ms
					});
				})
			},

			// 填写备注
			addRemark() {
				this.$refs.remarkPopup.open();
			},
			closePopup() {
				this.$refs.remarkPopup.close();
			},
			// 收货地址
			shippingAddress() {
				uni.navigateTo({
					url: "./addr/addressAdmin?type=1",
				});
			},
			// 生成支付订单
			createOrder() {
				if (this.selAddress) {
					// 传递参数
					// 商品id、数量、商品价格、交易金
					// 调用后端生成订单接口
					// 调用成功，打开支付页面

					uni.showLoading({
						title: "",
					});
					uni.request({
						url: this.$baseUrl + "/createOrder",
						method: "POST",
						data: {
							addressId: this.selAddress.id,
							detailList: this.productSettlementMsg.productList,
							productAmountTotal: this.totalPrice,
							actualAmountTotal: this.productSettlementMsg.actualAmountTotal,
							remark: this.remark,
							couponIdList: this.couponIdList, // 优惠券id
							deductionAmount: this
								.integralCurrent == 1 ? this.integralPrice : null, // 抵扣积分换算的抵扣金额
							deductionPoints: this
								.integralCurrent == 1 ? this.integralTotal : null, // 抵扣积分
							isUsedCoupon: this.couponIdList.length == 0 ? 0 : 1, // 是否使用优惠券；0：否 1：是
							isUsedIntegral: this
								.integralCurrent, // 是否使用积分；0：否 1：是；为1时，deductionPoints，deductionAmount必传
							orderType: this.orderType, // 0:购物车 1：直接购买
						},
						header: {
							"content-type": "application/json",
							token: uni.getStorageSync("token"),
						},
						complete: (res) => {
							uni.hideLoading();
							console.log("生成订单");
							console.log(res);

							if (res.data.code == 200) {
								this.verification = res.data.data;
								this.payOrder();
							} else {
								uni.showToast({
									icon: "none",
									title: res.data.data,
									duration: 2000,
								});
							}
						},
					});
				} else {
					uni.showToast({
						icon: "none",
						title: "请选择收货地址"
					})
				}
			},
			// 调取支付界面进行付款
			payOrder() {
				console.log("微信小程序支付");

				uni.requestPayment({
					provider: "wxpay",
					timeStamp: this.verification.payMsg.timeStamp.toString(),
					nonceStr: this.verification.payMsg.nonceStr,
					package: this.verification.payMsg.package,
					signType: "RSA",
					paySign: this.verification.payMsg.paySign,
					success: (ret) => {
						console.log("支付成功:");
						console.log(ret);

						uni.showToast({
							icon: "none",
							title: "支付成功",
							duration: 2000,
							success: () => {
								uni.reLaunch({
									url: "orderList?page=0",
								});
							}
						});
					},
					fail: (err) => {
						console.log("支付失败:");
            console.log(err);
            uni.navigateTo({url: '/order/orderList'})
						uni.showToast({
							icon: "none",
							title: "支付失败",
							duration: 2000,
						});
					},
				});
			},

			// 当前点击子元素靠左留一个选项展示，子元素宽度不相同也可实现
			chenkedChange(index) {
				this.isActive = index;
			},
		},
	};
</script>

<style scoped lang="scss">
	.popupShow {
		height: 100vh;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.confirm-order-container {
		min-height: calc(100vh - 120rpx);
		padding: 0 24rpx;
		padding-bottom: 160rpx;
		background-color: #F2F3F5;
		overflow: hidden;

		.confirm-order-container-top {
			padding: 40rpx 26rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			border-radius: 10rpx;

			.top-left {
				font-size: 28rpx;

				.left-top {
					.default-sign {
						width: 52rpx;
						height: 28rpx;
						margin-right: 6rpx;
					}

					.addr-name {
						margin-right: 9rpx;
						color: #171D26;
						font-size: 32rpx;
						font-weight: bold;
					}

					.addr-phone {
						font-size: 28rpx;
						color: #505459;
					}
				}

				.left-bottom {
					margin-top: 24rpx;
					font-size: 28rpx;
					color: #171D26;
				}
			}

			.top-right {
				width: 14rpx;
				height: 24rpx;
			}
		}

		.confirm-order-container-product {
			padding: 36rpx 20rpx;
			margin-top: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;

			.product-every {
				display: flex;
				margin-bottom: 40rpx;

				.product-img {
					margin-right: 20rpx;

					image {
						width: 180rpx;
						height: 180rpx;
					}
				}

				.product-container {
					width: 100%;
					padding: 22rpx 0;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.name {
						font-size: 26rpx;
						color: #000;
						text-align: left;
					}

					.product-price {
						display: flex;
						justify-content: space-between;

						.price {
							color: #171D26;
							font-size: 30rpx;
						}

						.price-num {
							display: flex;
							align-items: center;
							color: #171D26;
							font-size: 28rpx;

							image {
								width: 14rpx;
								height: 16rpx;
								margin-right: 4rpx;
							}
						}
					}
				}
			}

			.delivery-type {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;

				.type-right {
					display: flex;
					align-items: center;
				}
			}

			.delivery-remark {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;

				.remark-main {
					display: flex;
					align-items: center;

					.remark {
						width: 65vw;
						margin-right: 10rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						text-align: right;
					}
				}
			}

			.price-detail-title {
				font-size: 28rpx;
				font-weight: bold;
			}

			.delivery-price {
				margin-top: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;

				.title {
					color: #1F2033;
					display: flex;
					align-items: center;

					.title-font {
						margin-left: 10rpx;
						padding: 4rpx;
						border: 2rpx solid #50b2b2;
						font-size: 20rpx;
						color: #50b2b2;
						border-radius: 10rpx;
					}
				}

				.price-right {
					color: #50b2b2;
				}
			}
		}

		.popup-container {
			height: 70vh;
			padding: 40rpx 20rpx;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			background-color: #fff;
			position: relative;

			.popup-title {
				display: flex;
				color: #000;
				font-size: 32rpx;
			}

			.remark-container {
				width: inherit;
				margin-top: 60rpx;
				padding: 20rpx;
				background-color: #F2F3F5;
				font-size: 28rpx;
				color: #000;
				border-radius: 15rpx;
			}

			.button-sure {
				padding: 20rpx 0;
				background-color: #55B8B8;
				border-radius: 60rpx;
				color: #fff;
				text-align: center;
				position: absolute;
				bottom: 60rpx;
				left: 40rpx;
				right: 40rpx;
			}
		}

		.integral-popup-container {
			height: 40vh;
			padding: 40rpx 24rpx;
			background-color: #fff;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;

			.integral-title {
				margin-bottom: 60rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
			}

			.integral-radio {
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name {
					font-size: 24rpx;
				}

				.price {
					font-size: 24rpx;
					color: #50b2b2;
				}
			}
		}

		.discount-popup-container {
			height: 1000rpx;
			background-color: #F2F3F5;
			border-top-left-radius: 24rpx;
			border-top-right-radius: 24rpx;

			.discount-title {
				padding: 40rpx 30rpx 72rpx;
				display: flex;
				justify-content: space-between;
				font-size: 36rpx;
				font-weight: 900;
				color: #171D26;
				background-color: #fff;
			}

			.nav {
				width: 100%;
				// position: fixed;
				z-index: 99;
				align-items: center;
				background-color: #fff;

				.tab-scroll_box {
					display: flex;
					justify-content: space-around;
					align-items: center;
					flex-wrap: nowrap;
					box-sizing: border-box;

					.tab-scroll_item {
						width: 50vw;
						display: flex;
						flex-direction: column;
						align-items: center;
						font-size: 30rpx;

						.tab-name-line {
							width: 50vw;
							height: 4rpx;
							background-color: #55B8B8;
						}
					}
				}
			}

			.discount-main {

				.swiper-content {
					flex: 1;
					padding: 0 30rpx;
					background-color: #F2F3F5;

					.use-discount-title {
						padding: 40rpx 0;
						text-align: center;
						font-size: 24rpx;
						color: #505459;
					}

					.discount-radio {
						margin-bottom: 24rpx;
						display: flex;

						.radio-left {
							width: 240rpx;
							height: 224rpx;
							position: relative;

							.left-img {
								width: 240rpx;
								height: 224rpx;
								position: absolute;
								top: 0;
								left: 0;
								z-index: 0;
							}

							.left-content {
								width: 240rpx;
								height: 224rpx;
								position: absolute;
								top: 0;
								left: 0;
								z-index: 9;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;

								.content-price {
									font-size: 40rpx;
									font-weight: bold;
									color: #fff;
								}

								.content-condition {
									// margin-top: 12rpx;
									font-size: 26rpx;
									font-weight: 500;
									color: #fff;
								}
							}
						}

						.radio-right {
							flex: 1;
							height: 224rpx;
							padding-left: 24rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding-right: 32rpx;
							background-color: #fff;

							.right-font {
								.name {
									color: #171D26;
									font-weight: 900;
									font-size: 30rpx;
								}

								.time {
									margin-top: 32rpx;
									font-size: 22rpx;
									color: #888D94;
									font-weight: 500;
								}
							}
						}
					}

					.discount-btn {
						height: 80rpx;
						line-height: 80rpx;
						position: absolute;
						bottom: 16rpx;
						left: 30rpx;
						right: 30rpx;
						z-index: 999;
						font-size: 24rpx;
						background-color: #50b2b2;
						color: #fff;
						text-align: center;
					}
				}
			}
		}


		.confirm-order-container-total {
			height: 120rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #fff;

			.total-num {
				color: #888D94;
				font-size: 28rpx;
			}

			.total-price {
				margin-left: 16rpx;
				font-size: 28rpx;
			}

			.total-button {
				margin: 0 30rpx 0 36rpx;
				padding: 30rpx 48rpx;
				background-color: #55B8B8;
				color: #fff;
				font-size: 28rpx;
			}
		}

		.usdt-popup-container {
			padding: 60rpx 0 0;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			background-color: #fff;

			.usdt-title {
				text-align: center;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					color: #000;
				}

				.push {
					margin-top: 40rpx;
					font-size: 24rpx;
					color: #999999;
				}

				.price {
					font-size: 40rpx;
					color: #FF7821;
					font-weight: bold;

					.currency {
						margin-left: 10rpx;
					}
				}
			}

			.usdt-every {
				margin: 0 30rpx;
				padding: 30rpx 20rpx;
				margin-top: 30rpx;
				background-color: #EAFAF8;
				border-radius: 20rpx;

				.every-name {
					font-size: 30rpx;
					font-weight: bold;
				}

				.every-account {
					margin-top: 20rpx;
					display: flex;
					justify-content: space-between;

					.account {
						flex: 1;
						word-wrap: break-word;
						word-break: break-all;
						text-align: left;
						font-size: 28rpx;
						color: #4B605D;
					}

					.button-copy {
						margin-left: 30rpx;
						font-size: 26rpx;
						color: #72D5C8;
					}
				}
			}

			.usdt-font {
				margin-top: 80rpx;
				padding: 37rpx 32rpx;
				background-color: #EAFAF8;
				font-size: 28rpx;
				color: #000;
			}
		}
	}
</style>
