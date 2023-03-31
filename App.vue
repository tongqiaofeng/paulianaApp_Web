<script>
	export default {
		globalData: {
			userInfo: {},
			// 本地图片路径
			localImgUrl: '/static/imgs'
		},
		onLaunch() {
			// #ifdef MP-WEIXIN
			// 获取小程序更新机制兼容 
			if (uni.canIUse('getUpdateManager')) {
				console.log('可更新')
				const updateManager = uni.getUpdateManager()
				// 检查是否有新版本发布
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						console.log('有新版本')
						//小程序有新版本，则静默下载新版本，做好更新准备
						updateManager.onUpdateReady(function() {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								cancelText: "稍后进行",
								confirmText: "立即更新",
								confirmColor: "#85dbd0",
								success: (res) => {
									if (res.confirm) {
										//新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
			
						// 新的版本下载失败
						updateManager.onUpdateFailed(function() {
							uni.showModal({
								title: '温馨提示',
								content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
							})
						})
					}
				})
			} else {
				console.log('不可更新')
				// 提示用户在最新版本的客户端上体验
				uni.showModal({
					title: '温馨提示',
					content: '当前微信版本过低，可能无法使用该功能，请升级到最新版本后重试~'
				})
			}
			//#endif 
		}
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
	.row{
		display: flex;
	}
	
	.vCenter{
		align-items: center;
	}
	
</style>
