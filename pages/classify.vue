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
			分类</view
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
		<view class="classify-wrapper">
			<view v-for="(item, index) in datalist" :key="index">
				<!-- 产品分类 -->
				<view class="classify-box" v-if="reanderType(item) == 'classify'">
					<view class="classify-content-wrapper">
						<scroll-view scroll-x class="classify-scroll">
							<view
								class="classify-item"
								v-for="(item1, index1) in item.dataStr"
								:key="index1"
								@click.stop="goSearchResult(item1.jumpUrl)"
							>
								<EasyLoadimage
									class="classify-img"
									:imageSrc="apiHost + '/file/' + item1.imgUrl"
									:scrollTop="scrollTop"
								/>
							</view>
						</scroll-view>
					</view>
				</view>

				<!-- 标题图 -->
				<view class="title-img-wrapper" v-if="reanderType(item) == 'titleImg'">
					<image
						class="head-img"
						:src="apiHost + '/file/' + item.backgroundImg"
						mode="heightFix"
					></image>
				</view>

				<!-- 品牌系列 -->
				<view
					class="classify-main"
					v-if="reanderType(item) == 'imgPath'"
				>
					<view @click.stop="goSearchResult(item.imgUrl)">
						<EasyLoadimage
							class="main-img"
							:imageSrc="apiHost + '/file/' + item.backgroundImg"
							:scrollTop="scrollTop"
							mode="widthFix"
						/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import * as Api from '@/api/api';
import { api_host } from '@/utils/request';
import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
export default {
	components: { EasyLoadimage },
	name: 'classify',
	data() {
		return {
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
			localImgUrl: app.globalData.localImgUrl,
			apiHost: api_host,
			scrollTop: 0,
			datalist: [],
		};
	},
	onLoad() {
		setTimeout(() => {
			this.scrollTop++;
		}, 500);
		this.indexOrSortDataGet();
	},
	computed: {
		/**
		 * 获取渲染类型
		 * classify 产品分类
		 * imgPath 图+路径
		 * titleImg 标题图
		 */
		reanderType() {
			return (item) => {
				// classify 产品分类
				if (item.viewType == 1 && item.dataStr != '[]' && item.dataStr) {
					return 'classify';
				} else if (item.viewType == 0 && item.imgUrl && item.backgroundImg) {
					// imgPath 图+路径
					return 'imgPath';
				} else if (item.viewType == 0 && item.backgroundImg && !item.imgUrl) {
					return 'titleImg';
				}
				return '';
			};
		},

		searchTop() {
			return (menuBtnInfo) => {
				let value = menuBtnInfo.height + menuBtnInfo.top + 20;
				return value;
			};
		},
	},
	methods: {
		/**
		 * 商品分类列表
		 * ele.viewType 1 dataStr 关联数据
		 * ele.viewType 0 imgUrl空  backgroundImg 头图
		 * ele.viewType 0 imgUrl有值 backgroundImg 系列背景图
		 */
		async indexOrSortDataGet() {
			const { data: res } = await Api.indexOrSortDataGet(1);
			if (res.code == 200) {
				if (res.data && res.data.length) {
					res.data.map((item) => {
						if (item.dataStr && item.dataStr != '[]') {
							item.dataStr = JSON.parse(item.dataStr);
						}
						return item;
					});
					this.datalist = res.data;
					setTimeout(() => {
						this.scrollTop++;
					}, 500);
				}
			}
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
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
};
</script>

<!-- 28px -->
<style lang="scss" scoped>
.padding-box-sizing {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.container {
	box-sizing: border-box;
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

	// 产品分类
	.classify-wrapper {
		margin-top: 70rpx;
	}
	.classify-box {
		.classify-head {
			margin-top: 70rpx;
			text-align: center;
		}
		.classify-content-wrapper {
			width: 100%;
			position: relative;
			height: 524rpx;
			white-space: nowrap;
			margin-top: 50rpx;
			background-image: url('../static/imgs/classify/boxshow_bg.png');
			background-size: 100% 100%;

			.classify-scroll {
				min-width: 100%;
				z-index: 1;
				overflow: scroll;
				.classify-item {
					display: inline-block;
					width: 330rpx;
					height: 424rpx;
					margin-right: 20rpx;
					margin-top: 50rpx;
					&:first-child {
						margin-left: 30rpx;
					}
					&:last-child {
						margin-right: 30rpx;
					}
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}

	.title-img-wrapper {
		width: 100%;
		text-align: center;
		.head-img {
			height: 232rpx;
		}
	}

	// 品牌系列
	.classify-main {
		width: 100%;
		margin-bottom: 30rpx;
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
