<template>
	<view class="layout">
		<view class="toolBar">
			<view class="tab-class">
				<view :class="['tab-label', {'currentClass' : currentIndex === index}]" @tap="tabClick(index)" v-for="(item, index) in tabList" :key="index">
					{{item.label}}
				</view>
			</view>
		</view>
		<view class="top">
			<view class="title">
				<view class="left_date">
					<text>{{getMonth()}}</text>
					<view class="date">
						<view class="top_date">
							<text>{{getYear()}}</text>
						</view>
						<view class="bottom_date">
							<text>{{getDate()}}</text>
						</view>
					</view>
				</view>
				<view class="right_loginOut">
					<image @tap="loginOut()" src="../../static/out.png" style="width: 34rpx;height: 34rpx;" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view>
			<exit-warehousing v-if="judgePage(0)"  ref="exitWarehousing"></exit-warehousing>
			<exit-goods v-if="judgePage(1)" @updateWorld="updateWorld2" ref="exitGoods"></exit-goods>
			<handover v-if="judgePage(2)" @updateWorld="updateWorld" ref="handover"></handover>
		</view>
		<view :animation="animationData" v-if="btnShow">
			<foot-btn @clear="clear">
				<template slot="btn2">
					<view class="btn_right" @tap="save">
						<text v-if="judgePage(0)">入库</text>
						<text v-if="judgePage(1)">{{btnText}}</text>
						<text v-if="judgePage(2)">{{world}}</text>
					</view>
				</template>
			</foot-btn>
		</view>
	</view>
	
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import exitGoods from './exitGoods.vue'
	import footBtn from '@/components/footBtn.vue'
	import exitWarehousing from './exitWarehousing'
	import handover from './handover'
	export default {
		components: {exitGoods, footBtn, exitWarehousing, handover},
		data() {
			return {
				world: '',
				btnText: '',
				currentRef: 'exitGoods',
				currentIndex: 1,
				tabList: [
					{label: '货物入库'},
					{label: '货物出库'},
					{label: '货物交接'}
				],
				btnShow: false,
				animationData: {}
			}
		},
		watch: {
		},
		onReady () {
			
		},
		methods: {
			changePage (val) {
				this.currentIndex = val
			},
			updateWorld (val) {
				if (val) {
					this.world = '确认交接'
				} else {
					this.world = '取消交接'
				}
			},
			updateWorld2 (val) {
				if (val === '3') {
					this.btnText = '取消出库'
				} else {
					this.btnText = '确认出库'
				}
			},
			save () {
				this.$refs[this.currentRef].save()
			},
			clear () {
				console.log('clear')
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				})
				this.$refs[this.currentRef].clear()
			},
			// 判断显示的页面
			judgePage (index) {
				let refArr = ['exitWarehousing', 'exitGoods', 'handover']
				refArr.forEach((item, index) => {
					if (this.currentIndex === index) {
						this.currentRef = item
					}
				})
				return this.currentIndex === index
			},
			tabClick (index) {
				this.currentIndex = index
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
			},
			getYear () {
				return dayjs().format('YYYY年')
			},
			getDate () {
				return dayjs().format('MM月DD日')
			},
			getMonth () {
				return dayjs().format('MMM')
			},
		},
		onPageScroll (top) {
			let vm = this
			vm.animationData = {}
			let animation = uni.createAnimation({
				duration: 100,
				timingFunction: 'ease-in-out',
			})
			if (top.scrollTop < 10) {
				// animation.translateY(20).step()
				vm.animationData = animation.export()
				setTimeout(function() {
					vm.btnShow = false
				}, 100)
			} else {
				setTimeout(() => {
					vm.btnShow = true
				}, 100)
				
			}
		}
		/* onReachBottom () {
			console.log(222)
		} */
	}
</script>

<style lang="scss">
	@keyframes menuShow
	{
		from {opacity:0;}
		to {left:1;}
	}
	
	@-webkit-keyframes menuShow
	{
		from {opacity:0;}
		to {left:1;}
	}
	@keyframes opcifyAni
	{
		from {opacity:0;}
		to {opacity:1;}
	}
	// .contend {
	// 	margin-top: 250rpx;
	// 	margin-bottom: 120rpx;
	// }
	.search-class {
		position: absolute;
		top: 320rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		height: 475rpx;
		width: calc(100% - 50rpx);
		margin: 0 25rpx;
		padding: 60rpx 60rpx;
		.search {
			button {
				margin-top:35rpx;
				background-image: linear-gradient(-90deg, 
						#41c989 0%, 
						#3ace6e 100%), 
					linear-gradient(
						#3ace6e, 
						#3ace6e);
					background-blend-mode: normal, 
						normal;
			}
		}
		.input-class {
			height: 120rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			input {
				border-bottom: solid 2rpx #e1e5e4;
				font-size: 38rpx;
				line-height: 33rpx;
				letter-spacing: 2rpx;
				color: #262626;
				height:100rpx;
			}
			.pick-text {
				width: 100%;
				border-bottom: solid 2rpx #e1e5e4;
				font-size: 38rpx;
				letter-spacing: 2rpx;
				color: #262626;
				height:100rpx;
				.pick-input{
					font-size: 38rpx;
					letter-spacing: 2rpx;
					color: #262626;
					height:100rpx;
					line-height: 80rpx;
					padding: 15upx 25upx;
					background:#FFF;
					flex: 1;
				}
			}
			.input1 {
				 &::before {
						content: " ";
						position: absolute;
						z-index: 9;
						margin-left: -20rpx;
						height: 15rpx;
						width: 15rpx;
						margin-top: 30rpx;
						border-radius: 50%;
						background: #41c989;
					}
			}
			.input2 {
				&::before {
					content: " ";
					position: absolute;
					z-index: 9;
					margin-left: -20rpx;
					height: 15rpx;
					width: 15rpx;
					margin-top: 30rpx;
					border-radius: 50%;
					background: #ef6161;
				}
			}
		}
	}
	.toolBar {
		.tab-class {
			position: absolute;
			top: 250rpx;
			padding: 0 25rpx;
			display: flex;
			justify-content: space-around;
			width: 100%;
			.tab-label {
				font-size: 31rpx;
				color: #ffffff;
				line-height: 33rpx;
				&.currentClass {
					font-size: 38rpx;
					font-weight: bold;
					&.tab-label::after {
							content: "";
							position: relative;
							bottom: -20rpx;
							left: -50%;
							animation:opcifyAni 1s ease;
							animation-duration: 0.5s;
							border-width: 10px;
							border-style: solid;
							border-color: transparent transparent #ffffff transparent;
					}
				}
			}
		}
	}
	page {
		// background: linear-gradient(#41c989, white);
		padding: 0;
	}
	@keyframes move
	{
	  from {left: 100%; top: 100upx}
	  to {left: 0;top: 0}
	}
	@-webkit-keyframes move {
	  from {left: 100%; top: 100upx}
	  to {left: 0;top: 0}
	}
	@keyframes btnMove
	{
	  from {bottom: -20px}
	  to {bottom: 0}
	}
	@-webkit-keyframes btnMove {
	  from {bottom: -20px}
	  to {bottom: 0}
	}
	
	.top {
		view {
			line-height: 1 !important;
		}
		height: 583rpx;
		// background: #1AAD19;
		background-image: linear-gradient(-90deg, 
				#3ace6e 0%, 
				#41c989 100%), 
			linear-gradient(
				#3ace6e, 
				#3ace6e);
			background-blend-mode: normal, normal;
		padding: 0 25rpx;
		padding-top: calc(var(--status-bar-height) + 70px);
		.title {
			display: flex;
			justify-content: space-between;
			height: 56rpx;
			// line-height: calc(var(--status-bar-height) + 70px);
			// margin-top: calc(var(--status-bar-height) + 70px);
			color: #ffffff;
			font-weight: bold;
			font-size: 38rpx;
			position:relative;
			bottom:60rpx;
			padding: 0 30rpx;
			.right_loginOut {
				position: relative;
				top: 20rpx;
			}
			.left_date {
				text {
					font-size: 75rpx;
				}
				.date {
					display: inline-block;
					margin-left: 20rpx;
					.top_date {
						text {
							font-size: 25rpx;
						}
					}
					.bottom_date {
						text {
							font-size: 25rpx;
						}
					}
				}
			}
			
		}
	}
</style>
