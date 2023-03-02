<template>
	<!-- 设计师详情 -->
	<view class="container">
		<view class="designer-box">
			<view class="head" v-if="imgList && imgList.length">
				<image
					v-for="(item, index) in imgList"
					:key="index"
					class="design-img"
					:src="apiHost + '/file/' + item"
					mode="widthFix"
				></image>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import { api_host } from '@/utils/request';
export default {
	components: {},
	data() {
		return {
			localImgUrl: app.globalData.localImgUrl,
			apiHost: api_host,
			scrollTop: 0,
			index: 0,
			imgList: [],
		};
	},
	onLoad(options) {
		this.index = options.index || 0;
		if (options.designerImg) {
			let imglist = JSON.parse(decodeURIComponent(options.designerImg));
			this.imgList = imglist;
		}
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.container {
	.designer-box {
		width: 100%;
		.head {
			width: 100%;
			box-sizing: border-box;
			padding-bottom: 60rpx;
			.design-img {
				width: 100%;
				margin-bottom: 60rpx;
				&:first-child {
					padding: 0 30rpx;
					box-sizing: border-box;
					margin-bottom: 120rpx;
				}
				&:last-child {
					margin-bottom: 0;
				}
			}
		}
	}
}
</style>
