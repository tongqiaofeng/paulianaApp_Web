<template>
	<view class="container">
		<view class="designer-box">
			<image
				class="design-img"
				src="https://s1.ax1x.com/2023/02/22/pSviPXR.png"
				mode="widthFix"
			></image>
			<image
				class="design-img"
				src="https://s1.ax1x.com/2023/02/22/pSviN9g.png"
				mode="widthFix"
			></image>
			<image
				class="design-img"
				src="https://s1.ax1x.com/2023/02/22/pSviq8e.png"
				mode="widthFix"
			></image>
		</view>
	</view>
</template>

<script>
const app = getApp();
import * as Api from '@/api/api';
import { api_host } from '@/utils/request';
import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
export default {
  components: {
    EasyLoadimage
  },
	data() {
		return {
			localImgUrl: app.globalData.localImgUrl,
			apiHost: api_host,
			scrollTop: 0,
		};
	},
	onLoad() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.container {
	.designer-box {
		width: 100%;
		.design-img {
			width: 100%;
			margin-bottom: 80rpx;
		}
	}
}
</style>
