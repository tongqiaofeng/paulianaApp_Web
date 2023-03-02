<template>
	<view class="discount-coupop-container">
		<!-- 优惠券列表 -->
		<view class="discount-coupop-nav">
			<scroll-view class="tab-scroll" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
				<view class="tab-scroll_box">
					<!-- 选项卡类别列表 -->
					<view class="tab-scroll_item" v-for="item in typeList" :key="item.value"
						:class="{'active': isActive == item.value}" @click="checkedNav(item.value)">
						{{item.label + '('+ item.num +')'}}
					</view>
				</view>
			</scroll-view>

			<scroll-view class="tab-scroll tab-filter-scroll" scroll-x="true" scroll-with-animation
				:scroll-left="scrollLeft">
				<view class="tab-scroll_box">
					<!-- 选项卡类别列表 -->
					<view class="tab-scroll-filter_item" v-for="item in filterList" :key="item.value"
						:class="{'filterActive': isFilterActive == item.value}" @click="checkedFilter(item.value)">
						{{item.label}}
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="discount-coupop-main">
			<view v-if="discountList.length == 0" class="no-data" style="padding-top: 180rpx;">
				<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
				<text style="font-size: 30rpx">暂无优惠券~</text>
			</view>
			<view v-else class="main-content">
				<view v-for="(item,index) in discountList" :key="index">
					<view class="discount-radio">
						<view class="radio-right">
							<view class="right-font">
								<text class="name">{{item.couponName}}</text>
								<view class="time" v-if="item.startTime && item.endTime">
									{{item.startTime.replace(/-/g, '.') + '-' + item.endTime.replace(/-/g, '.')}}
								</view>
							</view>
						</view>
						<view class="radio-left">
							<image class="left-img" src="../static/imgs/order/back01.png" mode="aspectFill">
							</image>
							<view class="left-content">
								<view class="content-price">
									￥<text style="font-size: 64rpx;">{{item.subtractAmount}}</text>
								</view>
								<view class="content-condition" v-if="item.reachAmount">
									满{{item.reachAmount}}可用
								</view>
								<navigator url="/pauliana/search" hover-class="none" class="use-discount">
									立即使用
								</navigator>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				discountList: [],
				typeList: [{
						label: "全部",
						value: -1,
						num: 0,
					},
					{
						label: "满减券",
						value: 1,
						num: 0,
					},
					{
						label: "折扣券",
						value: 2,
						num: 0,
					},
					{
						label: "立减券",
						value: 3,
						num: 0,
					},
					{
						label: "满赠券",
						value: 4,
						num: 0,
					},
				],
				isActive: -1,
				filterList: [{
						label: "新 到",
						value: 0,
					},
					{
						label: "快过期",
						value: 1,
					},
					{
						label: "面额大到小",
						value: 2,
					},
					{
						label: "折扣大到小",
						value: 3,
					}
				],
				isFilterActive: -1,

			}
		},
		onLoad() {
			uni.request({
				url: this.$baseUrl + "/couponList?type=" + this.isActive + '&flag=' + this
					.isFilterActive,
				header: {
					"content-type": "application/json",
					"token": uni.getStorageSync("token")
				},
				complete: (res) => {
					console.log("优惠券");
					console.log(res);

					this.discountList = res.data.data;
					this.typeList[0].num = 0;
					this.typeList[1].num = 0;
					this.typeList[2].num = 0;
					this.typeList[3].num = 0;
					this.typeList[4].num = 0;

					for (let item of this.discountList) {
						if (item.type == 1) {
							this.typeList[1].num += 1;
						} else if (item.type == 2) {
							this.typeList[2].num += 1;
						} else if (item.type == 3) {
							this.typeList[3].num += 1;
						} else if (item.type == 4) {
							this.typeList[4].num += 1;
						}
					};

					this.typeList[0].num = this.typeList[1].num +
						this.typeList[2].num +
						this.typeList[3].num +
						this.typeList[4].num;
				},
			});
		},
		methods: {
			// nav切换
			checkedNav(val) {
				this.isActive = val;
				this.isFilterActive = -1;

				this.getDiscountList()
			},
			checkedFilter(val) {
				if (this.isFilterActive == val) {
					this.isFilterActive = -1;
				} else {
					this.isFilterActive = val
				};

				this.getDiscountList()
			},
			// 获取优惠券列表
			getDiscountList() {
				uni.request({
					url: this.$baseUrl + "/couponList?type=" + this.isActive + '&flag=' + this
						.isFilterActive,
					header: {
						"content-type": "application/json",
						"token": uni.getStorageSync("token")
					},
					complete: (res) => {
						console.log("优惠券");
						console.log(res);

						this.discountList = res.data.data;
					},
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.discount-coupop-container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #F2F3F5;

		.discount-coupop-nav {
			width: 100%;
			height: 170rpx;
			z-index: 99;
			position: fixed;
			align-items: center;
			background-color: #fff;

			.tab-scroll {
				flex: 1;
				overflow: hidden;
				box-sizing: border-box;

				.tab-scroll_box {
					display: flex;
					justify-content: space-around;
					align-items: center;
					flex-wrap: nowrap;
					box-sizing: border-box;

					.tab-scroll_item {
						flex-shrink: 0;
						padding: 20rpx 0;
						display: flex;
						justify-content: center;
						font-size: 28rpx;
					}

					.tab-scroll-filter_item {
						padding: 10rpx 30rpx;
						flex-shrink: 0;
						display: flex;
						justify-content: center;
						font-size: 24rpx;
						border-radius: 60rpx;
						background-color: #F5F6F7;
						border: 2rpx solid #F5F6F7;
						box-sizing: border-box;
					}
				}
			}

			.tab-filter-scroll {
				margin-top: 20rpx;
			}

			.active {
				color: #55B8B8;
				font-weight: bold;
			}

			.filterActive {
				border: 2rpx solid #55B8B8 !important;
				background-color: rgba(85, 184, 184, 0.3);
				color: #55B8B8;
				font-weight: bold;
			}
		}

		.discount-coupop-main {
			margin-top: 40rpx;
			padding: 0 24rpx;
			position: absolute;
			top: 170rpx;
			left: 0;
			right: 0;
			background-color: #F2F3F5;

			.main-content {

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

							.use-discount {
								margin-top: 20rpx;
								padding: 8rpx 20rpx;
								background-color: #fff;
								border-radius: 60rpx;
								font-size: 22rpx;
								color: #55B8B8;
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

			}
		}
	}
</style>
