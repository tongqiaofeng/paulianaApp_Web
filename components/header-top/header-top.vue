<template>
	<view class="header-top-wrapper" :style="{'height': headerHeight + 'px', 
    'position': isFixed ? 'fixed' : 'relative','background-color': color}">
		<view class="header-top" :style="{'height': menuBtnInfo.height + 'px', 'padding-top': menuBtnInfo.top + 'px'}">
			<view class="header-radius-btn">
				<image class="radius-bg" src="/static/imgs/customization/top_radius_btn.png"></image>
				<image class="back-icon" @click="goBack" src="/static/imgs/customization/back_icon1.png"></image>
				<image class="home-icon" @click="goHome" src="/static/imgs/customization/home_icon.png"></image>
			</view>
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'header-top',
		props: {
			// 高度
			headerHeight: {
				type: Number
			},
			title: {
				type: String,
				default: ''
			},
			// 是否固定顶部
			isFixed: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: '#fff'
			},
      //  是否默认跳转上一页,false返回点击事件
      isDefaultBack: {
        type: Boolean,
        default: true
      }
		},
		data() {
			return {
				menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
			}
		},
		methods: {
			goBack() {
        if (this.isDefaultBack) {
          // 默认跳转上一页
          uni.navigateBack({
            delta: 1
          });
        } else {
          this.$emit('back');
        }
			},
			goHome() {
				uni.switchTab({
					url: '/pages/index'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header-top-wrapper {
		width: 100%;
		top: 0;
		left: 0;
		padding-bottom: 10px;
		z-index: 9;

		.header-top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;

			.header-radius-btn {
				position: absolute;
				width: 174rpx;
				height: 64rpx;
				left: 30rpx;

				.radius-bg {
					width: 100%;
					height: 100%;
				}

				.back-icon {
					width: 24rpx;
					height: 48rpx;
					position: absolute;
					left: 34rpx;
					top: 50%;
					transform: translateY(-50%);
				}

				.home-icon {
					width: 48rpx;
					height: 48rpx;
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.title {
				font-size: 30rpx;
				line-height: 34rpx;
				color: #171D26;
				font-weight: normal;
			}
		}
	}
</style>
