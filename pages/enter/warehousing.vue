<template>
	<view class="warehousing">
		<arrow name="货物入库" v-if="jumpFlag"></arrow>
		<view class="top" v-if="jumpFlag"></view>
		<msg-tip ref="toast"></msg-tip>
		<search ref="search" :sty="jumpFlag" @mainChange="mainChange" @hawChange="hawChange" @getData="getData"></search>
		<view v-if="jumpFlag || dataFlag" :animation="animationData" :class="jumpFlag? '' : 'changePosition'">
			<view class="msg" :style="jumpFlag? 'padding-top: 560rpx': ''">
				<view class="mid-text" style="margin-bottom: 25rpx;">
					<text class="circle"></text>
					<text class="text-label">运单信息</text>
				</view>
				<view class="flex-text">
					<text class="text-content">处理代码</text>
					<text class="text-content2">{{form.special_code || ''}}</text>
					<text class="text-content">报关状态</text>
					<text class="text-content3">{{formatDeclare(form.declare_status)}}</text>
				</view>
				<view class="mid-text" style="margin-bottom: 25rpx;margin-top:37rpx">
					<text class="circle"></text>
					<text class="text-label">入库操作</text>
				</view>
				<view class="text-info">
					<view class="input-flex">
						<text class="left">数量</text>
						<input class="right" type="text" v-model="form.untallynum" />
					</view>
					<view class="input-flex">
						<text class="left">重量</text>
						<input  class="right" type="text" v-model="form.untallywgt" />
					</view>
					<view class="input-flex">
						<text class="left">品名代码</text>
						<input  class="right" type="text" v-model="form.cargoCode" @blur="cargoCodeBlur('cargoCode')"/>
					</view>
					<view class="input-flex">
						<text class="left">品名</text>
						<input  class="right" type="text" v-model="form.cargoName" @blur="cargoCodeBlur('cargoName')"/>
					</view>
					<view class="input-flex">
					  <text class="left">货物存放属性</text>
					  <picker mode="selector" @change="specialChange" :value="'id'" :range-key="'locationName'" :range="specialList">
						  <view class="right" style="margin-left: 0;border-left: 0;">{{form.locationName}}</view>
					  </picker>
					</view>
					<view class="input-flex">
						<text class="left">库位</text>
						<picker mode="selector" @change="specialChange" :value="'id'" :range-key="'locationCode'" :range="specialList">
							<view class="right" style="margin-left: 0;border-left: 0;">{{form.locationCode}}</view>
						</picker>
					</view>
					<view class="input-flex">
						<text class="left">客户</text>
						<view class="right" style="margin-top: 23rpx">
							<bjx-input the-style="width: 300rpx;height: 100%;text-align:right;color: #262626;font-size: 35rpx;float: right" itemStyle="bottom:110rpx" ref='inputsCustomer' :value="form.receiverName" placeholder=' ' @list="getCustomerList"
								@select="selectCustomerItem" @focus="focusCustomer" itemKey="custCode">
							</bjx-input>	
						</view>
					</view>
				</view>
				<view class="btn-go" v-if="!jumpFlag">
					<view class="left">
						<image style="width: 60rpx;height: 60rpx;margin-top:78rpx;" src="../../static/abnormal.png" mode="aspectFit"></image>
						<view class="left-content" @click="gotoAbn">
							<text class="content-text">异常处理</text>
							<text class="content-text2">订单异常</text>
						</view>
					</view>
					<view style="height: 71rpx;border: solid 1rpx #d9d9d9;margin-top:65rpx;">
					</view>
					<view class="right">
						<image style="width: 60rpx;height: 60rpx;margin-top:78rpx;" src="../../static/inventory.png" mode="aspectFit"></image>
						<view class="right-content" @click="gotoInventory">
							<text class="content-text">仓库盘点</text>
							<text class="content-text2">运单查询</text>
						</view>
					</view>
				</view>
				<view class="btn-bottom" v-if="jumpFlag">
					<button type="primary" @tap="save">入库</button>
				</view>
				<view class="bottom-text" v-if="jumpFlag">
					<text>货物异常?</text>
					<text style="color: #3ace6e;margin-left:20rpx;" @click="gotoAbn">异常处理</text>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import footBtn from '@/components/footBtn.vue'
	import arrow from '@/components/arrow/arrow.vue'
	// import { mapGetters } from 'vuex'
	import search from '@/components/search.vue'
	import tuiModal from "@/components/modal"
	import {getWbInfo,savecargostorage, getAllCode, getRelationMsgByLocation} from '@/common/api/enter/warehousing.js'
	import msgTip from '@/components/tip/tip.vue'
	import bjxInput from '@/components/bjx-inputs.vue'
	import {cartoon} from '@/common/util/util.js'
	export default {
		components: {search,tuiModal,msgTip,arrow,footBtn,bjxInput},
		data() {
			return {
				cargoNameList: [],
				specialList: [],
				filters: {
					wbprefix: '',
					wbNo: '',
					mainBill: '',
					hawbBill: '',
				},
				// 弹窗提示
				modal: false,
				jumpFlag: false,
				btnShow: false,
				animationData: {},
				dialogMsg: '',
				dataFlag: false,
				chooseItem: {},
				chooseCustomerItem: {},
				form: {
					locationCode: '',//测试数据
					untallynum: '',
					kwId: '',
					untallywgt: '',
					specialCode: '',
					cargoName: '',
					receiverName: '',
					locationName: '',
					cargoCode: ''
				}
			}
		},
		mounted () {
			this.specialList = this.$store.state.dic.warehouse_dic
			this.cargoNameList = this.$store.state.dic.cargoname_dic
		},
		onLoad (val) {
			if ('mainBill' in val) {
				this.jumpFlag = true
				this.filters = {...val}
				this.$nextTick(function(){
					setTimeout(() => {
						this.$refs.search.addMain(this.filters.mainBill)
						this.$refs.search.addHaw(this.filters.hawbBill,this.filters.mainBill)
					},500)
				})
			} else {
				this.jumpFlag = false
			}
		},
		methods: {
			changeLable (val) {
				let result = this.specialList.find(item => {
					return item.code === val
				})
				return result ? result.nameChn : val
			},
			cargoCodeBlur (key) {
				let data = this.cargoNameList.find(item => item[key] === this.form[key])
				let value = key === 'cargoName' ? 'cargoCode' : 'cargoName'
				this.$set(this.form, value, data[value])
			},
			specialChange (val) {
				let data = this.specialList[val.detail.value]
				this.form.locationName = data.locationName
				this.form.kwId = data.id
				this.form.locationCode = data.locationCode
			},
			cartoon() {
				let _this = this
				_this.animationData = {}
				var animation = uni.createAnimation({
					duration: 1000,
				    timingFunction: 'ease',
				})
				_this.animation = animation
				setTimeout(function() {
				     animation.translateX(-720).step()
				     _this.animationData = animation.export()
				 }.bind(_this), 100)
			},
			focus (e) {
				console.log('focus')
				uni.pageScrollTo({
				    scrollTop: 1000,
				    duration: 300
				})
				this.getWareList(e)
			},
			getWareList (e) {
				console.log('e', e)
				// 覆盖 value1
				
				let data2 = this.$store.state.dic.warehouse_dic
				if(!e.value){
						e.callback(data2)
				}else{
					this.form.locationCode = e.value
						let data = []
						data2.forEach(item=>{
								if(item.locationCode.indexOf(e.value) > -1){
										data.push(item)
								}
						})
						e.callback(data)
				}
			},
			selectItem (val) {
				this.chooseItem = val
				this.form.kwId = val.id
				this.form.locationCode = val.locationCode
			},
			focusCustomer (e) {
				uni.pageScrollTo({
				    scrollTop: 1000,
				    duration: 300
				})
				this.getCustomerList(e)
			},
			getCustomerList (e) {
				console.log('e', e)
				// 覆盖 value1
				
				let data2 = this.$store.state.dic.customer_dic
				if(!e.value){
						e.callback(data2)
				}else{
					this.form.receiverName = e.value
						let data = []
						data2.forEach(item=>{
								if(item.custCode.indexOf(e.value) > -1){
										data.push(item)
								}
						})
						e.callback(data)
				}
			},
			selectCustomerItem (val) {
				this.chooseCustomerItem = val
				this.form.customerId = val.id
				this.form.receiverName = val.custCode
			},
			clear () {
				//清空搜索框
				this.chooseItem = {}
				this.chooseCustomerItem = {}
				this.$refs.search.clear()
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
			},
			//报关状态格式化
			formatDeclare (status) {
				let match = this.$store.state.dic.DECLARE_STATUS.find(item => item.value === status)
				if (match) {
					return match.label
				}
			},
			//取消入库，关闭弹窗
			hide() {
				this.modal = false
			},
			handleClick(e) { // 点击确认入库
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					//入库接口
					this.modal = false
					let postData = {}
					postData.wbId = this.form.id
					if (this.form.kwId) {
						postData.locationCode = this.form.kwId
					} else {
						postData.locationCode = this.chooseItem.id
					}
					if (this.form.customerId) {
						postData.receiverName = this.form.receiverName
					} else {
						postData.receiverName = this.chooseCustomerItem.custCode
					}
					postData.specialCode = this.form.special_code,
					postData.locationName = this.form.locationName,
					postData.cargoName = this.form.cargoName,
					postData.receiverName = this.form.receiverName,
					postData.locationName = this.form.locationName,
					postData.numTally = Number(this.form.untallynum)
					postData.wgtTally = Number(this.form.untallywgt)
					savecargostorage(postData).then(res => {
						if (res.status) {
							if (res.data.msg !== null && res.data.msg !== '') {
								this.$message(res.data.msg)
							} else {
								uni.pageScrollTo({
								    scrollTop: 0,
								    duration: 300
								})
								this.clear()
								this.$message('成功')
							}
						}
					})
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
			//入库
			save () {
				// 入库前校验库位属性待提供
				// 提示入库数量 重量信息
				console.log(this.form,!this.chooseItem)
				if (this.compare(0,this.form.untallynum, true) ||  this.compare(0,this.form.untallywgt,true)) {
					this.$message('入库数量、重量必须大于零')
				} else if (Math.floor(Number(this.form.untallynum)) !== Number(this.form.untallynum)) {
					this.$message('入库数量必须为整数')
				} else if (!this.form.locationCode) {
					this.$message('请填写库位')
				} else if (!this.form.untallynum) {
					this.$message('请填写数量')
				} else if (!this.form.locationName) {
					this.$message('请选择货物存放属性')
				} else if (!this.form.receiverName) {
					this.$message('请选择客户')
				} else if (!this.form.untallywgt) {
					this.$message('请填写重量')
				} else if (!this.form.cargoName) {
				 	this.$message('请填写品名')
				} else if (Object.keys(this.chooseItem).length < 1) {
					let data2 = this.$store.state.dic.warehouse_dic
					let match = data2.find(item => item.locationCode === this.form.locationCode)
					if (match) {
						this.chooseItem = match
					} else {
						this.$message('未匹配到库位')
						return
					}
				} else if (Object.keys(this.chooseCustomerItem).length < 1) {
					let data2 = this.$store.state.dic.customer_dic
					let match = data2.find(item => item.custCode === this.form.receiverName)
					if (match) {
						this.chooseCustomerItem = match
					} else {
						this.$message('未匹配到客户')
						return
					}
				} else if (Object.keys(this.chooseCustomerItem).length < 1) {
					let data2 = this.$store.state.dic.customer_dic
					let match = data2.find(item => item.custCode === this.form.receiverName)
					if (match) {
						this.chooseCustomerItem = match
					} else {
						this.$message('未匹配到客户')
						return
					}
				} else {
					if (this.compare(this.form.untallynum,this.form.num_total) &&this.compare(this.form.untallywgt,this.form.wgt_total)) {
						this.dialogMsg = '数量超出总数量,重量超出总重量,请确认是否继续入库'
					}
					else if(this.compare(this.form.untallynum,this.form.num_total)) { //入库数量大于货物信息数量
						this.dialogMsg = '数量超出总数量,请确认是否继续入库'
					}
					else if(this.compare(this.form.untallywgt,this.form.wgt_total)) { //入库重量大于货物重量
					    this.dialogMsg = '重量超出总重量,请确认是否继续入库'
					}
					else {
						this.dialogMsg = '确认信息无误，请点击确认入库'
					}
					this.modal = true
					console.log(this.form)
				}
			},
			//比较方法
			compare(firstNum, secondNum, equal) {
				if (equal) {
					if(Number(firstNum) > Number(secondNum) || Number(firstNum) === Number(secondNum)) {
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
				this.filters.mainBill = val
			},
			//分单号赋值
			hawChange (val){
				this.filters.hawbBill = val
				// this.filters.wbNo = val.substring(2,val.length)
			},
			getData () {
				console.log(this.filters)
				//运单规则检验
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
				this.$loading('加载中')
				getWbInfo (this.filters).then(res=> {
					uni.hideLoading()
					if(res.status) {
						if (res.data.msg !== null && res.data.msg !== '') {
							// this.clear()
							this.$message(res.data.msg)
						} else {
							this.dataFlag = true
							if (!this.jumpFlag) {
								cartoon(this)
							}
							this.form = {
								locationCode: '',
								untallynum: '',
								kwId: '',
								untallywgt: '',
								specialCode: '',
								cargoName: '',
								receiverName: '',
								locationName: '',
								cargoCode: ''
							}
							this.form = Object.assign({}, res.data.wbInfo, this.form)
							// let data2 = this.$store.state.dic.cargoname_dic
							// let match = data2.find(item => item.cargoName === res.data.wbInfo.cargo_name)
							this.form.cargoName =  ''
							this.form.cargoCode =  ''
							this.form.locationName = ''
							this.form.receiverName = ''
							this.$set(this.form, 'specialCode', res.data.wbInfo.special_code || 0)
							this.$set(this.form, 'untallynum', res.data.wbInfo.untallynum || 0)
							this.$set(this.form, 'untallywgt', res.data.wbInfo.untallywgt || 0)
							console.log('untallynuma', this.form.untallynuma, this.form)
							this.$message('查询成功')
						}
					} else {
						// this.clear()
						this.$message('查询失败')
					}
				})
			},
			//跳转至异常处理
			gotoAbn() {
				this.$loading('正在跳转到异常处理')
				setTimeout(() => {
					uni.navigateTo({
					    url: `../enter/abnormal?mainBill=${this.filters.mainBill}&hawbBill=${this.filters.hawbBill}`
					})
					uni.hideLoading()
				}, 200)
			},
			//跳转至仓库盘点
			gotoInventory(){
				this.$loading('正在跳转到仓库盘点')
				getApp().globalData.toIventMsg = {
					mainBill: this.filters.mainBill,
					hawbBill: this.filters.hawbBill
				}
				let url = '../inventory/index'
				setTimeout(() => {
					uni.switchTab({
						url: url,
					})
					uni.hideLoading()
				}, 200)
			}
		}
	}
</script>

<style lang="scss">
	.warehousing {
		.top {
			position: absolute;
			top: 0;
			width: 100%;
			height: 384rpx;
			z-index: -1;
			// background: #1AAD19;
			background-image: linear-gradient(-90deg, 
					#3ace6e 0%, 
					#41c989 100%), 
				linear-gradient(
					#3ace6e, 
					#3ace6e);
				background-blend-mode: normal, normal;
		}
	}
	.changePosition{
		position: absolute;
		width: 100%;
		left: 720px;
	}
	.msg{
		.mid-text {
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
		.flex-text {
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			padding: 0rpx 20rpx;
			display: flex;
			flex-direction: row;
			border-radius: 5px;
			background: #FFFFFF;
			height:115rpx;
			font-family: SourceHanSansSC-Regular;
			.text-content{
				height:115rpx;
				line-height:115rpx;
				margin-left: 36rpx;
				width: 115rpx;
				font-size: 29rpx;
				color: #a6a6a6;
			}
			.text-content2{
				line-height: 115rpx;
				width: 63rpx;
				font-size: 35rpx;
				color: #262626;
				margin-left: 25rpx;
				margin-right: 63rpx;
			}
			.text-content3{
				display: inline;
				border-radius: 38rpx;
				background-color: rgba(0, 122, 255, 0.11);
				line-height: 80upx;
				text-align: center;
				height:80upx;
				margin-top: 20upx;
				font-size: 17px;
				width: 165rpx;
				color: #007aff;
				margin-left: 24rpx;
			}
		}
		.text-info {
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			display: flex;
			flex-direction: column;
			border-radius: 5px;
			background: #FFFFFF;
			.input-flex{
				padding: 0 28rpx;
				border-bottom: 1px solid #e1e5e4;
				height: 104rpx;
				line-height: 104rpx;
				.left{
					font-family: SourceHanSansSC-Regular;
					font-size: 31rpx;
					color: #595959;
					float: left;
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
			}
		}
		.btn-bottom{
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			margin-top: 83rpx;
			button{
				background-image: linear-gradient(-90deg,
						#41c989 0%, 
						#3ace6e 100%), 
					linear-gradient(
						#ffffff, 
						#ffffff);
					background-blend-mode: normal, 
						normal;
					border-radius: 44px;
			}
		}
		.bottom-text{
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			margin-top: 51rpx;
			margin-bottom: 48rpx;
			text-align: right;
			font-family: SourceHanSansSC-Regular;
			font-size: 31rpx;
			font-weight: normal;
			letter-spacing: 0rpx;
			color: #595959;
		}
		.btn-go{
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			margin-top: 33rpx;
			margin-bottom: 120rpx;
			display: flex;
			height: 210rpx;
			justify-content: space-between;
			flex-direction: row;
			border-radius: 5px;
			background: #FFFFFF;
			.content-text{
				font-family: SourceHanSansSC-Regular;
				font-size: 38rpx;
				color: #262626;
			}
			.content-text2{
				font-family: SourceHanSansSC-Regular;
				font-size: 31rpx;
				color: #a6a6a6;
			}
			.left{
				// float: left;
				// text-align: left;
				// width: 50%;
				// padding: 0 40rpx;
				padding: 0 32rpx;
				display: flex;
				flex-direction: row;
				.left-content{
					margin-top: 60rpx;
					margin-left: 25rpx;
					display: flex;
					flex-direction: column;
				}
			}
			.right{
				// float: right;
				// text-align: left;
				// padding: 0 40rpx;
				// width: 50%;
				padding: 0 32rpx;
				display: flex;
				flex-direction: row;
				.right-content{
					margin-top: 60rpx;
					margin-left: 25rpx;
					display: flex;
					flex-direction: column;
				}
			}
		}
	}
</style>
