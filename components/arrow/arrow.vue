<template>
	<view class="arrow-left">
		<view class="left" @click="back">
			<image src="/static/back.png"  class="arrow_left" mode="aspectFit"></image>
		</view>
		<text @click="back">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: () => ''
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			back () {
				console.log(1)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.arrow-left {
	height: 96upx;
	padding: 20upx 0 0 30upx;
	.left {
		display: inline-block;
		height:100rpx;
		width:80rpx;
	}
	.arrow_left {
		width: 30upx;
		height: 38upx;
		position: relative;
		top: 45rpx;
	}
	text {
		font-size: 38upx;
		color: #ffffff;
		font-weight: bold;
		display: inline-block;
		transform: translateY(-5upx);
		position:relative;
		top:45rpx;
		left:-30rpx;

	}
}
</style>
