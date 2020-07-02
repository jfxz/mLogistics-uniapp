<template>
	<view class="sendGoods">
		<msg-tip ref="toast"></msg-tip>
		<search ref="search"  @mainChange="mainChange" @hawChange="hawChange" @getData="getData"></search>
		<view :animation="animationData" v-if="dataFlag" class="changePosition">
			<view class="title" style="margin-bottom: 20rpx">
				<text class="circle"></text>
				<text class="text-label">运单信息</text>
			</view>
			<view class="top-flex">
				<view class="top-title">
					<text>运单状态</text>
					<view class="title-color">
						<text class="text-info">{{formatWbStatus(form.wbStatus) || ''}}</text>
					</view>
				</view>
				<view class="top-content">
					<view class="content">
						<view class="row">
							<view class="world-left" style="margin-top: 10rpx">
								<text>库位</text>
							</view>
							<view class="world-right">
								<text>{{form.location || ''}}</text>
							</view>
						</view>
					</view>
					<view class="content">
						<view class="content-flex">
							<view class="content-left">
								<text>处理代码</text>
							</view>
							<view class="content-right">
								<text>{{form.specialCode || ''}}</text>
							</view>
						</view>
						<view class="content-flex">
							<view class="content-left content-margin">
								<text>结案异常</text>
							</view>
							<view class="content-right">
								<text>{{form.haveAbstractNotSolved === true? '有': (form.haveAbstractNotSolved === false? '无': '')}}</text>
							</view>
						</view>
					</view>
					<view class="content">
						<view class="content-flex">
							<view class="content-left">
								<text>总数量</text>
							</view>
							<view class="content-right">
								<text>{{form.numTotal || ''}}</text>
							</view>
						</view>
						<view class="content-flex">
							<view class="content-left content-margin">
								<text>已缴费总量</text>
							</view>
							<view class="content-right">
								<text>{{form.wgtCharge || ''}}</text>
							</view>
						</view>
					</view>
					<view class="content">
						<view class="content-flex">
							<view class="content-left">
								<text>总重量</text>
							</view>
							<view class="content-right">
								<text>{{form.wgtTotal || ''}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="title" style="margin-top: 40rpx;margin-bottom: 20rpx;">
				<text class="circle"></text>
				<text class="text-label">发货信息</text>
			</view>
			<view class="middle">
				<view class="input-flex">
					<text class="left">品名</text>
					<picker mode="selector" @change="cargoNameChange" :value="'id'" :range-key="'cargoName'" :range="cargoList">
						<view class="right" style="margin-left: 0;border-left: 0;">{{deliveryInfo.cargoName}}</view>
					</picker>
				</view>
				<view class="input-flex">
					<text class="left">发货数量</text>
					<input class="right" type="number" disabled v-model="deliveryInfo.num" />
				</view>
				<view class="input-flex">
					<text class="left">发货重量</text>
					<input  class="right" type="digit" disabled v-model="deliveryInfo.wgt" />
				</view>
				<view class="input-flex">
					<text class="left">收货人</text>
					<input class="right" type="text" v-model="deliveryInfo.takeName" placeholder="请输入收货人姓名" placeholder-class="placeholder-font"/>
				</view>
				<view class="input-flex">
					<text class="left">收货人证件号码</text>
					<input  class="right" type="idcard" v-model="deliveryInfo.takeIdCard"/>
				</view>
				<view class="input-flex">
					<text class="left">全部发货</text>
					<view class="switch-right">
						<switch :checked="isAll" @change="allChange" />
					</view>
				</view>
				<view class="input-flex">
					<text class="left">是否自提</text>
					<view class="switch-right">
						<switch :checked="isSelf" @change="selfChange" />
					</view>
				</view>
			</view>
			<view class="bottom" v-show="flag">
				<view class="input-flex" style="border: 0;">
					<text class="left">添加备注</text>
					<text class="right" :class="[btnText === '保存'? 'text-color-green':'text-color-yellow']" @click="saveInfo">{{btnText}}</text>
				</view>
				<view class="input-flex" style="margin-bottom: 120rpx;">
					<input type="text" maxlength="50" :disabled="btnText==='修改'" class="remake-input" :class="[btnText === '保存'? 'text-color-black':'text-color-whilte']" v-model="deliveryInfo.remarkSend" placeholder-class="placeholder-font" placeholder-style="margin-left: 23rpx" placeholder="请输入发货备注(50字)..."/>
				</view>
			</view>
			<view  class="bottom" v-if="isSelf">
				<view class="input-flex bottom-title">
					<text>其他信息</text>
					<text class="right" :class="[btnText === '保存'? 'text-color-green':'text-color-yellow']" @click="saveInfo">{{btnText}}</text>
				</view>
				<view class="input-flex">
					<text class="left">送货人</text>
					<input class="right" type="text" v-model="other.name"/>
				</view>
				<view class="input-flex">
					<text class="left">送货车牌号码</text>
					<input class="right" type="text" v-model="other.card"/>
				</view>
				<view class="input-flex">
					<text class="left">送货联系方式</text>
					<input class="right" type="number" placeholder-class="placeholder-font" v-model="other.phone" placeholder="请输入联系方式"/>
				</view>
				<view class="input-flex">
					<text class="left">是否送达</text>
					<view class="switch-right">
						<switch :checked="isService" @change="serviceChange" />
					</view>
				</view>
				<view class="input-flex">
					<text class="left">短信提醒</text>
					<view class="switch-right">
						<switch :checked="isRemind" @change="remindChange" />
					</view>
				</view>
				<view class="input-flex" style="border: 0;">
					<text class="left">发货备注</text>
				</view>
				<view class="input-flex" style="margin-bottom: 120rpx;">
					<input type="text" maxlength="50" :disabled="btnText==='修改'" class="remake-input" :class="[btnText === '保存'? 'text-color-black':'text-color-whilte']" v-model="deliveryInfo.remarkSend" placeholder-class="placeholder-font" placeholder-style="margin-left: 23rpx" placeholder="请输入发货备注(50字)..."/>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import search from '@/components/search.vue'
	import tuiModal from "@/components/modal"
	import msgTip from '@/components/tip/tip.vue'
	// import { mapGetters } from 'vuex'
	import dayjs from '@/common/util/dayjs.min.js'
	import {deepCopy,cartoon} from '@/common/util/util.js'
	import {findDeliveryInfo,findSomeInformation, updateNote, startDelivery, canceldeliveryInfo} from '@/common/api/enter/sendGoods.js'
	export default {
		components: {search,tuiModal,msgTip},
		data() {
			return {
				cargoList: [],
				flag: true,
				isService: false,
				isRemind: false,
				showMainClearIcon: false,
				showHawbClearIcon: false,
				dataFlag: false,
				filters: {
					mainBill: '',
					hawbBill: ''
				},
				isSelf: false,
				isAll: false,
				// 弹窗提示
				modal: false,
				dialogMsg: '',
				btnText: '保存',
				// 用于标识是否已经发货
				hasDelivered: false,
				deliveryInfo:{
					isSelfTake: '1',
					isMessage: '1'
				},
				animationData: {},
				form: {
					// wbStatus: '3'
				}
			}
		},
		watch: {
		 //    'form.wbStatus': {
			// 	handler(newVal, oldVal) {
			// 		console.log('新值',newVal)
			// 		this.$emit('updateWorld', newVal);
			// 	},
			// 	immediate: true,
			// 	deep: true
			// }
		 },
		onReady: function(){
		},
		mounted () {
		},
		methods: {
			allChange: function (e) {
				this.isAll = e.target.value
			},
			cargoNameChange (val) {
				let data = this.cargoList[val.detail.value]
				this.$set(this.deliveryInfo, 'cargoName', data.cargoName)
				this.$set(this.deliveryInfo, 'num', data.num)
				this.$set(this.deliveryInfo, 'wgt', data.wgt)
				console.log(data,this.deliveryInfo.cargoName)
			},
			//运单状态格式化
			formatWbStatus(status) {
				let match = this.$store.state.dic.WB_STATUS.find(item => item.value === status)
				if (match) {
					return match.label
				} else {
					return status
				}
			},
			clear () {
				this.isAll = false
				this.isSelf = false
				this.isRemind = false
				this.isService = false
				this.hasDelivered = false
				this.btnText = '保存'
				//清空搜索框
				this.$refs.search.clear()
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				this.deliveryInfo = {
					isSelfTake: '1',
					isMessage: '1'
				}
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
			},
			//关闭弹窗
			hide() {
				this.modal = false
			},
			handleClick(e) { // 点击确认发货
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					// if (this.hasDelivered) {//取消发货接口
					// 	this.modal = false
					// 	canceldeliveryInfo(this.deliveryInfo).then(res =>{
					// 		uni.pageScrollTo({
					// 		    scrollTop: 0,
					// 		    duration: 300
					// 		})
					// 		this.$refs.search.clear()
					// 		this.clear()
					// 		if (res.message) {
					// 			this.$message(res.message)
					// 			// this.msg(res.message, res.status === 1 ?
					// 			// 	'green' : 'warning')
					// 		}
					// 	})
					// } else {
						//发货接口
						let data = []
						this.deliveryInfo.numberDelivery = Number(this.deliveryInfo.num)
						this.deliveryInfo.weightDelivery = Number(this.deliveryInfo.wgt)
						this.deliveryInfo.sendDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
						this.deliveryInfo.sendBy = this.$store.state.user.userInfo.name
						if (this.isAll) {
							let entity = deepCopy(this.deliveryInfo)
							this.cargoList.forEach(item => {
								entity.numberDelivery = Number(item.num)
								entity.weightDelivery = Number(item.wgt)
								entity.cargoName = item.cargoName
								data.push(entity)
							})
						} else {
							data.push(this.deliveryInfo)
						}		
						this.modal = false
						// 批量发货接口，构建成数组格式
						startDelivery(data).then(res => {
							uni.pageScrollTo({
							    scrollTop: 0,
							    duration: 300
							})
							this.$refs.search.clear()
							this.clear()
							if (res.message) {
								this.$message(res.message)
								// this.msg(res.message, res.status === 1 ?
								// 	'green' : 'warning')
							}
						})
					// }
				}
			},
			msg(msg, type) { //消息提示
				let message = msg
				let options = {
					msg: message,
					duration: 2000,
					type: type
				}
				this.$refs.toast.showTips(options);
			},
			//保存信息
			saveInfo () {
				if (this.btnText === '修改') {
					this.btnText = '保存' 
				} else if (this.deliveryInfo.waybillId) { //还要加校验
					updateNote(this.deliveryInfo).then(res=> {
						if (res.message) {
							this.msg(res.message, res.status === 1 ? 'green' : 'warning')
							if(res.status) {
								this.btnText = '修改'
							}
						}
					})
				} else {
					this.$message('请先查询运单信息')
				}
			},
			//父组件调用保存
			cancle () {
				if (this.hasDelivered) {//已发货
					if(!this.deliveryInfo) {
						if (!this.deliveryInfo.waybillId) {
							this.$message('请先查询运单信息')
						} 
					} else {
						if (this.deliveryInfo.waybillId) {
							updateNote(this.deliveryInfo).then(res=> {
								if (res.message) {
									this.msg(res.message, res.status === 1 ? 'green' : 'warning')
								}
							})
						}
						else {
							this.$message('请先查询运单信息')
						}
					}
					
				} else {
					this.$message('请先查询运单信息')
				}
			},
			//确认发货弹窗提醒
			save () {
				console.log(this.hasDelivered)
				if (this.hasDelivered) {//已发货
					if (!this.deliveryInfo.waybillId) {
						this.$message('请先查询运单信息')
					} else {
						this.dialogMsg = '确认取消发货？点击确认即可取消发货'
						this.modal = true
					}
				} else {
					if (this.deliveryInfo && this.form.id) {
						// if (this.hasDelivered || !this.deliveryInfo.waybillId || this.form.declareStatus !== '3' || this.form.haveAbstractNotSolved) {
						if (this.hasDelivered || !this.deliveryInfo.waybillId || this.form.haveAbstractNotSolved) {
							this.$message('运单未发货，报关状态为已报关且无结案异常时才可发货')
						// } else if ((!this.deliveryInfo.numberdeliveryInfo) || this.compare(0,this.deliveryInfo.numberdeliveryInfo,true)) {
						// 	this.$message('发货数量不能为空且必须大于0')
						// } else if (this.compare(this.deliveryInfo.numberdeliveryInfo,this.form.numTotal,true)) {
						// 	this.$message('发货数量不能大于总数量')
						// } else if (!this.deliveryInfo.weightdeliveryInfo || this.compare(0,this.deliveryInfo.weightdeliveryInfo,true)) {
						// 	this.$message('发货重量不能为空且必须大于0')
						// } else if (this.compare(this.deliveryInfo.weightdeliveryInfo,this.form.wgtTotal,true)) {
						// 	this.$message('发货重量不能大于总重量')
						} else if (!this.deliveryInfo.takeName) {
							this.$message('收货人不能为空')
						} else if (!this.deliveryInfo.takeIdCard) {
							this.$message('收货人证件号码不能为空')
						} else {
							this.dialogMsg = '请确认发货信息无误，点击确认即可发货'
							this.modal = true
						}
					} else {
						this.$message('请先查询运单信息')
					}
				}
				console.log(this.form)
			},
			//比较方法
			compare(firstNum, secondNum, equal) {
				if (equal) {
					if(Number(firstNum) > Number(secondNum)) {
						return true
					} else {
						return false
					}
				} else if(Number(firstNum) > Number(secondNum)) {
					return true
				}
				return false
			},
			//主单号赋值
			mainChange (val){
				console.log('主单号',val)
				this.filters.mainBill = val
			},
			//分单号赋值
			hawChange (val){
				console.log('分单号',val)
				this.filters.hawbBill = val
			},
			getData (val) {
				console.log(this.filters)
				this.$loading('加载中')
				//运单校验还没写
				let data = deepCopy(this.filters)
				if (!data.hawbBill) {
					data.hawbBill = ' '
				}
				findSomeInformation(data).then(res=> {
					uni.hideLoading()
					if(res.status) {
						if (res.data.length) {
							if (res.data.length > 1) {
								let msg = '查询成功，但所查信息有' + res.data.length + '条，请填写详细查询条件'
								this.$message(msg)
							} else {
								this.dataFlag = true
								cartoon(this)
								this.form = res.data[0].waybillInformation
								// 从发货状态判断是否已经发货
								if (res.data[0].waybillInformation.wbStatus === '5') {
								  this.hasDelivered = true
								} else {
									console.log('未发货')
								  this.hasDelivered = false
								}
								if (res.data[0].deliveryInformation) {
								  this.deliveryInfo = res.data[0].deliveryInformation
								  this.deliveryInfo.cargoName = ''
								} else {
								  // 没有发货信息，则将运单信息的id保存，用于之后发货信息处理
								  if (this.form.id) {
									  this.deliveryInfo.waybillId = this.form.id
								  }
								}
								 // 如果运单状态为非自提，则不处理，否则一律赋值为自提
								if (this.deliveryInfo.isSelfTake !== '0') {
								  this.deliveryInfo.isSelfTake = '1'
								} else {
									this.$message('查询成功，无此订单相关数据')
								 }
							}
							// if (this.deliveryInfo !== {}) {
							// 	// 已经发货才可以修改备注
							// 	this.hasDelivered = true
							// }
						} else {
							this.$message('运单号不存在')
						}
					} else {
						this.$message('查询失败')
					}
				})
				this.filters.wbprefix = ''
				this.filters.wbNo = ''
				if (this.filters.mainBill !== null && this.filters.mainBill !== '' && this.filters.mainBill !== undefined) {
					if (this.filters.mainBill.length > 3 && this.filters.hawbBill !== null && this.filters.hawbBill !== '' && this.filters.hawbBill !== undefined) {
						this.filters.wbprefix = this.filters.mainBill
						this.filters.wbNo = this.filters.hawbBill
					} else {
						this.filters.wbprefix = this.filters.mainBill.substring(0,3)
						this.filters.wbNo = this.filters.mainBill.substring(3)
					}
				}
				findDeliveryInfo(this.filters).then(res => {
					this.cargoList = res.data.content
				})
			},
			//自提
			selfChange: function (e) {
				this.flag = !this.flag
				let vm = this
				if (e.target.value) {
					console.log(e.target.value)
					this.deliveryInfo.isSelfTake = '1'
					vm.isSelf = e.target.value
				} else {
					setTimeout(function() {
						vm.isSelf = e.target.value
						this.deliveryInfo.isSelfTake = '0'
					}, 100)
				}
			}
		}
	}
</script>

<style lang="scss">
	.sendGoods{
		border-radius: 10rpx;
		.changePosition{
			position: absolute;
			width: 100%;
			left: 720px;
		}
		.placeholder-font{
			font-family: SourceHanSansSC-Regular;
			font-size: 29rpx;
		}
		.title {
			margin: 0 25rpx;
			.circle {
				width: 6rpx;
				height: 30upx;
				background: #0ebf9c;
				text-align: center;
				line-height: 30upx;
				color: #3ace6e;
				font-size: 18px;
				display: inline-block;
			}
			.text-label{
				margin-left: 15upx;
				font-family: SourceHanSansSC-Medium;
				font-size: 38rpx;
				color: #262626;
				text{
					line-height: 38rpx;
					height: 38rpx;
				}
			}
		}
		.top-flex{
			display: flex;
			flex-direction: column;
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			background: #FFFFFF;
			border-radius: 5px;
			.top-title{
				padding: 0rpx 20rpx;
				display: flex;
				flex-direction: row; 
				height: 104rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 29rpx;
				line-height: 104rpx;
				color: #a6a6a6;
				border-bottom: solid 1px #e1e5e4;
				.title-color {
					margin: 12rpx 0;
					margin-left: 24rpx;
					line-height: 75rpx;
					text-align: center;
					background: -webkit-linear-gradient(#fac55f,#ffaa00);
					transform: skewX(-15deg);
					.text-info {
						 display: inline-block;
						 font-family: FZZYJW--GB1-0;
						 font-size: 35rpx;
						 color: #FFFFFF;
						 width: 114rpx;
						 transform: skewX(15deg);
					}
				}
			}
			.top-content{
				padding: 0rpx 20rpx;
				display: flex;
				flex-direction: column;
				height: 406rpx;
				.content{
					display: flex;
					flex-direction: row;
					text-align: center;
					height: 90rpx;
					.row{
						display: flex;
						flex-direction: row;
						.world-left{
							text-align: left;
							line-height: 90rpx;
							font-family: SourceHanSansSC-Regular;
							font-size: 29rpx;
							color: #a6a6a6;
						}
						.world-right{
							text-align: left;
							margin-left: 15rpx; 
							line-height: 101rpx;
							font-family: Roboto-Regular;
							font-size: 31rpx;
							color: #262626;
						}
					}
					.content-flex{
						width: 50%;
						display: flex;
						flex-direction: row;
					}
					.content-left{
						text-align: left;
						width: 50%;
						line-height: 101rpx;
						font-family: SourceHanSansSC-Regular;
						font-size: 29rpx;
						color: #a6a6a6;
					}
					.content-right{
						text-align: center;
						line-height: 101rpx;
						font-family: Roboto-Regular;
						font-size: 31rpx;
						color: #262626;
					}
					.content-margin {
						margin-left: 65rpx;
					}
				}
			}
		}
		.middle {
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			display: flex;
			flex-direction: column;
			border-radius: 5px;
			background: #FFFFFF;
		}
		.input-flex{
			padding: 0 28rpx;
			border-bottom: 1px solid #e1e5e4;
			height: 104rpx;
			line-height: 104rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.left{
				font-family: SourceHanSansSC-Regular;
				font-size: 31rpx;
				color: #595959;
			}
			.switch-right{
				padding-top: 25upx;
			}
			.right{
				float: right;
				margin-right: 20rpx;
				font-family: Roboto-Regular;
				height: 104rpx;
				line-height: 104rpx;
				font-size: 35rpx;
				color: #262626;
				text-align: right;
				width: 300rpx;
			}
			.text-color-yellow{
				color: #fac55f;
			}
			.text-color-green{
				color: #41c989;
			}
			.text-color-whilte{
				color: #bfbfbf;
			}
			.text-color-black{
				color: #262626;
			}
			.remake-input{
				font-size: 31rpx;
				height: 92rpx;
				width: 100%;
				padding-left: 50rpx;
				font-family: SourceHanSansSC-Regular;
				background-color: #f5f5f5;
				border-radius: 46rpx;
			}
		}
		.bottom{
			width: calc(100% - 50rpx);
			margin: 20rpx 25rpx 0 25rpx;
			background: #FFFFFF;
			.bottom-title {
				font-family: FZZYJW--GB1-0;
				font-size: 38rpx;
				padding-left: 28rpx;
				border-bottom: 1px solid #e1e5e4;
				height: 104rpx;
				line-height: 104rpx;
				background-image: linear-gradient(#67b0ff, #4a90e5);
				-webkit-background-clip: text;
				color: transparent;
			}
		}
	}
</style>
