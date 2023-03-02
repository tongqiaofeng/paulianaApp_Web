<template>
	<view class="integral-container">
		<!-- 积分明细 -->
		<view class="nav">
			<view class="tab-scroll_box">
				<!-- 选项卡类别列表 -->
				<view class="tab-scroll_item" v-for="item in category" :key="item.id" @click="chenkedChange(item.id)">
					<view
						:style="{'font-weight': isActive == item.id ? 'bold' : 'normal','margin-bottom': '30rpx',color: isActive == index ? '#171D26' : '#505459',}">
						<text>{{item.name}}</text>
					</view>

					<view class="tab-name-line" v-show="isActive == item.id"></view>
				</view>
			</view>
		</view>
		<view v-if="memberDetails.length == 0" class="no-data" style="padding-top: 300rpx">
			<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">暂无积分明细~</text>
		</view>
		<view v-else>
			<view class="container-title" v-show="isActive == 0">
				<view>{{ totalIntegral }}</view>
			</view>
			<view class="container-main">
				<view class="container-every" v-for="(item, index) in memberDetails" :key="index">
					<view class="every-main">
						<view class="every-top">
							<view class="every-time">{{ item.time }}</view>
							<view class="every-time every-integral">{{
                item.recordPoint
              }}</view>
						</view>
						<view class="every-note">{{ item.description }}</view>
					</view>
					<view class="line"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haveMore: 0,
				haveData: 1,
				page: 1,
				memberDetails: [],
				totalIntegral: 0,

				isActive: 0,
				category: [{
						id: 0,
						name: '全部',
					},
					{
						id: 1,
						name: '已获取',
					},
					{
						id: 2,
						name: '已消耗',
					},
				],
			};
		},
		onShow() {
			this.getMemberDetails();
		},
		onPullDownRefresh() {
			this.page = 1;
			this.memberDetails = [];
			this.haveMore = 0;

			this.getMemberDetails();
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore == 0) {
				this.page++;
				this.getMemberDetails();
			}
		},
		methods: {
			// 当前点击子元素靠左留一个选项展示，子元素宽度不相同也可实现
			chenkedChange(index) {
				this.isActive = index;

				this.page = 1;
				this.memberDetails = [];
				this.haveMore = 0;
				this.getMemberDetails()
			},
			// 获取积分明细
			getMemberDetails() {
				uni.showLoading({
					title: "加载中...",
				});
				uni.request({
					url: this.$baseUrl +
						"/memberDetails?page=" +
						this.page +
						"&pageNum=10&status=" + this.isActive,
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("积分明细");
						console.log(res);
						uni.hideLoading();
						this.totalIntegral = res.data.data.totalIntegral;
						if (res.data.data.length == 0) {
							this.haveMore = 1;
						} else {
							let list = this.memberDetails.concat(res.data.data.list);
							this.memberDetails = list;
						}

						if (this.memberDetails.length == 0) {
							this.haveData = 0;
							uni.showToast({
								icon: "none",
								title: "暂无数据",
							});
						} else {
							this.haveData = 1;
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.integral-container {
		min-height: 100vh;
		padding: 0 20rpx 40rpx;
		background-color: #f9f9f9;

		.container-title {
			padding-top: 20rpx;
			padding-left: 20rpx;
			font-size: 48rpx;
			color: #85dbd0;
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
					width: 33vw;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 30rpx;

					.tab-name-line {
						width: 33vw;
						height: 4rpx;
						background-color: #55B8B8;
					}
				}
			}
		}

		.container-main {
			margin-top: 20rpx;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.container-every {
				background-color: #fff;

				.every-main {
					flex: 1;

					.every-top {
						margin-bottom: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.every-time {
							margin-right: 20rpx;
							font-size: 28rpx;
						}
					}

					.every-note {
						font-size: 22rpx;
						color: #aaa;
					}
				}
			}

			.line {
				width: 100%;
				height: 2rpx;
				margin: 30rpx 0;
				background-color: #f9f9f9;
			}
		}
	}
</style>
