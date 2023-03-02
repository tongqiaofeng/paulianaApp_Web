<template>
	<view class="commodity" v-if="isShow">
		<view v-if="haveData == 0" class="no-data" style="padding: 180rpx 0 100rpx">
			<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 30rpx">购物车空空如也，快去逛逛吧~</text>
		</view>
		<view v-else>
			<view class="commodity-title" id="cartTitle">
				<view
					:style="{
						height: menuBtnInfo.height + 'px',
						'padding-top': menuBtnInfo.top + 'px',
					}"
				></view>
				<view class="cart-title">
					<text class="title">购物车</text>
					<text style="font-size: 26rpx" @click="isCheckBox">{{
						isSelect == 0 ? '编辑' : '取消编辑'
					}}</text>
				</view>
			</view>
			<checkbox-group
				@change="checkChange"
				:style="{ 'padding-top': topHeight + 'px' }"
			>
				<view
					class="commoditybox"
					v-for="(item, index) in favoriteslist"
					:key="index"
				>
					<label class="box-check">
						<checkbox
							:value="item.id"
							:checked="item.checked"
							color="#85dbd0"
							style="transform: scale(0.7)"
						/>
					</label>
					<view class="box-left" @click="checkDetails(item)">
						<EasyLoadimage
							v-if="item.img"
							:image-src="imgUrl + item.img.trim()"
							:scroll-top="scrollTop"
							width="196rpx"
							height="196rpx"
							mode="aspectFill"
						>
						</EasyLoadimage>
					</view>

					<view class="box-right" @click="checkDetails(item)">
						<view class="name ellipsis-2">{{ item.productName }}</view>
						<view
							class="tag-price"
							v-if="item.isDiscount == 1 || item.isVipProduct == 1"
						>
							{{ '￥' + formatNumberRgx(item.tagPrice) }}
						</view>
						<view class="price">
							<view class="price-left ellipsis">
								{{ '￥' + formatNumberRgx(item.discountPrice) }}
							</view>
							<view class="price-num">
								<view
									class="num-button num-minus"
									@click.stop="numChangeValue(0, index, item)"
								>
									<view
										class="minus"
										:style="{
											'background-color': item.num > 1 ? '#000' : '#AAADB2',
										}"
									></view>
								</view>
								<text class="num-input">{{ item.num }}</text>
								<view
									class="num-button num-add"
									@click.stop="numChangeValue(1, index, item)"
								>
									<image
										src="../static/imgs/order/add.png"
										mode="aspectFill"
										style="width: 16rpx; height: 16rpx"
									></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</checkbox-group>

			<!-- 全选按钮 -->
			<view class="allCheck">
				<view class="all-check-left">
					<checkbox-group @change="changeBook">
						<label>
							<view>
								<checkbox
									color="#85dbd0"
									style="transform: scale(0.7)"
									:checked="allFlag.checked"
									:value="allFlag.value"
								/>
								<text style="color: #999999">全选</text>
							</view>
						</label>
					</checkbox-group>
				</view>
				<view class="all-check-right">
					<view class="left-price">
						<text>总计：</text>
						<text style="color: #50b2b2; font-weight: bold">￥</text>
						<text style="color: #50b2b2; font-weight: bold">{{
							formatNumberRgx(totalPrice)
						}}</text>
					</view>
					<view
						class="cart-button-pay"
						v-if="isSelect == 0"
						@click="closeAccount"
					>
						<text>立即结算</text>
						<text>{{ ' (' + selList.length + ')' }}</text>
					</view>
					<view class="cart-button-del" v-else @click="clickclose">
						<text>删除</text>
						<text>{{ ' (' + selList.length + ')' }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="cart-recommend-product">
			<view class="recommend-title">
				<view class="line"></view>
				<view class="font-and-img">
					<image
						class="img"
						src="../static/imgs/order/love.png"
						mode="aspectFill"
					></image>
					<text class="font">你可能还喜欢</text>
				</view>
				<view class="line"></view>
			</view>
			<view class="recommend-product-list">
				<GoodsList
					:marginTop="0"
					:scrollTop="scrollTop"
					:goodsList="jewelryList"
				/>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
import * as Api from '@/api/api';

import EasyLoadimage from '@/components/easy-loadimage/easy-loadimage';
import GoodsList from '@/components/goods-list/goods-list';

export default {
	components: {
		EasyLoadimage,
		GoodsList,
	},
	data() {
		return {
			menuBtnInfo: uni.getMenuButtonBoundingClientRect(),
			topHeight: null,
			scrollTop: 0,
			imgUrl: this.$baseUrl,
			isShow: false,
			haveData: 1,
			page: 1,
			favoriteslist: [],
			jewelryList: [],

			isSelect: 0,
			allFlag: {
				value: 'cb',
				checked: true,
			},
			selList: [],
			checkedList: [],
			delList: [],

			totalPrice: 0,
		};
	},
	onShow() {
		if (uni.getStorageSync('token').length == 0) {
			uni.showToast({
				title: '登录即可查看该功能',
				icon: 'none',
				// success: () => {
				// 	setTimeout(() => {
				// 		uni.switchTab({
				// 			url: "./mine",
				// 		});
				// 	}, 1000)
				// },
			});
		} else {
			this.getCartList();
			this.getJewelryList();
		}
	},

	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	filters: {
		picsfilter(str) {
			if (str.indexOf('|') !== -1) {
				return str.substring(0, str.indexOf('|'));
			} else {
				return str;
			}
		},
	},
	onPullDownRefresh() {
		this.favoriteslist = [];
		this.getCartList();
		uni.stopPullDownRefresh();
	},
	methods: {
		// 计算总金额
		getTotal() {
			this.totalPrice = 0;
			for (let item of this.selList) {
				console.log(item);
				this.totalPrice += Number(item.discountPrice * item.num);
			}

			console.log(this.totalPrice);
		},
		// 购买数量变化
		numChangeValue(sel, index, item) {
			console.log(sel, index, item);

			if (sel == 0 && this.favoriteslist[index].num > 1) {
				console.log('减减减');
				this.favoriteslist[index].num -= 1;

				for (let selMsg of this.selList) {
					if (selMsg.id == item.id) {
						selMsg.num = this.favoriteslist[index].num;
					}
				}
				console.log(this.selList);

				this.getTotal();
				this.updateNum(this.favoriteslist[index]);
			}

			if (sel == 1) {
				console.log('加加加');
				this.favoriteslist[index].num += 1;

				for (let selMsg of this.selList) {
					if (selMsg.id == item.id) {
						selMsg.num = this.favoriteslist[index].num;
					}
				}
				console.log(this.selList);

				this.getTotal();
				this.updateNum(this.favoriteslist[index]);
			}
		},

		// 提交购买数量
		updateNum(item) {
			console.log(item);

			uni.request({
				url: this.$baseUrl + '/shoppingCartAdd',
				method: 'POST',
				header: {
					'content-type': 'application/json',
					token: uni.getStorageSync('token'),
				},
				data: {
					productId: item.id,
					num: item.num,
					type: item.type,
				},
				complete: (res) => {
					console.log('添加购物车');
					console.log(res);

					if (res.data.code == 200) {
						this.getCartList();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.status,
						});
					}
				},
			});
		},
		// 结算
		closeAccount() {
			console.log(this.selList);

			if (this.selList.length > 0) {
				uni.navigateTo({
					url:
						'../order/confirmAnOrder?productList=' +
						JSON.stringify(this.selList) +
						'&type=0',
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '你还没有选择宝贝哦！',
				});
			}
		},
		// 是否选中
		checkChange(e) {
			console.log('是否选中');
			console.log(e);

			let values = e.detail.value;
			this.delList = values;
			this.selList = [];
			for (let i = 0; i < this.favoriteslist.length; ++i) {
				const item = this.favoriteslist[i];
				console.log(item);
				let value = {
					productId: item.id,
					imgSrc: item.img,
					name: encodeURIComponent(item.productName),
					num: item.num,
					currency: 'CNY',
					productAmount: item.discountPrice,
					tagPrice: item.tagPrice,
					discountPrice: item.discountPrice,
					isDiscount: item.isDiscount,
					type: item.type,
				};
				if (values.includes(item.id)) {
					this.selList.push(value);
					this.$set(item, 'checked', true);
				} else {
					this.$set(item, 'checked', false);
				}
			}
			//  商品是否全部勾选，判断全选与否状态
			let allChecks = values.length == this.favoriteslist.length;
			allChecks
				? this.$set(this.allFlag, 'checked', true)
				: this.$set(this.allFlag, 'checked', false);

			console.log(this.selList);

			this.getTotal();
		},
		// 全选或者反选 checkbox
		changeBook(e) {
			console.log('全选否');
			console.log(e);
			this.selList = [];
			this.delList = [];
			if (e.detail.value.length == 0) {
				this.favoriteslist.map((item) => this.$set(item, 'checked', false));
				this.$set(this.allFlag, 'checked', false);
			} else {
				this.favoriteslist.map((item) => {
					this.$set(item, 'checked', true);
					this.delList.push(item.id);
					this.selList.push({
						productId: item.id,
						imgSrc: item.img,
						name: encodeURIComponent(item.productName),
						num: item.num,
						currency: 'CNY',
						productAmount: item.discountPrice,
						tagPrice: item.tagPrice,
						discountPrice: item.discountPrice,
						isDiscount: item.isDiscount,
						type: item.type,
					});
				});
				this.$set(this.allFlag, 'checked', true);
			}
			console.log(this.selList);

			this.getTotal();
		},
		// 删除/结算
		isCheckBox() {
			if (this.isSelect == 0) {
				this.isSelect = 1;
			} else if (this.isSelect == 1) {
				this.isSelect = 0;
			}
		},
		// 删除
		clickclose() {
			if (this.selList.length > 0) {
				uni.request({
					url: this.$baseUrl + '/shoppingCartDel',
					method: 'POST',
					data: {
						idList: this.delList,
					},
					header: {
						'content-type': 'application/json',
						token: uni.getStorageSync('token'),
					},
					success: (res) => {
						console.log(res.data);
						uni.showToast({
							title: '删除成功',
							icon: 'none',
						});
						this.getCartList();
					},
					fail: (err) => {
						uni.showToast({
							title: err.data.message,
							icon: 'none',
						});
					},
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: '你还没有选择宝贝哦！',
				});
			}
		},
		// 查看详情
		checkDetails(item) {
			console.log(item);

			if (this.isSelect == 0) {
				if (item.type == 1) {
					uni.navigateTo({
						url: '../pauliana/jewelryDetails?id=' + item.id,
					});
				} else if (item.type == 2) {
					uni.navigateTo({
						url: '../pauliana/materialDetails?id=' + item.id,
					});
				}
			}
		},
		// 获取购物车列表
		getCartList() {
			// this.favoriteslist = [];
			this.selList = [];
			this.delList = [];
			uni.request({
				url: this.$baseUrl + '/shoppingCartList',
				header: {
					'content-type': 'application/json',
					token: uni.getStorageSync('token'),
				},
				complete: (res) => {
					console.log('购物车列表');
					console.log(res);

					this.favoriteslist = res.data.data;

					for (let item of this.favoriteslist) {
						item.checked = true;

						this.selList.push({
							productId: item.id,
							imgSrc: item.img,
							name: encodeURIComponent(item.productName),
							num: item.num,
							currency: 'CNY',
							productAmount: item.discountPrice,
							tagPrice: item.tagPrice,
							discountPrice: item.discountPrice,
							isDiscount: item.isDiscount,
							type: item.type,
						});
						this.delList.push(item.id);
					}
					this.allFlag.checked = true;

					if (this.favoriteslist.length == 0) {
						this.haveData = 0;
					} else {
						this.haveData = 1;
					}

					this.getTotal();

					this.isShow = true;

					if (this.haveData == 1) {
						this.$nextTick(() => {
							const query = uni.createSelectorQuery().in(this);
							query
								.select('#cartTitle')
								.boundingClientRect((data) => {
									console.log(data);
									this.topHeight = data.height;
								})
								.exec();
						});
					}

					setTimeout(() => {
						this.scrollTop++;
					}, 500);
				},
			});
		},
		// 推荐产品
		async getJewelryList() {
			const { data: res } = await Api.recommendProductList();
			this.jewelryList = res.data;
			setTimeout(() => {
				this.scrollTop++;
			}, 500);
		},
	},
};
</script>

<style lang="scss" scoped>
.commodity {
	min-height: 100vh;
	padding-bottom: 100rpx;
	background-color: #fff;

	.commodity-title {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: #fff;

		.cart-title {
			height: 88rpx;
			padding: 0 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			color: #505459;

			.title {
				font-size: 30rpx;
				color: #171d26;
				font-weight: bold;
			}
		}
	}

	.commoditybox {
		width: 100%;
		padding: 0 30rpx;
		margin-bottom: 60rpx;
		display: flex;
		align-items: center;
		position: relative;
		box-sizing: border-box;

		.box-check {
			width: 36rpx;
			height: 36rpx;
		}

		.box-left {
			margin-left: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 196rpx;
				height: 196rpx;
			}
		}

		.box-right {
			// height: 180rpx;
			padding: 8rpx 0 8rpx 20rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;

			.name {
				margin-bottom: 16rpx;
				font-size: 28rpx;
				color: #1f2033;
			}

			.tag-price {
				font-size: 24rpx;
				color: #aaadb2;
				text-decoration: line-through;
			}

			.price {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;

				.price-left {
					width: 230rpx;
					font-size: 32rpx;
					color: #50b2b2;
					font-weight: bold;
				}

				.price-num {
					width: 180rpx;
					display: flex;
					align-items: center;

					.num-button {
						width: 56rpx;
						height: 56rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 40rpx;
						cursor: pointer;
						color: #171d26;
						border: 2rpx solid #888d94;
					}

					.num-minus {
						font-size: 38rpx;
						// font-weight: bold;
						border-top-left-radius: 8rpx;
						border-bottom-left-radius: 8rpx;

						.minus {
							width: 16rpx;
							height: 2rpx;
						}
					}

					.num-add {
						border-top-right-radius: 8rpx;
						border-bottom-right-radius: 8rpx;
					}

					.num-input {
						width: 70rpx;
						height: 56rpx;
						line-height: 56rpx;
						text-align: center;
						font-size: 28rpx;
						color: #000;
						border-top: 2rpx solid #888d94;
						border-bottom: 2rpx solid #888d94;
					}
				}
			}
		}
	}

	.bottom {
		padding-bottom: 140rpx;
		font-size: 24rpx;
		color: #e3e3e3;
		text-align: center;
		font-size: 30rpx;
	}

	.allCheck {
		height: 96rpx;
		padding-left: 30rpx;
		position: fixed;
		left: 0;
		right: 0;
		// bottom: 0;
		bottom: var(--window-bottom);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		font-size: 28rpx;
		z-index: 99;

		.all-check-left {
		}

		.all-check-right {
			display: flex;
			align-items: center;

			.left-price {
				margin-right: 16rpx;
				color: #171d16;
			}

			.cart-button-pay,
			.cart-button-del {
				width: 280rpx;
				height: 96rpx;
				line-height: 96rpx;
				color: #fff;
				font-size: 28rpx;
				text-align: center;
			}

			.cart-button-pay {
				background-color: #55b8b8;
			}

			.cart-button-del {
				background-color: red;
			}
		}
	}

	.cart-recommend-product {
		.recommend-title {
			display: flex;
			justify-content: center;
			align-items: center;

			.line {
				width: 40rpx;
				height: 2rpx;
				background-color: #55b8b8;
			}

			.font-and-img {
				margin: 0 20rpx;
				display: flex;
				align-items: center;

				.img {
					width: 40rpx;
					height: 40rpx;
				}

				.font {
					margin-left: 12rpx;
					font-size: 30rpx;
					color: #55b8b8;
				}
			}
		}

		.recommend-product-list {
			padding: 20rpx;
			// display: grid;
			// justify-content: space-between;
			// grid-template-columns: repeat(auto-fill, 344rpx);
			// grid-gap: 20rpx;

			.item {
				padding: 20rpx;
				margin-bottom: 20rpx;

				.img {
					width: 304rpx;
					height: 304rpx;
					border-radius: 30rpx;
				}

				.title {
					width: 304rpx;
					margin: 30rpx 0;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #1f2033;
				}

				.price {
					margin-top: 22rpx;
					font-size: 28rpx;
					color: #55b8b8;
				}
			}
		}
	}
}
</style>
