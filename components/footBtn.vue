<template>
	<view class="bottom-btn">
		<view class="btn_left" @tap="clear">
			<!-- #ifdef MP -->
			<image src="../static/clear.png" mode="aspectFit"></image>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<image src="../static/clear.png" mode="aspectFit"></image>
			<!-- #endif -->
			<text>清空</text>
		</view>
		<view class="right-btn">
			<slot name="btn1">
			</slot>
			<view class="block-class">
			</view>
			<slot name="btn2">
			</slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		},
		data() {
			return {
			}
		},
		methods: {
			clear () {
				this.$emit('clear')
			}
		}
	}
</script>

<style lang="scss">
</style>
