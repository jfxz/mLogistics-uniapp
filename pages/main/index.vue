<template>
	<view class="main-content">
		主界面
	</view>
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import { mapGetters } from 'vuex';
	// import { getFlightStatus } from '../../common/api/dic/api.js'
	// import { ident } from "@/common/identification.js"
	export default {
		components:{
		},
		data() {
			return {
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onShow () {
		},
		onLoad (){
			this.plusReady()
		},
		methods: {
			plusReady() {
			  this.$store.dispatch('GetUserInfo')
				console.log('userInfo', this.userInfo)
			},
			// 退出登录
			loginOut () {
				uni.showToast({
					title: '退出登录',
					duration: 1000,
					icon:'none'
				})
				uni.removeStorageSync('access_token')
				uni.reLaunch({
					url: '../login/login',
				})
			}
		}
	}
</script>

<style lang="scss">
	.main-content {
		
	}
</style>
