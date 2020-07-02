<template>
	<view class="layout-invent">
		<search ref="search" @mainChange="mainChange" @hawChange="hawbChange" @getData="getData('manual')"></search>
		<view class="top" style="background-image: url(../../static/header.png);background-repeat:no-repeat; background-size:100% 100%;">
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
		<view class="contend" :animation="animationData" v-if="dataFlag">
			<!-- <view class="wb-class">
				<view class="title">
					<view class="right">
						运单信息
					</view>
				</view>
				<view class="wbMsg">
					<view class="grid margin-bottom text-center col-3">
						<view class="padding">
							<view class="value">{{form.special_code || ''}}</view>
							<view class="label">处理代码</view>
						</view>
						<view class="padding">
							<view class="value" style="color: #007aff;">{{form.declare_status ? formatDeclare(form.declare_status) : ''}}</view>
							<view class="label">报关状态</view>
						</view>
						<view class="padding">
							<view class="value">{{form.num_total !== null ? form.num_total : ''}}</view>
							<view class="label">总件数</view>
						</view>
					</view>
					
					<view class="grid margin-bottom text-center col-3">
						<view class="padding">
							<view class="value">{{form.wgt_total !== null ? form.wgt_total : ''}}</view>
							<view class="label">总重量</view>
						</view>
						<view class="padding">
							<view class="value">{{form.num_tally !== null ? form.num_tally : ''}}</view>
							<view class="label">入库件数</view>
						</view>
						<view class="padding">
							<view class="value">{{form.wgt_tally !== null ? form.wgt_tally : ''}}</view>
							<view class="label">入库重量</view>
						</view>
					</view>
				</view>
			</view> -->
				
				<view class="contend2">						
					<view class="list-item" :style="{background: judgeBackGround(item)}" 
					v-for="(item, index) in list" :key="index" >
					<view class="item-top">
						<view class="left">
							<view>{{item.WAREHOUSE_CODE ? item.WAREHOUSE_CODE : ''}}</view>
							<view style="margin-left: 25rpx;">{{item.LOCATION_ID ? item.LOCATION_ID : ''}}</view>
						</view>
						<view class="center">
							<view>{{item.CARGO_NAME ? (item.CARGO_NAME.length > 6 ? item.CARGO_NAME.substring(0,6) + '...' : item.CARGO_NAME) : ''}}</view>
						</view>
						<view :class="['right', {'menuShow': menuShow && Index === item.index}]" @tap.stop="option(item.index)">
							<image src="/static/more.png" mode="aspectFit"></image>
						</view>
					</view>
					<view class="menu" v-if="menuShow && Index === item.index">
					 <view class="menu-item" @tap="storeMove(index)">
						 <image src="../../static/menu-move.png" mode="aspectFit"></image>
						移库
					 </view>
					 <view class="menu-item" @tap="storeEdit(index)">
						 <image src="../../static/menu-edit.png" mode="aspectFit"></image>
						库存修改
					 </view>
					 <view class="menu-item" @click="remove(item.index)">
						 <image src="../../static/menu-del.png" mode="aspectFit"></image>
						删除
					 </view>
					</view>
					<view class="bottom">
						<view class="left">
							<view class="num">
								<view class="value">
									{{item.NUM}}
								</view>
								<view class="label">
									库位数
								</view>
							</view>
							<view class="num" style="margin-left: 30rpx;">
								<view :style="{color: item.checkPcs !== item.NUM ? '#ff2c55' : '#262626'}" :class="['value', {'move': moveFlag && Index === index}]">
									{{item.checkPcs}}
								</view>
								<view class="label">
									盘点数
								</view>
							</view>
						</view>
						<view class="right">
								<button type="primary" @tap="comment(index)" hover-class="agreement" plain="true">一致</button>
								<button type="primary" @tap="edit(index)" hover-class="unAgreement" style="margin-left: 30rpx;" plain="true">不一致</button>
						</view>
					</view>
				</view>
				<!-- <view class="enterStore">
					<text>入库件数不正确？</text>
					<text class="ru" @tap="jumpEnter">入库</text>
				</view> -->
			</view>
		</view>
		<view :animation="animationData2" v-if="btnShow">
			<foot-btn @clear="clear">
				<!-- <template slot="btn1">
					<view class="btn_right btn1">
						取消发货
					</view>
				</template> -->
				<template slot="btn2">
					<view class="btn_right" @tap="save">
						入库
					</view>
				</template>
			</foot-btn>
		</view>
		<tui-modal :show="modal" @cancel="hide" :custom="true" :fadein="true">
			<view class="tui-modal-custom">
				<view class="title">修改盘点数</view>
				<input placeholder="请输入盘点件数" cursor-spacing="100" type="number" v-model="inventoryNum" />
				<view class="flex-btn">
					<button type="primary" class="btn cancel" plain="true" @tap="hide">取消</button>
					<button type="primary" class="btn" plain="true" @tap="submit">确定</button>
				</view>
			</view>
		</tui-modal>
		<tui-modal :show="delModal" @cancel="hide" :custom="true" :fadein="true">
			<view class="tui-modal-custom del">
				<image src="../../static/trash.png" mode="aspectFit"></image>
				<view class="delTitle">删除本条信息？</view>
				<view class="delMsg">
					运单将更新库位信息和运单信息
				</view>
				<view class="flex-btn">
					<button type="primary" class="btn cancel" plain="true" @tap="hide">取消</button>
					<button type="primary" class="btn" plain="true" @tap="delSubmit">确定</button>
				</view>
			</view>
		</tui-modal>
		<!-- <view class="bottom" :animation="animationData" v-if="btnShow">
			<view class="btn_left">
				<image src="../../static/clear.png" mode="aspectFit"></image>
				<text>清空</text>
			</view>
			<view class="btn_right">
				保存
			</view>
		</view> -->
	</view>
	
</template>

<script>
	import {getStore, delData, moveSame, moveNoSame} from '@/common/api/inventory/inventory.js'
	import search from '@/components/search.vue'
	import tuiModal from "@/components/modal"
	import dayjs from '@/common/util/dayjs.min.js'
	import footBtn from '@/components/footBtn.vue'
	import {cartoon} from '@/common/util/util.js'
	import {validatenull} from '@/common/util/validate.js'
	// import { mapGetters } from 'vuex'
	export default {
		components: {footBtn, tuiModal, search},
		data() {
			return {
				moveFlag: false,
				delModal: false,
				modal: false,
				inventoryNum: '',
				form: {
					special_code: '',
					declare_status: '',
					num_total: '',
					wgt_total: '',
					num_tally: '',
					wgt_tally: ''
				},
				currenIndex: null,
				Index: null,
				menuShow: false,
				btnShow: false,
				dataFlag: false,
				animationData: {},
				animationData2: {},
				animationitem: {},
				animationitemElse: {},
				list: [],
				filters: {
					mainBill: '',
					hawbBill: ''
				},
				showMainClearIcon: false,
				showHawbClearIcon: false,
				currentRef: 'abnormal'
			}
		},
		watch: {
		},
		computed: {
			// ...mapGetters(['dic'])
		},
		onShow () {
			// console.log(this.$store.state.dic.)
			this.getData()
		},
		onLoad(val) {
			let parmas = {}
			if (validatenull(val)) {
				parmas = getApp().globalData.toIventMsg
			} else {
				parmas = val
			}
			// uni.navigateTo({
			//     url: 'moveStore'
			// })
			if ('mainBill' in parmas) {
				this.filters = {...parmas}
				this.$nextTick(function(){
					setTimeout(() => {
						this.$refs.search.addMain(this.filters.mainBill)
						this.$refs.search.addHaw(this.filters.hawBill,this.filters.mainBill)
						this.getData()
					},100)
				})
			}
		},
		methods: {
			judgeBackGround (item) {
				if (item.locationAttribute) {
					return item.locationAttribute.indexOf(this.form.special_code) > -1 ? '' : '#fff07c'
				}
				// item.locationAttribute !== null ? (item.locationAttribute.indexOf(form.special_code) > -1 ? '' : '#fff07c') : ''
			},
			formatDeclare (status) {
				let match = this.$store.state.dic.DECLARE_STATUS.find(item => item.value === status)
				if (match) {
					return match.label
				}
			},
			jumpEnter () {
				this.$loading('正在跳转到进口入库')
				setTimeout(() => {
					uni.navigateTo({
					   url: `../enter/warehousing?mainBill=${this.filters.mainBill}&hawbBill=${this.filters.hawbBill}`
					})
					uni.hideLoading()
				}, 200)
			},
			getData (flag) {
				this.list = []
				Object.keys(this.form).forEach(key => {
					this.form[key] = ''
				})
				// 测试数据 FD01 TES40735726
				let para = {
					wbNo: this.filters.hawbBill,
					wbprefix: this.filters.mainBill
				}
				if (!this.filters.hawbBill && this.filters.mainBill) {
					para = {
						wbNo: this.filters.mainBill.substring(3, this.filters.mainBill.length),
						wbprefix: this.filters.mainBill.substring(0, 3)
					}
				}
				if (flag === 'manual') {
					if (!this.filters.mainBill) {
						this.$message('请输入运单号')
						return
					}
				}
				if (this.filters.mainBill) {
					this.$loading('加载中')
					getStore(para).then(res => {
						if (res.status && res.data.wbInfo) {
							this.dataFlag = true
							cartoon(this)
							this.form = Object.assign({}, res.data.wbInfo)
							if (res.data.storageInfo) {
								this.list = res.data.storageInfo
								this.list.forEach((item, index) => {
									this.$set(item, 'index', index)
								})
								console.log('list', this.list)
							}
						} else {
							flag === 'manual' && this.$message(res.message)
						}
						uni.hideLoading()
					})
				}
			},
			submit () {
				console.log(this.Index, this.inventoryNum)
				let para = {
					storageId: this.list[this.Index].ID,
					checkPcs: Number(this.inventoryNum)
				}
				this.$loading()
				moveNoSame(para).then(res => {
					if (res.status) {
						this.list[this.Index].checkPcs = Number(this.inventoryNum)
						this.moveFlag = true
						setTimeout(() => {
							this.moveFlag = false
							this.getData()
						}, 500)
					}
					uni.hideLoading()
					this.modal = false
					this.$message(res.message)
				})
			},
			hide () {
				this.inventoryNum = ''
				this.modal = false
				this.menuShow = false
				this.delModal = false
				this.Index = -1
			},
			comment (index) {
				this.Index = index
				let para = {
					storageId: this.list[index].ID
				}
				this.$loading()
				moveSame(para).then(res => {
					if (res.status) {
						this.list[index].checkPcs = this.list[index].NUM
						this.moveFlag = true
						setTimeout(() => {
							this.moveFlag = false
							this.getData()
						}, 500)
					}
					uni.hideLoading()
					this.$message(res.message)
				})
			},
			edit (index) {
				this.hide()
				console.log(index)
				this.Index = index
				// this.hide()
				this.inventoryNum = this.list[index].checkPcs
				this.modal = true
			},
			storeMove (index) {
				this.hide()
				// getApp().globalData.wbInfo = {}
				getApp().globalData.chooseItem = {}
				getApp().globalData.wbInfo = Object.assign(this.list[index], this.filters, this.form)
				uni.navigateTo({
				    url: 'moveStore'
				})
				 
			},
			storeEdit (index) {
				this.hide()
				uni.navigateTo({
				    url: 'moveEdit'
				})
				getApp().globalData.wbInfo = {}
				getApp().globalData.wbInfo = Object.assign(this.list[index], this.filters, this.form)
			},
			getAnimation () {
				let vm = this
				if (vm.currenIndex !== null) {
					vm.animationitem = {}
					let animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease-in-out'
					})
					animation.translateX(-277).translateY(277).step()
					vm.animationitem = animation.export()
					// setTimeout(function() {
					// 	vm.animationitemElse = {}
					// 	// vm.animationitem = {}
					// 	let animationElse = uni.createAnimation({
					// 		duration: 1000,
					// 		timingFunction: 'ease-in-out'
					// 	})
					// 	animationElse.translateY(-27).step()
					// 	vm.animationitemElse = animationElse.export()
					// 	vm.animationitemElse = {}
					// }, 1000);
					
				}
			},
			delSubmit () {
				let matchIndex = this.list.findIndex(item => item.index === this.currenIndex)
				this.$loading('删除中')
				if (matchIndex !== null) {
					delData({storageId: this.list[matchIndex].ID}).then(res => {
						if (res.status) {
							this.getAnimation()
							setTimeout(() => {
								this.currenIndex = null
								this.list.splice(matchIndex, 1)
								this.getData()
							}, 1000)
							this.$message(res.data.msg || res.message)
						} else {
							this.$message(res.data.msg || res.message)
						}
						this.hide()
					})
				}
			},
			remove (index) {
				this.hide()
				this.currenIndex = index
				this.delModal = true
			},
			option (index) {
				console.log(111, index, this.Index, this.menuShow)
				this.menuShow = false
				if (this.Index === index) {
					this.menuShow = false
					this.Index = -1
					return false
				}
				this.Index = index
				this.menuShow = !this.menuShow
			},
			// 清空主单、分单
			clearMainIcon () {
				this.filters.mainBill = ''
				this.showMainClearIcon = false
			},
			clearHawbIcon () {
				this.filters.hawbBill = ''
				this.showHawbClearIcon = false
			},
			// 主单、分单改变监听
			mainChange (val) {
				this.filters.mainBill = val
			},
			hawbChange (val) {
				this.filters.hawbBill = val
			},
			save () {
				this.jumpEnter()
			},
			clear () {
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				this.$refs.search.clear()
				// this.clearMainIcon()
				// this.clearHawbIcon()
				this.list = []
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 300
				})
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
			vm.animationData2 = {}
			let animation = uni.createAnimation({
				duration: 100,
				timingFunction: 'ease-in-out',
			})
			if (top.scrollTop < 10) {
				// animation.translateY(20).step()
				vm.animationData2 = animation.export()
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
	page{
		height: calc(100% + 40rpx);
	}
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
	@keyframes move2
	{
		0% {
			transform: translateX(-10rpx);
		}
		20% {
			transform: translateX(20rpx);
			}
			40% {
				transform: translateX(-15rpx);
				}
				60% {
					transform: translateX(10rpx);
					}
					80% {
						transform: translateX(-8rpx);
						}
						100% {
							transform: translateX(3rpx);
							}
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
	.layout-invent {
		.tui-modal-box {
			padding:38rpx 0rpx 0rpx 0rpx;
			height: 389rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
		}
		.tui-modal-custom {
			height:300rpx;
			padding: 0 28rpx;
			&.del {
				
			}
			image {
				width: 145rpx;
				height: 201rpx;
				position: absolute;
				top: -120rpx;
				left: 50%;
				transform: translateX(-50%);
			}
			.delMsg {
				font-size: 31rpx;
				color: #a6a6a6;
				text-align: center;
			}
			.delTitle {
				margin-top: 50rpx;
				text-align: center;
				font-weight: bold;
				font-size: 38rpx;
				color: #262626
			}
			input {
				height: 85rpx;
				background-color: #f5f5f5;
				border-radius: 43rpx;
				font-size: 29rpx;
				margin-top: 23rpx;
			}
			.title {
				font-size: 38rpx;
				color: #262626;
			}
			.flex-btn {
				display: flex;
				bottom:0rpx;
				position:absolute;
				width: 100%;
				margin-left: -28rpx;
				button {
					width: 50%;
					border: 0;
					height: 128rpx;
					line-height: 128rpx;
					color: #3ace6e;
				}
				.btn {
					border-top: solid 1rpx #d9d9d9;
					&.cancel {
						border-right: solid 1rpx #d9d9d9;
					}
				}
			}
		}
	}
	.contend {
		padding: 0 25rpx;
		margin-top: 440rpx;
		margin-bottom: 120rpx;
		position: relative;
		left: 720px;
		.wb-class {
			background-color: #ffffff;
			border-radius: 10rpx;
			.wbMsg {
				height: 317rpx;
				padding: 70rpx 0 35rpx 0;
				.padding {
					padding: 0;
					.value {
						height: 33rpx;
						font-size: 35rpx;
						line-height: 33rpx;
						letter-spacing: 0rpx;
						color: #262626;
					}
					.label {
						font-size: 29rpx;
						color: #a6a6a6;
					}
				}
			}
			.title {
				border-bottom: 1rpx dashed #d9d9d9;
				height: 104rpx;
				line-height: 104rpx;
				.left {
					width: 6rpx;
					height: 38rpx;
					line-height: 104rpx;
					background-color: #3ace6e;
					display: inline-block;
				}
				.right {
					margin-left: 20rpx;
					font-size: 38rpx;
					color: #262626;
					line-height: 33rpx;
					display: inline-block;
					font-weight: bold;
				}
			}
		}
		
		.contend2 {
			margin-bottom: 200rpx;
			.enterStore {
				text-align: right;
				margin-top: 50rpx;
				text {
					font-size: 31rpx;
					color: #595959;
					letter-spacing: 2rpx;
				}
				.ru {
					color: #3ace6e;
				}
			}
			.list-item {
				margin-top: 30rpx;
				height: 289rpx;
				background-color: #ffffff;
				border-radius: 10rpx;
				position: relative;
				
				padding: 30rpx;
				.bottom {
					display: flex;
					justify-content: space-between;
					position:relative;
					top:80rpx;
					.left {
						.num {
							display: inline-block;
							.value {
								font-size: 52rpx;
								letter-spacing: 3rpx;
								color: #262626;
								line-height: 33rpx;
								text-align: center;
								position:relative;
								bottom:20rpx;
								&.move {
									animation: move2 .5s ease-in-out;
									-webkit-animation:move2 .5s ease-in-out; /*Safari and Chrome*/
								}
							}
							.label {
								font-size: 29rpx;
								letter-spacing: 1rpx;
								color: #a6a6a6;
							}
						}
					}
					.right {
						.agreement {
							border: solid 1rpx #42c275;
							color: #42c275;
						}
						.unAgreement {
							border: solid 1rpx #ff2c55;
							color: #ff2c55;
						}
						button {
							color: #595959;
							border: solid 1rpx #d9d9d9;
							display: inline-block;
							height: 73rpx;
							line-height: 73rpx;
						}
					}
				}
				.menu {
					// width: 279rpx;
					// height: 317rpx;
					z-index:2;
					height:290rpx;
					width:279rpx;
					background-color: #000000;
					border-radius: 10rpx;
					opacity: 0.6;
					text-align: right;
					position: absolute;
					right: 0;
					margin-top: 20rpx;
					padding: 30rpx 30rpx;
					animation:menuShow .5s ease-in-out;
					-webkit-animation:menuShow .5s ease-in-out; /*Safari and Chrome*/
					.menu-item {
						font-size: 35rpx;
						line-height: 80rpx;
						color: #ffffff;
						height: 80rpx;
						// padding: 60rpx 20rpx 20rpx 20rpx;
						text-align: left;
						image {
							width: 36rpx;
							height: 36rpx;
							margin-right: 40rpx;
						}
					}
					&::after {
						content: "";
						position: absolute;
						// bottom: 100%;
						right: 37rpx;
						top: -30rpx;
						// margin-left: -5px;
						border-width: 10px;
						border-style: solid;
						border-color: transparent transparent black transparent;
					}
				}
				.item-top {
					display: flex;
					justify-content: space-between;
					
					.right {
						width: 54rpx;
						height: 54rpx;
						border-radius: 50%;
						line-height: 54rpx;
						font-size: 54rpx;
						color: #FFFFFF;
						text-align: center;
						transform: rotate(0);
						transition: transform 0.35s linear;
						image {
							
							width: 54rpx;
							height: 54rpx;
						}
						&.menuShow {
							transform: rotate(180deg);
						}
					}
					.left {
						view {
							width: 113rpx;
							height: 51rpx;
							background-color: #d9d9d9;
							border-radius: 26rpx;
							font-size: 29rpx;
							line-height: 51rpx;
							letter-spacing: 1rpx;
							color: #ffffff;
							display: inline-block;
							text-align: center;
						}
					}
					.center{
						view {
							width: 300rpx;
							height: 51rpx;
							font-size: 29rpx;
							line-height: 51rpx;
							letter-spacing: 1rpx;
							color: #3ace6e;
							text-align: center;
						}
					}
				}
			}
		}
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
		height: 385rpx;
		// background: #1AAD19;
		// background-image: url(../../static/header.png);
		// background-blend-mode: normal, normal;
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
