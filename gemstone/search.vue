<template>
	<!-- 宝石查询 -->
	<view class="container" v-if="haveData">
		<HeaderTop :headerHeight="headerHeight" :title="'宝石查询'" />
		<view class="search-bar-box" id="search" :style="{ top: headerHeight + 10 + 'px' }">
			<view class="box-search">
				<image class="search-icon" v-if="localImgUrl" :src="localImgUrl + '/common/search.png'"></image>
				<input type="text" v-model="keywords" :focus="focusStatus" placeholder-class="search-placeholder"
					placeholder="宝石名称" />
				<image class="del-icon" @click="clearKeywords" v-if="localImgUrl && keywords"
					:src="localImgUrl + '/common/search_del.png'"></image>
			</view>

			<view class="navbar-list">
				<view class="navbar-tip" :class="{ 'navbar-active': navbar == '综合' }" @click="changeNavbar('综合')">
					<text class="navbar-tit">综合</text>
				</view>
				<view class="navbar-tip" :class="{ 'navbar-active': navbar == '销量' }" @click="numSort('销量')">
					<text class="navbar-tit">销量</text>
				</view>
				<view class="navbar-tip" :class="{ 'navbar-active': navbar == '价格' }" @click="priceSort('价格')">
					<text class="navbar-tit">价格</text>
					<image class="price-sort-icon" v-if="localImgUrl && sort == 0"
						:src="localImgUrl + '/common/sort.png'"></image>
					<image class="price-sort-icon" v-if="localImgUrl && sort == 1"
						:src="localImgUrl + '/common/sort_up.png'"></image>
					<image class="price-sort-icon" v-if="localImgUrl && sort == -1"
						:src="localImgUrl + '/common/sort_down.png'"></image>
				</view>
				<view class="navbar-tip" :class="{ 'navbar-active': navbar == '筛选' }" @click="filterSort('筛选')">
					<text class="navbar-tit">筛选</text>
					<image class="filter-icon" v-if="localImgUrl" :src="
              navbar == '筛选'
                ? localImgUrl + '/common/filter_green.png'
                : localImgUrl + '/common/filter_icon.png'
            ">
					</image>
				</view>
			</view>
		</view>

		<!-- 搜索结果 -->
		<scroll-view scroll-y class="goods-scroll" :style="{ top: goodsStyle.top + 'rpx', height: goodsStyle.height }"
			@scrolltolower="onGoodsReachBottom" @scroll="onGoodsScroll">
			<view class="goods-box" v-if="searchList.length > 0">
				<GoodsList :goodsList="searchList" :marginTop="0" :scrollTop="scrollTop" />
				<text class="notice-bottom-font" v-if="loadStatus">已经到底了哦~</text>
			</view>
			<view v-else class="no-data" :style="{ paddingTop: '300rpx' }">
				<image v-if="localImgUrl" :src="localImgUrl + '/common/no.png'" mode="aspectFill"></image>
				<text style="font-size: 30rpx">暂无搜索商品~</text>
			</view>
		</scroll-view>

		<!-- 筛选弹窗 -->
		<uni-popup ref="filterPopup" type="bottom" @change="onFilterChange">
			<view class="popup-content">
				<view class="popup-title"> 宝石分类 </view>
				<view class="gemstone-list">
					<text class="gemstone-option ellipsis" :class="{ active: gem == currentGemstone }"
						v-for="(gem, index) in gemstoneList" :key="index" @click="chooseGemstone(gem)">{{ gem }}</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const app = getApp();
	import storage from "@/utils/storage";
	import * as Api from "@/api/api";

	import HeaderTop from "@/components/header-top/header-top";
	import GoodsList from "@/components/goods-list/goods-list";

	export default {
		components: {
			HeaderTop,
			GoodsList,
		},
		name: "searchPage",
		data() {
			return {
				menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
				haveData: false,
				localImgUrl: app.globalData.localImgUrl,
				scrollTop: 0,
				keywords: "",
				searchList: [],
				currentPage: 1,
				pageNum: 10,
				sort: 0, // 排序规则 1正序 -1倒序 0默认
				navbar: "综合",
				gemstoneList: [], // 宝石分类
				loadStatus: false, // 加载数据状态
				focusStatus: false,
				filterPopupShow: false, // 筛选弹窗
				currentGemstone: "", // 选中宝石
			};
		},
		computed: {
			headerHeight() {
				return this.menuBtnInfo.height + this.menuBtnInfo.top;
			},
			goodsStyle() {
				let headerHeight = this.menuBtnInfo.height + this.menuBtnInfo.top;
				let top = (headerHeight + 10) * 2 + 188;
				return {
					top: top,
					height: `calc(100vh - ${top}rpx)`,
				};
			},
		},
		onLoad() {
			this.getGemstoneList();
			this.getSearchResult();
		},
		methods: {
			// 宝石分类列表
			async getGemstoneList() {
				const {
					data: res
				} = await Api.gemSortList();
				if (res.code == 200) {
					this.gemstoneList = res.data;
				}
			},

			// 搜索数据
			async getSearchResult() {
				const params = {
					gemName: this.currentGemstone,
					page: this.currentPage,
					pageNum: this.pageNum,
					sort: this.sort,
				};
				const {
					data: res
				} = await Api.gemSearch(params);

				this.haveData = true;

				if (res.code == 200) {
					let data = res.data;
					if (!data.list.length) {
						this.searchList = [];
					} else {
						if (data.list.length < this.pageNum) {
							this.loadStatus = true;
						}
						setTimeout(() => {
							this.scrollTop++;
						}, 500);
						this.searchList = [...this.searchList, ...data.list];
					}
				}
			},
			// 综合
			changeNavbar(status) {
				if (this.filterPopupShow) {
					this.$refs.filterPopup.close();
				}
				this.navbar = status;
				this._resetSearchParams();
				this.getSearchResult();
			},
			// 销量
			numSort(status) {
				if (this.filterPopupShow) {
					this.$refs.filterPopup.close();
				}
				this.navbar = status;
				this.currentPage = 1;
				this.sort = 0;
				this.loadStatus = false;
				this.searchList = [];
				this.getSearchResult();
			},
			// 价格
			priceSort(status) {
				if (this.filterPopupShow) {
					this.$refs.filterPopup.close();
				}
				this.navbar = status;
				if (this.navbar == "价格") {
					if (this.sort == 0 || this.sort == -1) {
						this.sort = 1;
					} else {
						this.sort = -1;
					}
				}
				this.currentPage = 1;
				this.loadStatus = false;
				this.searchList = [];
				this.getSearchResult();
			},
			onFilterChange(e) {
				this.filterPopupShow = e.show;
			},
			// 筛选
			filterSort(status) {
				this.navbar = status;

				if (!this.filterPopupShow) {
					this.$refs.filterPopup.open();
				} else {
					this.$refs.filterPopup.close();
				}
			},

			// 选中-搜索筛选宝石
			chooseGemstone(value) {
				this.currentGemstone = value;

				this._resetSearchParams();
				this.loadStatus = false;
				this.keywords = this.currentGemstone;

				this.$refs.filterPopup.close();
			},

			// 商品触底
			onGoodsReachBottom() {
				if (!this.loadStatus) {
					this.currentPage += 1;
					this.getSearchResult();
				}
			},

			// 滚动条滚动事件
			onGoodsScroll(e) {
				let {
					scrollTop
				} = e.detail;
				this.scrollTop = scrollTop;
			},

			// 清空搜索框
			clearKeywords() {
				this.keywords = "";
				this.currentGemstone = "";
			},

			// 重置搜索参数
			_resetSearchParams() {
				this.currentPage = 1;
				this.sort = 0;
				this.loadStatus = false;
				this.searchList = [];
			},
		},
		watch: {
			keywords(value) {
				if (value) {
					this.timer && clearTimeout(this.timer);
					this.timer = setTimeout(() => {
						this.searchList = [];
						this.loadStatus = false;
						this.currentGemstone = value;
						this.getSearchResult();
					}, 500);
				} else {
					this.navbar = "综合";
					this.sort = 0;
					this.searchList = [];
					this.loadStatus = false;
					this.getSearchResult();
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 100vh;
		position: relative;

		.search-bar-box {
			width: 100%;
			padding-top: 20rpx;
			background-color: #fff;
			position: fixed;
			z-index: 9;

			.box-search {
				height: 72rpx;
				opacity: 1;
				display: flex;
				align-items: center;
			}

			.search-icon {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				left: 54rpx;
			}

			input {
				width: 690rpx;
				height: inherit;
				background: #f5f6f7;
				padding-left: 88rpx;
				margin-left: 30rpx;
				margin-right: 30rpx;
				box-sizing: border-box;
				font-size: 30rpx;
				color: #333;
				border-radius: 8rpx;
			}

			.del-icon {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				right: 62rpx;
				z-index: 9;
			}

			.search-placeholder {
				color: #f5f6f7;
				font-size: 28rpx;
			}

			.search-tip {
				width: 76rpx;
				display: inline-block;
				text-align: right;
				height: 72rpx;
				line-height: 72rpx;
				font-size: 28rpx;
				font-family: "PingFang SC-Medium";
				font-weight: 500;
				color: #171d26;
			}

			.navbar-list {
				width: 100%;
				padding: 48rpx 78rpx 20rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;

				.navbar-tip {
					font-size: 28rpx;
					font-family: "PingFang SC-Medium";
					font-weight: 500;
					color: #505459;
					line-height: 28rpx;
					display: inline-flex;
					align-items: center;
				}

				.navbar-active {
					color: #55b8b8;
					font-weight: bold;
				}

				.price-sort-icon {
					width: 16rpx;
					height: 25rpx;
					margin-left: 10rpx;
				}

				.filter-icon {
					width: 24rpx;
					height: 26rpx;
					margin-left: 10rpx;
				}
			}
		}

		.goods-scroll {
			position: fixed;
			// top: 390rpx;
			overflow-y: scroll;
			height: 100%;

			.goods-box {
				width: 100%;
				padding: 0 30rpx 40rpx;
				box-sizing: border-box;
				position: relative;
			}
		}

		.popup-content {
			width: 100%;
			padding-top: 60rpx;
			padding-bottom: 60rpx;
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
				margin: 32rpx auto;
			}
		}
	}
</style>
