<template>
	<view class="">
		<view class="wechat-login-popup-container">
			<image class="login-logo" src="../static/imgs/mine/logo_green.png" mode="aspectFill"></image>
			<view class="login-title"> 宝莉安娜高级珠宝定制 </view>
			<view class="login-slogan">
				<!-- 立即登录，享受优质服务 -->
				<view class=""> 为提供优质服务，pauliana需要获取你的以下信息： </view>
				<view class=""> 你的公开信息(头像、昵称等) </view>
			</view>
			<button class="login-button" open-type="getUserInfo" @getuserinfo="getUserLoginMsg">
				授权获取信息
			</button>
			
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			  <image class="avatar" :src="headPic"></image>
			</button> 
			<input type="nickname" class="weui-input" placeholder="请输入昵称"/>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headPic: "",
				nick: "",
			}
		},
		methods: {
			onChooseAvatar(e) {
			   this.headPic = e.detail.avatarUrl;
			   console.log(e);
			  },
			// 获取临时登录凭证code
			getUserLoginMsg() {

				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log(loginRes.authResult);
				    // 获取用户信息
				    uni.getUserInfo({
				      provider: 'weixin',
				      success: function (infoRes) {
				        console.log('用户昵称为：' + infoRes.userInfo.nickName);
				      }
				    });
				  }
				});
		
				// uni.getUserProfile({
				// 	desc: "登录",
				// 	success: (res) => {
				// 		console.log("用户头像、昵称", res);
				// 		this.nick = res.userInfo.nickName;
				// 		this.headPic = res.userInfo.avatarUrl;

				// 		uni.navigateTo({
				// 			url: "./phoneLogin?headPic=" + this.headPic + '&nick=' + this.nick
				// 		})
				// 	},
				// 	fail: (err) => {
				// 		console.log(err);
				// 		uni.showToast({
				// 			icon: "none",
				// 			title: "获取用户信息失败",
				// 		});
				// 	},
				// });
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			height: 88rpx;
			line-height: 88rpx;
			background-color: #55b8b8;
			font-size: 28rpx;
			color: #fff;
		}
	}
</style>
