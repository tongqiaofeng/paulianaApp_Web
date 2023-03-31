<template>
	<view class="details-container">
		<!-- 设计图详情 -->
		<view>
			<uni-swiper-dot
				:info="imgSrc"
				:current="current"
				mode="dot"
				:dotsStyles="dotsStyles"
			>
				<swiper
					class="swiper-box"
					style="height: 1000rpx"
					@change="swiperChange"
				>
					<swiper-item v-for="(item, index) in detailObj.img" :key="index">
						<view class="swiper-item">
							<EasyLoadimage
								:image-src="apiHost + '/file/' + item"
								:scroll-top="scrollTop"
								width="750rpx"
								height="1000rpx"
								mode="aspectFill"
							></EasyLoadimage>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>

		<view class="product-info">
			<view class="name">{{ detailObj.name }}</view>
			<view class="designer">设计师: {{ detailObj.designerName || 'PAULIANA' }}</view>

			<view class="label-wrap">
				<text
					class="label-tip"
					v-if="detailObj.label && detailObj.label.length"
					v-for="label in detailObj.label"
					:key="label"
					@click="goDesignerSearch(label)"
					>{{ label }}</text
				>
			</view>
			<view v-if="detailObj.designConcept" class="desc">设计理念: {{ detailObj.designConcept }}</view>
		</view>
	</view>
</template>

<script>
import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
import * as Api from '@/api/api';
import { api_host } from '@/utils/request';
export default {
	components: { EasyLoadimage },
	data() {
		return {
			id: null,
			apiHost: api_host,
			detailObj: {},
			scrollTop: 0,
			current: 0,
			dotsStyles: {
				width: 6,
				height: 6,
				backgroundColor: '#fff',
				border: '#fff',
				selectedBackgroundColor: '#b0edd5',
				selectedBorder: '#b0edd5',
			},
		};
	},
	onLoad(options) {
		this.id = options.id;
		if (this.id) {
			this.getDetail();
		}
	},
	methods: {
		async getDetail() {
			const { data: res } = await Api.designInfoGet(this.id);
			if (res.code == 200) {
				if (res.data.label) {
					res.data.label = res.data.label.split('|');
				}
				if (res.data.img) {
					res.data.img = res.data.img.split('|');
				}
				this.detailObj = res.data;
				setTimeout(() => {
					this.scrollTop++;
				}, 500);
			}
		},
		goDesignerSearch(value) {
			if (value) {
				uni.navigateTo({
					url: '/designer/search?tag=' + value,
				});
			}
		},
		// 指示点
		swiperChange(e) {
			this.current = e.detail.current;
		},
	},
};
</script>

<style lang="scss" scoped>
.details-container {
	width: 100%;
	background-color: #f7f8fa;

	.uni-swiper__dots-nav {
		justify-content: flex-end;
	}

	// 参数
	.product-info {
		width: 100%;
		padding: 40rpx 30rpx;
		background-color: #fff;
		box-sizing: border-box;
		.name {
			font-size: 34rpx;
			font-weight: 800;
			color: #171d26;
		}
		.designer {
			color: #505459;
			font-size: 30rpx;
			margin-top: 30rpx;
		}
		.label-wrap {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;
			.label-tip {
				color: #171d26;
				font-size: 26rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				background: #f5f6f7;
				padding: 8rpx 30rpx;
				border-radius: 18rpx;
				border: none;
			}
		}
		.desc {
			font-size: 28rpx;
			color: #888d94;
			font-weight: 500;
			margin-top: 20rpx;
			word-break: break-all;
		}
	}

	// 详情
	.product-detail {
		padding: 30rpx 40rpx;
		text-align: left;

		.title {
			padding: 26rpx 40rpx;
			color: #888d94;
			font-size: 24rpx;
			text-align: center;
		}

		.product-content {
			width: 100%;
			.design-img {
				margin-bottom: 60rpx;
			}
		}
	}
}
</style>
