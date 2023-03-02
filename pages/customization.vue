<template>
	<view class="container">
		<view class="header-top">
			<image
				class="header-bg"
				src="/static/imgs/customization/top_bg.png"
			></image>
			<view
				class="custom-top"
				:style="{
					height: menuBtnInfo.height + 'px',
					'padding-top': menuBtnInfo.top + 'px',
				}"
			></view>

			<view class="custom-wrapper">
				<view v-for="(item, index) in datalist" :key="index">
					<!-- 标题图 -->
					<view
						class="title-img-wrapper"
						v-if="reanderType(item) == 'titleImg'"
					>
						<image
							class="head-img"
							:src="apiHost + '/file/' + item.backgroundImg"
							mode="widthFix"
						></image>
					</view>

					<!-- 系列 -->
					<view class="custom-swiper-box" v-if="reanderType(item) == 'series'">
						<view class="series-main">
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
										previous-margin="100rpx"
										next-margin="100rpx"
										:current="item.current"
										@change="handleSeriesChange($event, index)"
									>
										<swiper-item
											class="swiper-item"
											v-for="(item1, index1) in item.dataStr"
											:key="index1"
											@click.stop="goSearchResult(item1.jumpUrl)"
										>
											<image
												:src="apiHost + '/file/' + item1.imgUrl"
												:class="[
													'slide-image',
													item.current === index1 ? 'active' : '',
												]"
											></image>
										</swiper-item>
									</swiper>
								</uni-swiper-dot>
							</view>
						</view>
					</view>

					<!-- imgPath 图+路径 -->
					<view class="classify-box" v-if="reanderType(item) == 'imgPath'">
						<image
							@click.stop="goSearchResult(item.imgUrl)"
							class="classify-main-img"
							:src="apiHost + '/file/' + item.backgroundImg"
						></image>
					</view>

					<!-- 设计师 -->
					<view class="design-box" v-if="reanderType(item) == 'designer'">
						<view class="list">
							
							<view
								class="item"
								v-for="(item1, index1) in JSON.parse(item.dataStr)"
								:key="index1"
								@click.stop="goDesginerDetail(item1)"
							>
								<EasyLoadimage
									class="design-cover-img"
									:imageSrc="apiHost + '/file/' + item1.imgUrl"
									:scrollTop="scrollTop"
								/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import * as Api from '@/api/api';
import { api_host } from '@/utils/request';
import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
export default {
	components: {
		EasyLoadimage,
	},
	name: 'customization',
	data() {
		return {
			apiHost: api_host,
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
			designList: [],
			scrollTop: 0,
			dotsStyles: {
				width: 15,
				height: 2,
				backgroundColor: '#CACED4',
				border: '#CACED4',
				selectedBackgroundColor: '#171D26',
				selectedBorder: '#171D26',
			},
			seriesList: [], // 轮播定制列表
			titleImgList: [], // 标题图数据
			goodsList: [], // 产品列表
			designerList: [], // 设计师列表

			datalist: [],
		};
	},
	computed: {
		/**
		 * 获取渲染类型
		 * series 系列(标题图+背景图+关联产品)
		 * imgPath 图+路径
		 * titleImg 标题图
		 * designer 设计师
		 */
		reanderType() {
			return (item) => {
				// series 系列(标题图+背景图+关联产品)
				if (
					item.viewType == 1 &&
					item.relationType == 2 &&
					item.dataStr &&
					item.dataStr != '[]'
				) {
					return 'series';
				} else if (
					item.viewType == 0 &&
					item.relationType == 2 &&
					item.imgUrl &&
					item.backgroundImg
				) {
					// imgPath 图+路径
					return 'imgPath';
				} else if (
					item.viewType == 0 &&
					item.relationType == 2 &&
					!item.imgUrl &&
					item.backgroundImg
				) {
					// 标题图
					return 'titleImg';
				} else if (
					item.viewType == 1 &&
					item.relationType == 3 &&
					item.dataStr != '[]'
				) {
					// 设计师
					return 'designer';
				}
				return '';
			};
		},
	},
	onLoad() {
		this.indexOrSortDataGet();
	},
	methods: {
		async indexOrSortDataGet() {
			const { data: res } = await Api.indexOrSortDataGet(2);
			if (res.code == 200) {
				if (res.data && res.data.length) {
					// 系列数据
					res.data
						.filter((item) => {
							return (
								item.viewType == 1 && item.relationType == 2 && item.dataStr
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

					this.datalist = res.data;
					console.log(this.datalist);
				}
			}

			setTimeout(() => {
				this.scrollTop++;
			}, 500);
		},
		// 系列轮播滑动
		handleSeriesChange(event, index) {
			let current = event.detail.current;
			this.datalist[index]['current'] = current;
		},
		goSearchResult(url) {
			console.log(url);
			uni.navigateTo({
				url: url,
			});
		},
		// 设计师详情
		goDesginerDetail(item) {
			let url = `${item.jumpUrl}&designerImg=${encodeURIComponent(
				JSON.stringify(item.designerImg)
			)}`;

			if (item.jumpUrl) {
				uni.navigateTo({
					url: url,
				});
			}
		},
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	padding-bottom: 20rpx;
	font-family: 'PingFang SC-Medium';

	.header-top {
		position: relative;

		.header-bg {
			width: 100%;
			height: 658rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}

		.custom-header {
			width: 100%;
			position: relative;
			.logo-icon {
				// width: 690rpx;
				// height: 140rpx;
			}
		}
	}

	.title-img-wrapper {
		width: 100%;
		text-align: center;
		margin-top: 40rpx;
	}

	// 轮播图
	.custom-swiper-box {
		margin-top: 80rpx;
		.series-content {
			position: relative;
			z-index: 9;
			.swiper-block {
				height: 836rpx;
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
				display: none !important;
			}

			.slide-image {
				z-index: 1;
				width: 480rpx;
				height: 676rpx;
			}

			.active {
				transform: scale(1.14);
				transition: all 0.2s ease-in 0s;
				z-index: 20;
			}
		}
	}

	.classify-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		margin-top: 80rpx;
		image {
			width: 100%;
			height: 1080rpx;
			margin-bottom: 48rpx;
		}
	}

	.design-box {
		.design-head {
			image {
				width: 100%;
				height: 312rpx;
			}
		}
		.list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-top: 20rpx;
			.item {
				width: 330rpx;
				height: 564rpx;
				margin-bottom: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
