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
		<view class="contend">
			<pick-goods v-if="judgePage(0)" @updateWorld="updateWorld"  ref="pickGoods"></pick-goods>
			<warehousing v-if="judgePage(1)" @changePage="changePage" ref="warehousing"></warehousing>
			<abnormal v-if="judgePage(2)" ref="abnormal"></abnormal>
			<send-goods @updateWorld="updateWorld2" v-if="judgePage(3)" ref="sendGoods"></send-goods>
		</view>
		<view :animation="animationData" v-if="btnShow">
			<foot-btn @clear="clear">
				<template  slot="btn1" v-if="judgePage(3) && sendText === '保存'">
					<view class="btn_right btn1" @tap="save(true)">
						<text class="btn_mid">取消发货</text>
					</view>
				</template>
				<template  slot="btn1" v-if="judgePage(2)">
					<view class="btn_right btn1" @tap="next">
						<text class="btn_mid">下一个</text>
					</view>
				</template>
				<template slot="btn2">
					<view class="btn_right" @tap="save">
						<text v-if="judgePage(0)">{{world}}</text>
						<text v-if="judgePage(1)">入库</text>
						<text v-if="judgePage(2)">保存</text>
						<text v-if="judgePage(3)">{{sendText}}</text>
					</view>
				</template>
			</foot-btn>
		</view>
	</view>
	
</template>

<script>
	import dayjs from '@/common/util/dayjs.min.js'
	import pickGoods from './pickGoods.vue'
	import warehousing from './warehousing.vue'
	import abnormal from './abnormal.vue'
	import sendGoods from './sendGoods.vue'
	import footBtn from '@/components/footBtn.vue'
	export default {
		components: {pickGoods, warehousing, abnormal, sendGoods, footBtn},
		data() {
			return {
				world: '',
				currentRef: 'abnormal',
				currentIndex: 1,
				tabList: [
					{label: '确认提货'},
					{label: '货物入库'},
					{label: '异常处理'},
					{label: '确认发货'}
				],
				btnShow: false,
				animationData: {},
				sendText: '确认发货'
			}
		},
		watch: {
		},
		onReady () {
			
		},
		onShow() {
			// if (getApp().globalData.chooseItem.locationCode) {
			// 	this.form.kwId = getApp().globalData.chooseItem.id
			// 	this.form.locationCode = getApp().globalData.chooseItem.locationCode//显示编码
			// }
			// if (this.currentRef === 'warehousing') {
			// 	this.$refs[this.currentRef].setData(getApp().globalData.chooseItem)
			// }
			// console.log(11, getApp().globalData.chooseItem)
		},
		methods: {
			changePage (val) {
				this.currentIndex = val
			},
			updateWorld (val) {
				console.log(val)
				if (val=== '预约') {
					this.world = '提货'
				} else {
					this.world = '取消提货'
				}
			},
			updateWorld2 (val) {
				console.log(val)
				if (val=== '5') {
					this.sendText = '保存'
				} else {
					this.sendText = '确认发货'
				}
			},
			cancle () {
				this.$refs[this.currentRef].cancle()
			},
			next () {
				this.$refs[this.currentRef].next()
			},
			save (val) {
				if (val) {
					this.$refs[this.currentRef].save()
				} else if (this.sendText === '保存') {
					this.$refs[this.currentRef].cancle()
				} else {
					this.$refs[this.currentRef].save()
				}
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
				let refArr = ['pickGoods', 'warehousing', 'abnormal', 'sendGoods']
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
			}
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
	.contend {
		margin-top: 250rpx;
		margin-bottom: 120rpx;
	}
	.btn_mid{
		
	}
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
				font-size: 35rpx;
				color: #ffffff;
				line-height: 33rpx;
				height: 80rpx;
				&.currentClass {
					font-size: 42rpx;
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
