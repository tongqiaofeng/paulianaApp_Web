<template>
	<view class="addr-add">
		<!-- <text>新增地址</text> -->
		<view class="addr-every">
			<text class="every-title">收货人：</text>
			<input class="city-sel" style="flex: 1" type="text" placeholder="请填写收货人姓名"
				placeholder-style="color: #c3c3c3" v-model="consignee" />
		</view>
		<view class="addr-every">
			<text class="every-title">手机号：</text>
			<input class="city-sel" style="flex: 1" type="text" placeholder="请输入收货人手机号"
				placeholder-style="color: #c3c3c3" v-model="phoneNumber" />
		</view>
		<view class="addr-every">
			<text class="every-title">所在国家：</text>
			<uni-data-picker style="flex: 1" class="city-sel" ref="countryPicker" placeholder="点击选择所在国家"
				popup-title="选择所在国家" @change="countryChange" :localdata="countryList" v-model="regionCountry">
			</uni-data-picker>
		</view>
		<view class="addr-every" v-if="regionCountry == '中国'">
			<text class="every-title">所在地区：</text>
			<picker mode="region" style="flex: 1" @change="regionChange">
				<text class="city-sel" style="flex: 1;" :style="{color: region == '点击选择所在地区' ? '#c3c3c3' : '#333'}">{{
          region
        }}</text>
			</picker>
		</view>
		<view class="addr-details">
			<text class="every-title">详细地址：</text>
			<input class="city-sel" style="flex: 1" type="text" placeholder="如道路、门牌号、小区、楼栋号、单元室等"
				placeholder-style="color: #c3c3c3" v-model="detailAddr" />
		</view>
		<view class="addr-details">
			<text class="every-title">邮政编码：</text>
			<input class="city-sel" style="flex: 1" type="text" placeholder="请输入" placeholder-style="color: #c3c3c3"
				v-model="zipCode" />
		</view>
		<view class="addr-every" style="margin-top: 20rpx; justify-content: space-between">
			<text class="every-title">设为默认地址</text>
			<switch style="transform: scale(0.6, 0.6)" color="#55B8B8" :checked="defaultAddr" @change="defaultChange" />
		</view>
		<view class="button-bottom">
			<view class="addr-button" style="background-color: red" @click="delAddr">删除收货地址</view>
			<view class="addr-button" @click="saveAddr">保存收货地址</view>
		</view>
	</view>
</template>

<script>
	import externalData from "../../static/js/data.js";

	export default {
		data() {
			return {
				updateId: null,
				consignee: "", // 收货人
				phoneNumber: "",
				regionCountry: "中国",
				region: "点击选择所在地区",
				detailAddr: "",
				defaultAddr: false,
				countryList: externalData.countryList,
				zipCode: ""
			};
		},
		onLoad(option) {
			if (option.addrData) {
				let data = JSON.parse(decodeURIComponent(option.addrData))
				this.updateId = data.id;
				this.consignee = data.name;
				this.phoneNumber = data.phone;
				if (data.isChina != 1) {
					this.regionCountry = data.area;
					this.region = "";
				} else {
					this.regionCountry = "中国";
					this.region = data.area;
				}
				this.detailAddr = data.street;
				this.defaultAddr = data.isDefaultAddress == 1 ? true : false;
				this.zipCode = data.zipCode;
			}
		},
		methods: {
			// 选择国家
			countryChange(val) {
				console.log("选择国家数据");
				console.log(val);
				console.log(this.regionCountry);
				if (this.regionCountry == "中国") this.region = "点击选择所在地区";
			},
			// 选择地区
			regionChange(val) {
				console.log("选择城市数据");
				console.log(val);
				this.region = val.detail.value.join("");
			},
			// 是否为默认地址
			defaultChange(val) {
				console.log(val);
				this.defaultAddr = val.detail.value;
				console.log(this.defaultAddr);
			},
			// 删除收货地址
			delAddr() {
				uni.request({
					url: this.$baseUrl + "/recvAddressDel?addressId=" + this.updateId,
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					complete: (res) => {
						console.log("删除地址");
						console.log(res);
						if (res.data.code === 200) {
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.data
							})
						}

					},
				});
			},
			// 保存收货地址
			saveAddr() {
				uni.request({
					url: this.$baseUrl + "/recvAddressSave",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("token"),
					},
					data: {
						id: this.updateId,
						name: this.consignee,
						phone: this.phoneNumber,
						area: this.regionCountry == "中国" ? this.region : this.regionCountry,
						street: this.detailAddr,
						isDefaultAddress: this.defaultAddr == false ? 0 : 1,
						isChina: this.regionCountry == "中国" ? 1 : 0,
						zipCode: this.zipCode
					},
					complete: (res) => {
						console.log("添加地址");
						console.log(res);

						if (res.data.code === 200) {
							// uni.navigateTo({
							// 	url: "addressAdmin",
							// })
							uni.navigateBack({
								delta: 1
							})
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.data
							})
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.addr-add {
		height: 100vh;
		background-color: #F2F3F5;

		.every-title {
			font-size: 28rpx;
		}

		.addr-every {
			height: 80rpx;
			margin-bottom: 2rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			background-color: #fff;

			.city-sel {
				font-size: 28rpx;
				color: #333;
			}
		}

		.addr-details {
			height: 120rpx;
			margin-bottom: 2rpx;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			background-color: #fff;

			.city-sel {
				font-size: 28rpx;
				color: #333;
			}
		}

		.button-bottom {
			position: absolute;
			bottom: 20rpx;
			left: 20rpx;
			right: 20rpx;
			display: flex;
			justify-content: space-around;

			.addr-button {
				padding: 20rpx 80rpx;
				font-size: 28rpx;
				background-color: #55B8B8;
				color: #fff;
				border-radius: 60rpx;
				text-align: center;
			}
		}
	}
</style>
<style lang="scss">
	.addr-every {
		.input-value-border {
			border: none !important;
		}

		.input-arrow {
			width: 0 !important;
			height: 0 !important;
			border-left: none !important;
			border-bottom: none !important;
		}

		.placeholder {
			color: #c3c3c3 !important;
		}
	}
</style>
