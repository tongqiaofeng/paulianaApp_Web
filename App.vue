<script>
	export default {
		globalData: {
			userInfo: {},
			// 本地图片路径
			localImgUrl: '/static/imgs'
		},
		onLaunch() {}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';

	.uni-data-tree-dialog {
		z-index: 999;
	}

	::-webkit-scrollbar {
		display: none;
	}

	.notice-bottom-font {
		width: 100%;
		font-size: 24rpx;
		padding-top: 60rpx;
		text-align: center;
		color: #505459;
		display: block;
	}

	.index-top {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding-left: 30rpx;
		background-color: #fff;
		text-align: left;
		font-size: 30rpx;
		color: #171D26;
		font-weight: bold;
		z-index: 9;
	}

	// 设置整个项目的背景色
	page {
		background-color: #fff;
		font-family: 'PingFang';
	}

	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}

	.bottom-left {
		uni-button[plain] {
			border: none;
		}

		uni-button {
			padding-left: 0;
			line-height: 1.3rem;
		}
	}

	.no-data {
		padding-top: 450rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		image {
			width: 222rpx;
			height: 152rpx;
		}

		text {
			margin-top: 40rpx;
			font-size: 26rpx;
			color: #c8c8c8;
		}
	}
</style>
