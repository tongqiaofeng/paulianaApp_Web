<template>
	<view class="phone-login-container">
		<view class="wechat-login-popup-container">
			<image
				class="login-logo"
				src="../static/imgs/mine/logo_green.png"
				mode="aspectFill"
			></image>
			<view class="login-title"> 宝莉安娜高级珠宝定制 </view>
			<view class="login-slogan">
				<view class=""> 立即登录，享受优质服务 </view>
			</view>

			<view class="login-button">
				<button
					plain
					open-type="getPhoneNumber"
					@getphonenumber="getUserPhoneNumber"
				>
					手机号码一键登录
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import { api_host } from '@/utils/request';
export default {
	data() {
		return {
			headPic: '',
			nick: '',
		};
	},
	onLoad(option) {
		this.headPic = option.headPic;
		this.nick = option.nick;
	},
	methods: {
		// 手机号一键登录
		async getUserPhoneNumber(e) {
			console.log('手机号', e);
			uni.login({
				complete: (ret) => {
					console.log('code值');
					console.log(ret);

					const data = {
						iv: e.detail.iv,
						encryptedData: e.detail.encryptedData,
						code: e.detail.code,
						nick: this.nick,
						headPic: this.headPic,
						jsCode: ret.code,
					};

					//后端处理后返回解密的用户信息
					uni.request({
						url: this.$baseUrl + '/login',
						method: 'POST',
						header: {
							'content-type': 'application/json',
						},
						data: data,
						complete: (res) => {
							console.log('微信登录成功', res);

							if (res.data.code === 200) {
								let token = res.data.data.token;
								uni.setStorageSync('token', token);

								uni.reLaunch({
									url: '/pages/mine',
								});
							} else {
								uni.showToast({
									icon: 'none',
									title: res.data.status,
								});
							}
						},
					});
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.phone-login-container {
	.wechat-login-popup-container {
		padding: 140rpx 30rpx 100rpx;
		text-align: center;

		.login-logo {
			width: 403rpx;
			height: 121rpx;
		}

		.login-title {
			margin-top: 124rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #171d26;
		}

		.login-slogan {
			margin-top: 40rpx;
			font-size: 28rpx;
			color: #505459;
		}

		.login-button {
			margin-top: 90rpx;

			button {
				height: 88rpx;
				line-height: 88rpx;
				background-color: #55b8b8;
				font-size: 28rpx;
				color: #fff;
				border-radius: 0;
				border: none;
			}
		}
	}
}
</style>
