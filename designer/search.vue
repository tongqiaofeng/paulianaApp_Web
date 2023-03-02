<template>
	<view class="container">
		<HeaderTop
			:headerHeight="headerHeight"
			:title="'设计图搜索'"
			:isDefaultBack="false"
			@back="goBack"
		/>
		<view class="search-bar-box" :style="{ top: headerHeight + 10 + 'px' }">
			<view class="search-input-wrap">
				<image
					class="search-icon"
					v-if="localImgUrl"
					:src="localImgUrl + '/common/search.png'"
				></image>
				<input
					type="text"
					v-model="keywords"
					:focus="focusStatus"
					placeholder-class="search-placeholder"
					placeholder="名称/设计师/标签/设计理念"
				/>
				<image
					class="del-icon"
					@click="clearKeywords"
					v-if="localImgUrl && keywords"
					:src="localImgUrl + '/common/search_del.png'"
				></image>
			</view>
			<view class="filter-wrap" @click="filterSort">
				<text class="filter-font">筛选</text>
				<image
					class="filter-icon"
					v-if="localImgUrl"
					:src="localImgUrl + '/common/filter_icon.png'"
				>
				</image>
			</view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-goods-box">
			<scroll-view
				scroll-y
				class="goods-scroll"
				@scrolltolower="onGoodsReachBottom"
				@scroll="onGoodsScroll"
				:style="{
					top: navbarStyle.top + 'rpx',
					height: navbarStyle.height,
				}"
			>
				<view class="goods-box" v-if="searchList.length">
					<view class="design-list">
						<view
							class="design-item"
							v-for="(item, index) in searchList"
							:key="index"
							@click="goDesignDetail(item.id)"
						>
							<view class="goods-cover-img">
								<EasyLoadimage
									class="goods-img"
									mode="aspectFill"
									:imageSrc="apiHost + '/file/' + item.img"
									:scrollTop="scrollTop"
								/>
							</view>
							<view class="card-info">
								<view class="title">{{ item.name }}</view>
								<view class="label-wrap ellipsis">{{ item.label }}</view>
								<view class="design-name ellipsis"
									>设计师:{{ item.designerName }}</view
								>
							</view>
						</view>
					</view>
				</view>
				<view v-else class="no-data" :style="{ paddingTop: '300rpx' }">
					<image
						v-if="localImgUrl"
						:src="localImgUrl + '/common/no.png'"
						mode="aspectFill"
					></image>
					<text style="font-size: 30rpx">暂无搜索商品~</text>
				</view>
			</scroll-view>
		</view>

		<!-- 筛选弹窗 -->
		<uni-popup ref="filterPopup" type="bottom" @change="onFilterChange">
			<view class="popup-content">
				<view class="popup-title"> 设计图标签筛选 </view>
				<view class="gemstone-list">
					<text
						v-for="(item, index) in searchLabelList"
						:Key="index"
						@click="chooseSearchFilter(item)"
						class="gemstone-option ellipsis"
						:class="[selectLabelList.includes(item) ? 'active' : '']"
						>{{ item }}</text
					>
				</view>
				<view class="filter-btn" @click="confirmFilter">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
const app = getApp();
import storage from '@/utils/storage';
import * as Api from '@/api/api';
import HeaderTop from '@/components/header-top/header-top';
import GoodsList from '@/components/goods-list/goods-list';
import { api_host } from '@/utils/request';
import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';

export default {
	name: 'searchPage',
	components: {
		HeaderTop,
		GoodsList,
		EasyLoadimage,
	},
	data() {
		return {
			haveData: false,
			localImgUrl: app.globalData.localImgUrl,
			apiHost: api_host,
			scrollTop: 0,
			keywords: '',
			searchHistory: [],

			currentPage: 1,
			pageNum: 10,

			searchList: [],
			loadStatus: false, // 加载数据状态

			searchStatus: '',
			focusStatus: true,
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),

			filterPopupShow: false, // 筛选弹窗
			searchLabelList: [], // 标签数据列表
			selectLabelList: [], // 选择的标签
		};
	},
	onLoad(options) {
		if (options.tag) {
			this.keywords = options.tag;
		}
		this.designLabelListGet();
		this.getSearchResult();
	},
	methods: {
		// 设计图搜索数据
		async getSearchResult() {
			const params = {
				page: this.currentPage,
				pageNum: this.pageNum,
				keyword: this.keywords,
				labelList: this.selectLabelList,
			};
			const { data: res } = await Api.designSearch(params);

			if (res.code == 200) {
				let data = res.data;
				if (data.list.length < this.pageNum) {
					this.loadStatus = true;
				}
				setTimeout(() => {
					this.scrollTop++;
				}, 500);
				this.searchList = [...this.searchList, ...data.list];
			}
		},

		// 设计图标签数据
		async designLabelListGet() {
			const { data: res } = await Api.designLabelListGet();
			this.searchLabelList = res.data;
		},

		// 推荐产品
		async getRecommendProductList() {
			const { data: res } = await Api.recommendProductList();
			this.haveData = true;
			this.recList = res.data;
			setTimeout(() => {
				this.scrollTop++;
			}, 500);
		},

		onSearchClick(keyword) {
			this.keywords = keyword;
		},

		clearSearchHistory() {
			storage.remove('search_design_history');
			this.searchHistory = [];
		},
		// 搜索商品触底
		onGoodsReachBottom() {
			if (!this.loadStatus) {
				this.currentPage += 1;
				this.getSearchResult();
			}
		},
		onGoodsScroll(e) {
			let { scrollTop } = e.detail;
			this.scrollTop = scrollTop;
		},
		clearKeywords() {
			this.keywords = '';
		},
		// 返回事件
		goBack() {
			uni.navigateBack({
				delta: 1,
			});
		},
		filterSort() {
			this.$refs.filterPopup.open();
		},
		onFilterChange(e) {
			this.filterPopupShow = e.show;
		},
		chooseSearchFilter(value) {
			if (!this.selectLabelList.includes(value)) {
				this.selectLabelList.push(value);
			} else {
				let findIndex = this.selectLabelList.findIndex(
					(item) => item === value
				);
				if (findIndex > -1) {
					this.selectLabelList.splice(findIndex, 1);
				}
			}
		},
		confirmFilter() {
			this.currentPage = 1;
			this.searchList = [];
			this.loadStatus = false;
			this.$refs.filterPopup.close();
			setTimeout(() => {
				this.getSearchResult();
			}, 500);
		},
		goDesignDetail(id) {
			uni.navigateTo({
				url: '/designer/designDetails?id=' + id,
			});
		},

		_resetSearchParams() {
			this.currentPage = 1;
			this.loadStatus = false;
			this.searchList = [];
		},
	},
	computed: {
		headerHeight() {
			return this.menuBtnInfo.height + this.menuBtnInfo.top;
		},
		navbarStyle() {
			let headerHeight = this.menuBtnInfo.height + this.menuBtnInfo.top + 10;
			let top = headerHeight * 2 + 122;
			return {
				top: top,
				height: `calc(100vh - ${top}rpx)`,
			};
		},
	},
	watch: {
		keywords(value) {
			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.currentPage = 1;
				this.searchList = [];
				this.loadStatus = false;
				this.getSearchResult();
			}, 200);
		},
		searchStatus(value) {
			if (!value) {
				setTimeout(() => {
					this.scrollTop++;
				}, 500);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	min-height: 100vh;

	h5 {
		font-size: 28rpx;
		font-family: 'PingFang SC-Bold';
		font-weight: bold;
		color: #171d26;
		line-height: 28rpx;
	}

	.search-bar-box {
		width: 690rpx;
		opacity: 1;
		background-color: #fff;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 30rpx;
		right: 30rpx;
		z-index: 99;
		border: none;
		.search-input-wrap {
			width: 85%;
			height: 72rpx;
			padding: 20rpx 0;
			display: flex;
			align-items: center;
			position: relative;
			.del-icon {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				right: 32rpx;
				z-index: 99;
			}
		}
		.filter-wrap {
			display: flex;
			align-items: center;
			.filter-font {
				font-size: 28rpx;
				color: #333;
			}
			.filter-icon {
				width: 24rpx;
				height: 26rpx;
				margin-left: 6rpx;
			}
		}

		.search-icon {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			left: 32rpx;
		}

		input {
			width: 100%;
			height: inherit;
			background: #f5f6f7;
			padding-left: 88rpx;
			padding-right: 40rpx;
			box-sizing: border-box;
			font-size: 30rpx;
			color: #333;
			border-radius: 8rpx;
		}

		.del-icon {
			width: 36rpx;
			height: 36rpx;
			position: absolute;
			right: 32rpx;
			z-index: 999;
		}

		.search-placeholder {
			color: #888d94;
			font-size: 28rpx;
		}

		.search-tip {
			width: 76rpx;
			display: inline-block;
			text-align: right;
			height: 72rpx;
			line-height: 72rpx;
			font-size: 28rpx;
			font-family: 'PingFang SC-Medium';
			font-weight: 500;
			color: #171d26;
		}
	}

	// search-recommend-box
	.search-recommend-box {
		.search-scroll {
			position: fixed;
		}

		.search-history {
			width: 100%;
			padding: 0 30rpx;
			box-sizing: border-box;
			margin-top: 20rpx;

			.search-header {
				width: 100%;
				.del-icon {
					width: 36rpx;
					height: 36rpx;
				}
			}

			.search-keywords {
				margin-top: 10rpx;
				display: inline-flex;
				flex-wrap: wrap;

				.keyword {
					display: inline-block;
					font-size: 24rpx;
					font-family: 'PingFang SC-Medium';
					font-weight: 500;
					color: #888d94;
					line-height: 24rpx;
					margin-right: 64rpx;
					margin-top: 30rpx;
				}
			}
		}

		.recommend-box {
			width: 100%;
			padding: 0 30rpx 40rpx;
			box-sizing: border-box;
			margin-top: 60rpx;
			.filter-wrap {
				display: flex;
				align-items: center;
				.filter-font {
					font-size: 28rpx;
					color: #888d94;
				}
				.filter-icon {
					width: 24rpx;
					height: 26rpx;
					margin-left: 4rpx;
				}
			}
		}
	}

	// search-goods-box
	.search-goods-box {
		position: relative;
		.goods-scroll {
			height: calc(100vh - 102rpx);
			position: fixed;
			top: 102rpx;
		}

		.goods-box {
			width: 100%;
			padding: 0 30rpx 60rpx;
			box-sizing: border-box;
			position: relative;
			.design-list {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				.design-item {
					font-family: 'PingFang SC-Medium';
					font-weight: 500;
					margin-top: 50rpx;
					width: 330rpx;
					height: auto;

					.goods-cover-img {
						width: 100%;
						height: 512rpx;

						.goods-img {
							width: 100%;
							height: 100%;
							border-radius: 4rpx;
						}
					}

					&:nth-of-type(1),
					&:nth-of-type(2) {
						margin-top: 0;
					}
					.card-info {
						width: 100%;
						padding: 0 13rpx;
						box-sizing: border-box;
						.title {
							font-size: 28rpx;
							color: #1f2033;
							margin-top: 20rpx;
							width: 100%;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow-x: hidden;
						}
						.label-wrap {
							font-size: 24rpx;
							margin-top: 20rpx;
							color: #55b8b8;
						}
						.design-name {
							font-size: 24rpx;

							color: #1f2033;
							line-height: 28rpx;
							margin-top: 15rpx;
						}
					}
				}
			}
		}
	}

	.ellipsis {
		width: 100%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow-x: hidden;
	}

	.popup-content {
		width: 100%;
		padding-top: 60rpx;
		padding-bottom: 35rpx;
		background-color: #fff;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;

		.popup-title {
			margin-bottom: 80rpx;
			font-size: 30rpx;
			font-weight: bold;
			text-align: center;
		}

		.gemstone-list {
			padding: 0 20rpx;
			margin-top: 40rpx;
			display: grid;
			justify-content: space-between;
			grid-template-columns: repeat(auto-fill, 220rpx);
			grid-gap: 20rpx;
			max-height: 600rpx;
			overflow: scroll;
			.gemstone-option {
				height: 66rpx;
				padding: 0 20rpx;
				margin-bottom: 28rpx;
				background-color: #f5f6f7;
				border-radius: 38rpx;
				display: inline-block;
				font-size: 24rpx;
				color: #171d26;
				line-height: 66rpx;
				text-align: center;
				box-sizing: border-box;

				&.active {
					border: 2rpx solid #55b8b8;
					background-color: rgba(85, 184, 184, 0.3);
					color: #fff;
				}
			}
		}

		.filter-btn {
			width: 690rpx;
			height: 88rpx;
			line-height: 88rpx;
			background: #55b8b8;
			border-radius: 4rpx;
			font-size: 28rpx;
			font-weight: bold;
			color: #fff;
			text-align: center;
			margin: 35rpx auto 0;
			border-radius: 44rpx;
		}
	}
}
</style>
