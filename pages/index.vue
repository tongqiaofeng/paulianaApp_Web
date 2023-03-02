<template>
	<view class="container">
		<view
			class="index-top"
			:style="{
				height: menuBtnInfo.height + 'px',
				'padding-top': menuBtnInfo.top + 'px',
				'padding-bottom': '10px',
				'line-height': menuBtnInfo.height + 'px',
			}"
		>
			PAULIANA</view
		>
		<view
			class="search-bar-box"
			@click="goSearch"
			:style="{ 'margin-top': searchTop(menuBtnInfo) + 'px' }"
		>
			<image
				class="search-icon"
				v-if="localImgUrl"
				:src="localImgUrl + '/common/search.png'"
			></image>
			<input
				type="text"
				placeholder-class="search-placeholder"
				placeholder="搜索您感兴趣的"
				disabled
			/>
		</view>

		<view v-for="(item, index) in datalist" :key="index">
			<!-- 轮播 -->
			<view class="swiper-box" v-if="reanderType(item) == 'swiper'">
				<uni-swiper-dot
					:info="item.dataStr"
					mode="dot"
					:current="item.current"
					:dotsStyles="dotsStyles"
				>
					<swiper
						class="swiper-cover-item"
						autoplay
						:circular="true"
						:interval="4000"
						@change="handleSeriesChange($event, index)"
					>
						<swiper-item
							v-for="(item1, index1) in item.dataStr"
							:key="index1"
							@click.stop="goRelationType(item, item1)"
						>
							<view class="swiper-item" @click="goSearchResult(item1.jumpUrl)">
								<image
									class="swiper-activity-img"
									:src="apiHost + '/file/' + item1.imgUrl"
								></image>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>

			<!-- 品牌 图+路径 -->
			<view class="brand-box" v-if="reanderType(item) == 'imgPath'">
				<image
					@click="goSearchResult(item.imgUrl)"
					class="brand-cover-img"
					:src="apiHost + '/file/' + item.backgroundImg"
					mode="widthFix"
				/>
			</view>

			<!-- 系列 -->
			<view class="series-box" v-if="reanderType(item) == 'series'">
				<view class="series-item">
					<view class="series-head">
						<image
							class="series-head-img img-class"
							mode="aspectFit"
							:src="apiHost + '/file/' + item.titleImg"
						/>
					</view>
					<view class="series-main">
						<image
							class="series-main-bg img-class"
							mode="widthFix"
							:src="apiHost + '/file/' + item.backgroundImg"
						></image>
						<view class="series-content">
							<uni-swiper-dot
								:info="item.dataStr"
								:current="item.current"
								mode="dot"
								:dotsStyles="item.dotsStyles"
							>
								<swiper
									class="swiper-block"
									:autoplay="false"
									:interval="3000"
									:duration="1000"
									circular="true"
									previous-margin="162rpx"
									next-margin="162rpx"
									:current="item.current"
									@change="handleSeriesChange($event, index)"
								>
									<swiper-item
										class="swiper-item"
										v-for="(item1, index1) in item.dataStr"
										:key="index1"
										@click.stop="goRelationType(item, item1)"
									>
										<image
											:src="apiHost + '/file/' + item1.imgUrl"
											:class="[
												'slide-image',
												item.current === index1 ? 'active' : '',
											]"
											mode="widthFix"
										></image>
									</swiper-item>
								</swiper>
							</uni-swiper-dot>
						</view>
					</view>
				</view>
			</view>

			<!-- 标题图 -->
			<view class="title-img-wrapper" v-if="reanderType(item) == 'titleImg'">
				<image
					:src="apiHost + '/file/' + item.backgroundImg"
					class="head-img"
					mode="widthFix"
				></image>
			</view>

			<!-- 推荐 -->
			<view class="recommend-goods-box" v-if="reanderType(item) == 'recommend'">
				<GoodsList
					:scrollTop="scrollTop"
					:marginTop="60"
					:goodsList="item.recommendProductList"
				/>
				<text class="font-tip">没有更多了!</text>
			</view>
		</view>

		<!-- 优惠券 -->
		<uni-popup ref="discountPopup" type="center">
			<view class="discount-popup-container">
				<view class="discount-popup-main">
					<image
						class="back01"
						v-if="userImg"
						:src="imgUrl + userImg"
						mode="aspectFill"
					></image>
					<image
						class="back02"
						src="../static/imgs/index/member/button.png"
						mode="aspectFill"
						@click="getCoupon"
					></image>
					<text class="button-font" @click="getCoupon">立即加入</text>
				</view>
				<view class="discount-popup-close">
					<image
						src="../static/imgs/index/member/close.png"
						mode="aspectFill"
						@click="closePopup"
					></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const app = getApp();
import * as Api from '@/api/api';
import { api_host } from '@/utils/request';

import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
import GoodsList from '@/components/goods-list/goods-list';
export default {
	components: {
		EasyLoadimage,
		GoodsList,
	},
	data() {
		return {
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
			imgUrl: this.$baseUrl,
			localImgUrl: app.globalData.localImgUrl,
			apiHost: api_host,
			searchValue: '',
			scrollTop: 0,
			loadStatus: false, // 加载数据状态

			// 系列数据
			currentActivityIndex: 0,
			activityList: [], // 活动列表
			recList: [], // 推荐产品
			seriesList: [],
			dotsStyles: {
				width: 15,
				height: 2,
				backgroundColor: '#CACED4',
				border: '#CACED4',
				selectedBackgroundColor: '#171D26',
				selectedBorder: '#171D26',
			},
			brandList: [],
			titleImgList: [],

			newTitle: '',
			companyImg: '',
			userImg: '',

			datalist: [],
		};
	},
	onShow() {
		if (this.userImg) {
			let token = uni.getStorageSync('token');
			if (token.length == 0) {
				this.$nextTick(() => {
					this.$refs.discountPopup.open();
				});
			} else {
				this.$refs.discountPopup.close();
			}
		}
	},
	onLoad() {
		this.indexOrSortDataGet();
		// this.getDiscountList();
	},
	computed: {
		searchTop() {
			return (menuBtnInfo) => {
				let value = menuBtnInfo.height + menuBtnInfo.top + 20;
				return value;
			};
		},

		/**
		 * 获取渲染类型
		 * swiper轮播
		 * imgPath 图+路径
		 * series 系列(标题图+背景图+关联产品)
		 * titleImg 标题图
		 * 推荐recommend
		 */
		reanderType() {
			return (item) => {
				// swiper轮播
				if (
					item.viewType == 1 &&
					item.dataStr != '[]' &&
					!item.titleImg &&
					!item.recommendProductList
				) {
					return 'swiper';
				} else if (item.viewType == 0 && item.imgUrl && item.backgroundImg) {
					// imgPath图+路径
					return 'imgPath';
				} else if (
					item.viewType == 1 &&
					item.dataStr != '[]' &&
					item.titleImg &&
					item.backgroundImg &&
					!item.recommendProductList
				) {
					// series 系列(标题图+背景图+关联产品)
					return 'series';
				} else if (
					item.viewType == 1 &&
					item.recommendProductList &&
					item.recommendProductList.length
				) {
					// recommend推荐
					return 'recommend';
				} else if (item.viewType == 0 && item.backgroundImg && !item.imgUrl) {
					// titleImg 标题图
					return 'titleImg';
				}
				return '';
			};
		},
	},
	methods: {
		/**
		 * 首页数据
		 *
		 * 轮播图数据 viewType 1 存在 dataStr 不存在titleImg backgroundImg
		 * 系列数据 viewType 1  存在 titleImg backgroundImg dataStr
		 * 品牌 viewType 0 存在backgroundImg imgUrl
		 * 标题图  viewType 0 存在backgroundImg imgUrl不存在
		 * 推荐数据 viewType 1 recommendProductList列表存在
		 *
		 */
		async indexOrSortDataGet() {
			const { data: res } = await Api.indexOrSortDataGet(0);
			if (res.code == 200) {
				console.log(res.data);
				if (res.data && res.data.length) {
					// 轮播
					res.data
						.filter((item) => {
							return (
								item.viewType == 1 &&
								item.dataStr != '[]' &&
								!item.titleImg &&
								!item.recommendProductList
							);
						})
						.map((item1) => {
							item1.dataStr = JSON.parse(item1.dataStr);
							item1.current = 0;
							item1.dotsStyles = {
								width: 15,
								height: 2,
								backgroundColor: '#CACED4',
								border: '#CACED4',
								selectedBackgroundColor: '#171D26',
								selectedBorder: '#171D26',
							};
							return item1;
						});

					// 系列数据
					res.data
						.filter((item) => {
							return (
								item.viewType == 1 &&
								item.dataStr &&
								item.titleImg &&
								item.backgroundImg
							);
						})
						.map((item1) => {
							item1.dataStr = JSON.parse(item1.dataStr);
							item1.current = 0;
							item1.dotsStyles = {
								width: 15,
								height: 2,
								backgroundColor: '#CACED4',
								border: '#CACED4',
								selectedBackgroundColor: '#171D26',
								selectedBorder: '#171D26',
							};
							return item1;
						});

					console.log('data', res.data);
					this.datalist = res.data;
				}

				setTimeout(() => {
					this.scrollTop++;
				}, 500);
			}
		},

		// 获取新用户优惠券
		getDiscountList() {
			uni.request({
				url: this.$baseUrl + '/registrationCoupon',
				header: {
					'content-type': 'application/json',
				},
				complete: (res) => {
					console.log('优惠券');
					console.log(res);
				},
			});
		},
		// 关闭
		closePopup() {
			this.$refs.discountPopup.close();
		},
		// 领取优惠券
		getCoupon() {
			this.$refs.discountPopup.close();
			uni.navigateTo({
				url: '/my/getUserMsg',
			});
		},
		goSearch() {
			uni.navigateTo({
				url: '/pauliana/search',
			});
		},
		goSearchResult(url) {
			uni.navigateTo({
				url: url,
			});
		},
		// 跳转产品详情
		goJewelryDetails(productId) {
			uni.navigateTo({
				url: `/pauliana/jewelryDetails?id=${productId}`,
			});
		},
		handleActivityChange(event) {
			this.currentActivityIndex = event.detail.current;
		},
		// 系列轮播滑动
		handleSeriesChange(event, index) {
			let current = event.detail.current;
			this.datalist[index]['current'] = current;
		},

		// 跳转关联 relationType 0 产品 1设计图 2自定义网址 3设计师
		goRelationType(item, item1 = {}) {
      if (item.relationType == 0 && item1.id) {
        // 到产品
				uni.navigateTo({ url: `/pauliana/jewelryDetails?id=${item1.id}` });
      } else if (item.relationType == 1 && item1.id) {
        // 设计图
				uni.navigateTo({ url: `/designer/designDetails?id=${item1.id}` });
			} else if (item.relationType == 2 && item1.jumpUrl) {
				// 自定义网址
				uni.navigateTo({ url: item1.jumpUrl });
      } else if (item.relationType == 3) {
        // 设计师
				let url = `${item1.jumpUrl}&designerImg=${encodeURIComponent(
					JSON.stringify(item1.designerImg)
        )}`;
				uni.navigateTo({
					url: url,
				});
			}
		},
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	// 下拉刷新
	onPullDownRefresh() {
		setTimeout(() => {
			uni.showToast({
				title: '刷新成功',
				icon: 'none',
			});
			uni.stopPullDownRefresh();
		}, 500);
	},
};
</script>

<style lang="scss" scoped>
.img-class {
	width: 100%;
	height: 100%;
}
.container {
	width: 100%;
	padding-bottom: 60rpx;
	position: relative;
	.index-top {
		z-index: 999;
	}

	// 搜索
	.search-bar-box {
		width: 690rpx;
		height: 72rpx;
		background: #f5f6f7;
		border-radius: 8rpx;
		opacity: 1;
		margin: 20rpx auto;
		position: relative;
		display: flex;
		align-items: center;

		.search-icon {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			left: 32rpx;
		}

		input {
			width: 100%;
			padding-left: 88rpx;
			padding-right: 40rpx;
			box-sizing: border-box;
			font-size: 30rpx;
			color: #333;
		}

		.search-placeholder {
			color: #f5f6f7;
			font-size: 28rpx;
		}
	}

	// 轮播图
	.swiper-box {
		width: 100%;
		.swiper-cover-item {
			width: 100%;
			height: 424rpx;
			.swiper-item {
				width: 100%;
				height: 100%;
			}
			.swiper-activity-img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.brand-box {
		width: 100%;
		margin-top: 40rpx;
		.brand-cover-img {
			width: 100%;
		}
	}

	.series-box {
		width: 100%;
		.series-item {
			width: 100%;
			margin-top: 60rpx;

			.series-head {
				widows: 100%;
				height: 278rpx;
			}
			.series-main {
				width: 100%;
				height: 706rpx;
				position: relative;
				.series-main-bg {
					position: absolute;
					top: 0;
					right: 0;
					bottom: 0;
					left: 0;
				}

				.series-content {
					position: relative;
					z-index: 9;
					margin-top: 20px;
					.swiper-block {
						height: 706rpx;
						width: 100%;
					}

					.swiper-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						overflow: unset;
						position: relative;
						box-sizing: border-box;
						margin-top: 72rpx;
					}

					/deep/ .uni-swiper__dots-box {
						bottom: 20px !important;
					}

					.slide-image {
						z-index: 1;
						height: 512rpx;
						width: 384rpx;
					}

					.active {
						transform: scale(1.14);
						transition: all 0.3s ease-in 0s;
						z-index: 20;
					}
				}
			}
		}
	}

	.title-img-wrapper {
		width: 100%;
		text-align: center;
		margin-top: 40rpx;
		.head-img {
			width: 322rpx;
		}
	}

	// 推荐
	.recommend-goods-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		margin-top: 30rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		.font-tip {
			font-size: 24rpx;
			color: #333;
			margin-top: 50rpx;
		}
	}

	// 优惠券
	.discount-popup-container {
		width: 100vw;
		height: 100vh;
		padding: 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(23, 29, 38, 0.8);

		.discount-popup-main {
			width: 690rpx;
			height: 850rpx;
			position: relative;

			.back01 {
				width: 690rpx;
				height: 850rpx;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				z-index: 0;
			}

			.back02 {
				width: 402rpx;
				height: 102rpx;
				position: absolute;
				left: 144rpx;
				right: 144rpx;
				bottom: 36rpx;
				z-index: 99;
			}

			.button-font {
				position: absolute;
				left: 278rpx;
				right: 278rpx;
				bottom: 74rpx;
				z-index: 999;
				font-size: 32rpx;
				color: #4aa5a5;
			}
		}

		.discount-popup-close {
			margin-top: 64rpx;

			image {
				width: 68rpx;
				height: 68rpx;
			}
		}
	}
}
</style>
