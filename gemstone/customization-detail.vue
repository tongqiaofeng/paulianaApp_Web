<template>
	<view class="container">
		<HeaderTop :headerHeight="headerHeight" :title="tag" />
		<view class="design-content" :style="{'paddingTop': headerHeight+10 + 'px'}">
			<view class="design-list">
				<view class="design-item" v-for="(item, index) in designList" :key="index"
					:style="{'backgroundColor': index % 2 == 0 ? '#FAF7F2' : '#F5F7F6'}">
					<h5 class="title">{{ item.name }}</h5>

					<view class="swiper-box">
						<swiper class="swiper-list" @current="item.current ? item.current : 0"
							@change="onSwiperChange($event, index)" display-multiple-items="1" circular
							previous-margin="130rpx" next-margin='130rpx'>
							<swiper-item class="swiper-item" :class="{'active': item.current == imgIndex}"
								v-for="(img, imgIndex) in item.picsList" :key="imgIndex"
								@click.stop="previewImage(item.picsList, imgIndex)">
								<image class="swiper-img" :src="img" mode="aspectFill"></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as Api from '@/api/api';
	import {
		api_host
	} from '@/utils/request';
	import HeaderTop from '@/components/header-top/header-top';
	import {
		log
	} from 'util';

	export default {
		data() {
			return {
				apiHost: api_host,
				menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
				tag: null,
				colors: ['#FAF7F2', '#F5F7F6'],
				designList: []
			}
		},
		components: {
			HeaderTop
		},
		onLoad(option) {
			if (option.tag) this.tag = option.tag;
			this.getCustomerDesignList();
		},
		methods: {
			async getCustomerDesignList() {
				const {
					data: res
				} = await Api.customerDesignList();
				if (res.code == 200) {
					console.log(res);

					let list = [];
					for (let item of res.data) {
						if (item.productSortName == this.tag) {
							list = item.designDrawList.map(item => {
								let img_list = item.pics ? item.pics.split('|') : [];
								// 2张图补一张
								if (img_list.length == 2) {
									img_list.push(img_list[0]);
								}

								return {
									current: 0,
									name: item.materialSortName,
									picsList: img_list.map(item =>
										this.apiHost + '/file/' + item
									)
								}
							});
						}
					}

					this.designList = list;
					console.log(this.designList);
				}
			},
			onSwiperChange(event, index) {
				let {
					current
				} = event.detail;
				this.designList[index]['current'] = current;
			},
			previewImage(imgs, imgIndex) {
				uni.previewImage({
					current: imgs[imgIndex],
					urls: imgs
				})
			}
		},
		computed: {
			headerHeight() {
				return this.menuBtnInfo.height + this.menuBtnInfo.top;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 100vh;

		.design-content {
			width: 100%;

			.design-list {
				width: 100%;
				height: 100%;

				.design-item {
					width: 100%;
					min-height: 840rpx;
					background-color: #FAF7F2;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-bottom: 40rpx;
					margin-top: 80rpx;

					&:first-child {
						margin-top: 0;
					}

					h5 {
						font-size: 40rpx;
						font-family: '宋体';
						font-weight: bold;
						color: #1F2033;
						line-height: 40rpx;
						letter-spacing: 1px;
						padding-top: 80rpx;
						text-align: center;
					}

					.desc {
						width: 390rpx;
						font-size: 28rpx;
						line-height: 45rpx;
						font-weight: 500;
						color: #1F2033;
						word-break: break-all;
						text-align: center;
						margin-top: 60rpx;
					}

					.swiper-box {
						width: 100%;
						height: 490rpx;
						margin-top: 100rpx;

						.swiper-list {
							width: 100%;
							height: 590rpx;

							.swiper-item {
								position: relative;
								box-sizing: border-box;
								width: 100%;
								height: 80%;

								&.active {
									opacity: 1;
									z-index: 10;
									height: 100%;
									transition: all .1s ease-in 0s;
									transform: translateY(0);

									.swiper-img {
										height: 100%;
										transform: scale(1, 1);
									}
								}

								.swiper-img {
									width: 100%;
									height: 590rpx;
									text-align: center;
									transform: scale(0.9, 0.9);
								}
							}
						}
					}

					.design-line {
						margin-top: 60rpx;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: center;

						.line {
							width: 260rpx;
							height: 1px;
							background: #EBE6DE;
						}

						.design-name {
							font-size: 24rpx;
							font-weight: 500;
							color: #505459;
							line-height: 28rpx;
							position: absolute;
							right: 30rpx;
						}
					}
				}
			}
		}
	}
</style>
