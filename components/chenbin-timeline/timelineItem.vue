<template>
	<view class="timelineItem">
		<view class="timeItem">
			<view class="line" :style="{'background-color': index == length ? '#fff' : '#ccc'}">
				<view class="out" :style="{background: color == '' ? '' : color}">
					<view class="inner" :style="{background: color == '' ? '' : color}"></view>
				</view>
			</view>
			<view class="rightContent">
				<slot></slot>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			color: {
				type: String,
				default: ''
			},
			index: {
				type: Number,
				default: 0
			},
			length: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		},
		created() {
			console.log(this.index, this.length);
		},
	}
</script>

<style scoped lang="less">
	.timelineItem {
		.timeItem {
			display: flex;

			.line {
				width: 1px;
				background: rgba(204, 204, 204, 1);
				position: relative;

				.out {
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: center;
					align-items: center;
					width: 28rpx;
					height: 28rpx;
					background: rgba(236, 104, 23, 0.6);
					border-radius: 50%;

					.inner {
						width: 18rpx;
						height: 18rpx;
						background: rgba(236, 104, 23, 1);
						border-radius: 50%;
					}
				}
			}

			.rightContent {
				flex: 1;
				padding: 0 10rpx 20rpx;
				margin-left: 20rpx;
				min-height: 50rpx;
			}
		}
	}
</style>
