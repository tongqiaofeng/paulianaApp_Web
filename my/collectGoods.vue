<template>
	<view class="commodity">
		<view v-if="haveData == 0" class="no-data">
			<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无收藏商品，赶紧去收藏好货吧~</text>
		</view>
		<view v-else>
			<view class="commodity-mian-container">
				<slide-list :list="favoriteslist" :threshold="threshold" @click="rowClick" @optionClick="optionClick"
					:options="options">
				</slide-list>
				<view class="bottom">没有更多了~</view>
			</view>
		</view>
	</view>
</template>

<script>
	import slideList from '@/components/left-slide/left-slide-list.vue';
	export default {
		components: {
			slideList
		},
		data() {
			return {
				isShow: false,

				haveData: 1,
				goodsnum: 0,
				page: 1,
				favoriteslist: [],

				isSelect: 0,
				allFlag: {
					value: "cb",
					checked: false,
				},
				selProductMsg: {},

				options: [ //左滑的操作列表
					{
						color: '#ffffff', //字体颜色，非必须，默认 #ffffff
						bgColor: '#FF4533', //背景颜色，非必须，默认 #409EFF
						text: '删除', //展示文字
						width: 120, //按钮宽度 默认120rpx 适合两个字的宽度 这个宽度按需调整
					}
				],
				threshold: 50,
			};
		},
		onLoad() {
			this.favorites();
		},
		onPullDownRefresh() {
			this.favoriteslist = [];
			this.favorites();
			uni.stopPullDownRefresh();
		},
		methods: {
			// 查看详情
			rowClick(item) {
				console.log('点击某一行');
				console.log(item);
				if (item) {
					if (item.type == 1) {
						uni.navigateTo({
							url: "../pauliana/jewelryDetails?id=" + item.id,
						});
					} else if (item.type == 2) {
						uni.navigateTo({
							url: "../pauliana/materialDetails?id=" + item.id,
						});
					}
				}
			},
			// 删除
			optionClick(item, oitem) {
				console.log('点击某个操作按钮');
				console.log(item, oitem)
				if (oitem.text == '删除') {
					this.selProductMsg = item;
					console.log(this.selProductMsg);
					this.clickclose();
				}
			},

			// 获取商品收藏列表
			favorites() {
				uni.showLoading({
					title: "加载中...",
				});
				uni.request({
					url: this.$baseUrl + "/favoriteList",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						uni.hideLoading();

						console.log("商品收藏列表");
						console.log(res.data);

						this.favoriteslist = res.data.data;
						this.goodsnum = this.favoriteslist.length;

						if (this.favoriteslist.length == 0) {
							this.haveData = 0;
						} else {
							this.haveData = 1;
						}

						this.isShow = true;
					},
				});
			},
			// 删除
			clickclose() {
				uni.request({
					url: this.$baseUrl + "/favoriteSave?productId=" + this.selProductMsg
						.id + "&type=" + this.selProductMsg.type,
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					success: (res) => {
						console.log(res.data);

						this.favoriteslist = [];
						uni.showToast({
							title: "删除成功",
							icon: "none",
						});
						this.favorites();
					},
					fail: (err) => {
						uni.showToast({
							title: err.data.message,
							icon: "none",
						});
					},
				});
			},
			navto(item) {
				if (this.isSelect == 0) {
					uni.navigateTo({
						url: "../pauliana/jewelryDetails?id=" + item.id,
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.commodity {
		padding-left: 20rpx;
		background-color: #fff;
		position: relative;

		.title {
			height: 100rpx;
			padding: 0 40rpx;
			position: fixed;
			left: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			background-color: #fff;
			z-index: 999;
		}

		.commoditybox {
			margin-bottom: 40rpx;
			display: flex;
			align-items: center;
			position: relative;
			box-shadow: -1px 5px 10px 2px #f6f6f7;
			border-radius: 30rpx;

			.box-check {
				margin-left: 10rpx;
			}

			.box-left {
				padding: 20rpx 0 20rpx 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				image {
					width: 180rpx;
					height: 174rpx;
					border-radius: 30rpx;
				}
			}

			.box-right {
				padding: 25rpx 20rpx 30rpx 20rpx;
				display: flex;
				flex: 1;
				flex-direction: column;
				justify-content: space-between;

				.name {
					margin-bottom: 20rpx;
					font-size: 24rpx;
				}

				.price {
					font-size: 26rpx;
					color: #50b2b2;
				}
			}

			.closeicon {
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				color: #ef5b5b;
				font-size: 28rpx;

				image {
					width: 124rpx;
					height: 103rpx;
				}
			}

			.delIcon {
				position: absolute;
				top: 20rpx;
				right: -20rpx;
				color: #ef5b5b;
				font-size: 28rpx;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.bottom {
			padding-bottom: 140rpx;
			font-size: 24rpx;
			color: #e3e3e3;
			text-align: center;
			font-size: 30rpx;
		}

		.allCheck {
			height: 100rpx;
			padding: 0 40rpx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #f9f9f9;
			font-size: 28rpx;
		}
	}
</style>
