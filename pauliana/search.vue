<template>
	<view class="container" v-if="haveData">
		<HeaderTop
			:headerHeight="headerHeight"
			:title="'产品搜索'"
			:isDefaultBack="false"
			@back="goBack"
		/>
		<view class="search-bar-box" :style="{ top: headerHeight + 10 + 'px' }">
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
				placeholder="产品/品牌"
				@confirm="confirmSearch"
			/>
			<image
				class="del-icon"
				@click="clearKeywords"
				v-if="localImgUrl && keywords"
				:src="localImgUrl + '/common/search_del.png'"
			></image>
		</view>
		<view class="search-recommend-box" v-if="searchStatus == ''">
			<scroll-view
				@scroll="onGoodsScroll"
				scroll-y
				class="search-scroll"
				:style="{
					top: searchScrollStyle.top + 'rpx',
					height: searchScrollStyle.height,
				}"
			>
				<view class="search-history">
					<view class="search-header flex-center-between">
						<h5 class="font-tit">搜索历史</h5>
						<image
							class="del-icon"
							v-if="localImgUrl && searchHistory.length"
							:src="localImgUrl + '/common/del_icon.png'"
							@click="clearSearchHistory"
						></image>
					</view>
					<view
						class="search-keywords"
						v-if="searchHistory && searchHistory.length"
					>
						<text
							class="keyword"
							v-for="item in searchHistory"
							:key="item"
							@click="onSearchClick(item)"
							>{{ item }}</text
						>
					</view>
				</view>
				<!-- recommend -->
				<view class="recommend-box">
					<view class="search-header flex-center-between">
						<h5 class="font-tit">推荐商品</h5>
					</view>
					<view class="goods-box">
						<GoodsList :goodsList="recList" :scrollTop="scrollTop" />
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 搜索结果 -->
		<view class="search-goods-box" v-else>
			<view class="navbar-list" :style="{ top: navbarStyle.top + 'rpx' }">
				<view
					class="navbar-tip"
					:class="{ 'navbar-active': navbar == '综合' }"
					@click="changeNavbar('综合')"
				>
					<text class="navbar-tit">综合</text>
				</view>
				<view
					class="navbar-tip"
					:class="{ 'navbar-active': navbar == '销量' }"
					@click="numSort('销量')"
				>
					<text class="navbar-tit">销量</text>
				</view>
				<view
					class="navbar-tip"
					:class="{ 'navbar-active': navbar == '价格' }"
					@click="priceSort('价格')"
				>
					<text class="navbar-tit">价格</text>
					<image
						class="price-sort-icon"
						v-if="localImgUrl && sort == 0"
						:src="localImgUrl + '/common/sort.png'"
					></image>
					<image
						class="price-sort-icon"
						v-if="localImgUrl && sort == 1"
						:src="localImgUrl + '/common/sort_up.png'"
					></image>
					<image
						class="price-sort-icon"
						v-if="localImgUrl && sort == -1"
						:src="localImgUrl + '/common/sort_down.png'"
					></image>
				</view>
				<view
					class="navbar-tip"
					:class="{ 'navbar-active': navbar == '筛选' }"
					@click="filterSort"
				>
					<text class="navbar-tit">筛选</text>
					<image
						class="filter-icon"
						v-if="localImgUrl"
						:src="
							navbar == '筛选'
								? localImgUrl + '/common/filter_green.png'
								: localImgUrl + '/common/filter_icon.png'
						"
					>
					</image>
				</view>
			</view>
			<scroll-view
				scroll-y
				class="goods-scroll"
				@scrolltolower="onGoodsReachBottom"
				@scroll="onGoodsScroll"
				:style="{
					top: navbarStyle.goodsTop + 'rpx',
					height: navbarStyle.height,
				}"
			>
				<view class="goods-box" v-if="searchList.length">
					<GoodsList
						:goodsList="searchList"
						:marginTop="0"
						:scrollTop="scrollTop"
					/>
					<text class="notice-bottom-font" v-if="loadStatus"
						>已经到底了哦~</text
					>
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
				<view class="popup-title"> 产品标签筛选 </view>
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

export default {
	name: 'searchPage',
	components: {
		HeaderTop,
		GoodsList,
	},
	data() {
		return {
			haveData: false,
			localImgUrl: app.globalData.localImgUrl,
			scrollTop: 0,
			keywords: '',
			searchHistory: [],

			recList: [], // 推荐产品
			currentPage: 1,
			pageNum: 10,
			brandSeries: '', //品牌系列
			coBrandedSeries: '', // 联名系列
			tag: '', // 标签；项链，耳饰，戒指，手链
			sort: 0, // 排序规则 1正序 -1倒序 0默认
			navbar: '综合',
			searchList: [],
			loadStatus: false, // 加载数据状态
			searchStatus: '', // 搜索状态 keyword brandSeries coBrandedSeries coBrandedSeries
			focusStatus: true,
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),

			filterPopupShow: false, // 筛选弹窗
			searchLabelList: [], // 标签数据列表
			selectLabelList: [], // 选择的标签
		};
	},
	onLoad(options) {
		if (!Object.keys(options).length) {
			// 无参数
			let searchHistory = [];
			if (storage.get('search_history')) {
				searchHistory = storage.get('search_history');
			}
			this.searchHistory = searchHistory;
			this.getRecommendProductList();
		} else {
			// 有参数
			if (options.brandSeries) {
				this.brandSeries = options.brandSeries;
				this.searchStatus = 'brandSeries';
				this.focusStatus = false;
				this.keywords = options.brandSeries;
			}
			if (options.coBrandedSeries) {
				this.coBrandedSeries = options.coBrandedSeries;
				this.searchStatus = 'coBrandedSeries';
				this.focusStatus = false;
				this.keywords = options.coBrandedSeries;
			}
			if (options.tag) {
				this.tag = options.tag;
				this.searchStatus = 'tag';
				this.focusStatus = false;
				this.keywords = options.tag;
			}
			this.getSearchResult();
		}

		this.productLabelListGet();
	},
	methods: {
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
			this.confirmSearch();
		},

		// 搜索数据
		async getSearchResult() {
			const params = {
				keyword: this.keywords,
				brandSeries: this.brandSeries,
				coBrandedSeries: this.coBrandedSeries,
				page: this.currentPage,
				pageNum: this.pageNum,
				sort: this.sort,
				tag: this.tag,
				productLabelList: this.selectLabelList,
			};
			const { data: res } = await Api.jewellerySearch(params);

			this.haveData = true;

			if (res.code == 200) {
				let data = res.data;
				if (data.list.length < this.pageNum) {
					this.loadStatus = true;
				}

				setTimeout(() => {
					this.scrollTop++;
				}, 500);
				if (this.currentPage == 1) this.searchList = data.list;
				else this.searchList = [...this.searchList, ...data.list];
			}
		},

		// 产品标签数据
		async productLabelListGet() {
			const { data: res } = await Api.productLabelListGet();
			this.searchLabelList = res.data;
		},
		clearSearchHistory() {
			storage.remove('search_history');
			this.searchHistory = [];
		},
		numSort(status) {
			this.navbar = status;
			this.currentPage = 1;
			this.sort = 0;
			this.loadStatus = false;
			this.searchList = [];

			this.getSearchResult();
		},
		priceSort(status) {
			this.navbar = status;
			if (this.navbar == '价格') {
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
		changeNavbar(status) {
			this.navbar = status;
			this._resetSearchParams();
			this.getSearchResult();
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
			// this.getRecommendProductList();
		},
		// 返回事件
		goBack() {
			if (!this.keywords) {
				uni.navigateBack({
					delta: 1,
				});
			} else {
				this.keywords = '';
			}
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

		// 确定筛选
		confirmFilter() {
			this.$refs.filterPopup.close();
			this._resetSearchParams();
			this.getSearchResult();
		},
		// 点击完成
		confirmSearch() {
			if (this.keywords) {
				this.searchStatus = 'keyword';
				this.timer && clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.navbar = '综合';
					this.sort = 0;
					this.searchList = [];
					this.loadStatus = false;
					this._saveSearchHistory(this.keywords);
					this.getSearchResult();
				}, 200);
			}
		},
		// 存储搜索历史
		_saveSearchHistory(keyword) {
			let data = [];
			if (storage.get('search_history')) {
				data = storage.get('search_history');
			}
			if (data.indexOf(keyword) == -1) {
				data.unshift(keyword);
			}
			this.searchHistory = data;
			storage.set('search_history', data);
		},
		_resetSearchParams() {
			this.currentPage = 1;
			this.sort = 0;
			this.loadStatus = false;
			this.searchList = [];
		},
	},
	computed: {
		headerHeight() {
			return this.menuBtnInfo.height + this.menuBtnInfo.top;
		},
		searchScrollStyle() {
			let headerHeight = this.menuBtnInfo.height + this.menuBtnInfo.top;
			let top = (headerHeight + 10) * 2 + 112;
			return {
				top: top,
				height: `calc(100vh - ${top}rpx)`,
			};
		},
		navbarStyle() {
			let headerHeight = this.menuBtnInfo.height + this.menuBtnInfo.top;
			let top = (headerHeight + 10) * 2 + 102;
			let goodsTop = top + 124;
			return {
				top: top,
				goodsTop: goodsTop,
				height: `calc(100vh - ${goodsTop}rpx)`,
			};
		},
	},
	watch: {
		keywords(value) {
			if (!value) {
				this.searchStatus = '';
				let searchHistory = [];
				if (storage.get('search_history')) {
					searchHistory = storage.get('search_history');
				}
				this.searchHistory = searchHistory;
				this.getRecommendProductList();
				this._resetSearchParams();
			}
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
		height: 72rpx;
		opacity: 1;
		padding: 20rpx 0;
		background-color: #fff;
		position: relative;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		left: 30rpx;
		right: 30rpx;
		z-index: 99;

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
			z-index: 99;
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

		.navbar-list {
			width: 100%;
			padding: 48rpx 78rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			top: 280rpx;
			box-sizing: border-box;
			z-index: 99;
			background-color: #fff;

			.navbar-tip {
				font-size: 28rpx;
				font-family: 'PingFang SC-Medium';
				font-weight: 500;
				color: #505459;
				line-height: 28rpx;
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

		.goods-scroll {
			height: calc(100vh - 236rpx);
			position: fixed;
			top: 236rpx;
		}

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
		padding-bottom: 32rpx;
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
			margin: 32rpx auto 0;
			border-radius: 44rpx;
		}
	}
}
</style>
