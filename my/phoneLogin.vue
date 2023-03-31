<template>
	<view class="phone-login-container">
		<view class="wechat-login-popup-container">
			<image class="login-logo" src="../static/imgs/mine/logo_green.png" mode="aspectFill"></image>
			<!-- <view class="login-title"> 宝莉安娜高级珠宝定制 </view>
			<view class="login-slogan">
				<view class=""> 立即登录，享受优质服务 </view>
			</view> -->

			<button class="btn" open-type="chooseAvatar"
				@chooseavatar="onChooseAvatar">
				<image v-if="headPic" style="width: 200rpx;height: 200rpx;" :src="headPic" mode="aspectFit"></image>
				<view v-else style="font-size: 28rpx;color: #505459;">点击设置用户头像</view>
			</button>
			
			<input style="border-bottom: 1rpx solid #000000;margin-top: 60rpx;padding-bottom: 5rpx;" type="nickname" placeholder="请输入昵称" v-model="nick" />

			<view class="login-button">
				<button v-if="headPic && nick" plain open-type="getPhoneNumber" @getphonenumber="getUserPhoneNumber"> 手机号码一键登录 </button>
				<button v-else @click="checkInput()"> 手机号码一键登录 </button>
			</view>
			
			<checkbox value="r1" style="margin-top: 40rpx; transform:scale(0.7);" color="#55B8B8" @click="privacyChange"/>
				<text style="font-size: 26rpx;">登录代表你已同意</text><text style="color: #55B8B8;font-size: 26rpx;" @click="gotoPrivacy">《用户协议及隐私政策》</text>
			</checkbox>
		</view>
	</view>
</template>

<script>
	import {
		api_host
	} from '@/utils/request';
	export default {
		data() {
			return {
				headPic: '',
				nick: '',
				r1:false,
			};
		},
		onLoad(option) {
		},
		methods: {
			onChooseAvatar(e) {
				this.headPic = e.detail.avatarUrl;
				console.log(e);
			},
			checkInput(){
				
				if(this.r1 == false){
					uni.showToast({ icon: 'none', title: '请先阅读并同意相关协议', });
					return;
				}
				
				this.nick = this.nick.trim();
				
				if(this.headPic == ''){
					uni.showToast({ icon: 'none', title: '请先设置头像', });
					return;
				}
				
				if(this.nick == ''){
					uni.showToast({ icon: 'none', title: '请先设置昵称', });
					return;
				}
			},
			privacyChange(){
				this.r1 = !this.r1;
				console.log(this.r1)
			},
			gotoPrivacy(){
				uni.navigateTo({
					url:'privacy'
				})
			},
			// 手机号一键登录
			async getUserPhoneNumber(e) {
				
				this.nick = this.nick.trim();

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

			.btn {
				margin-top: 40rpx;
				width: 200rpx;
				height: 200rpx;
				text-align: center;
				background-color: transparent;
				display: flex;
				align-items: center;
			}

			
		}
	}
</style>
