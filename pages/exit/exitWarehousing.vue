<template>
	<view class="exitWarehousing">
		<msg-tip ref="toast"></msg-tip>
		<search ref="search" :billFlag="true" @mainChange="mainChange"  @getData="getData"></search>
		<view v-if="dataFlag" :animation="animationData" class="changePosition">
			<view class="msg">
				<view class="mid-text" style="margin-bottom: 25rpx;">
					<text class="circle"></text>
					<text class="text-label">运单信息</text>
				</view>
				<view class="flex-text">
					<text class="text-content">处理代码</text>
					<text class="text-content2">{{form.specialCodes || ''}}</text>
					<text class="text-content">运单状态</text>
					<text class="text-content3">{{formatWbStatus(form.wbStatus) || ''}}</text>
				</view>
				<view class="mid-text" style="margin-bottom: 25rpx;margin-top:37rpx">
					<text class="circle"></text>
					<text class="text-label">入库操作</text>
				</view>
				<view class="text-info">
					<view class="input-flex">
						<text class="left">件数</text>
						<input class="right" type="text" v-model="form.numCanIn" />
					</view>
					<view class="input-flex">
						<text class="left">重量</text>
						<input  class="right" type="text" v-model="form.wgtCanIn" />
					</view>
					<view class="input-flex">
						<text class="left">库位</text>
						<!-- <text class="right" style="width: 300rpx;height: 100%;text-align:right;" type="text" @tap="jumpChoose">{{form.locationCode}}</text> -->
						<view class="right" style="margin-top: 23rpx">
							<bjx-input the-style="width: 300rpx;height: 100%;text-align:right;color: #262626;font-size: 35rpx;float: right" itemStyle="bottom:110rpx" ref='inputs1' :value="form.locationCode" placeholder=' ' @list="getWareList"
								@select="selectItem" @focus="focus" @blur="blur" itemKey="locationCode">
							</bjx-input>	
						</view>
					</view>
				</view>
				<view class="bottom-text">
					<text>运单查询?</text>
					<text style="color: #3ace6e;margin-left: 20rpx" @click="gotoInventory">仓库盘点</text>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	// import { mapGetters } from 'vuex';
	import search from '@/components/search.vue'
	import tuiModal from "@/components/modal"
	import {getWbInfo,storageIn} from '@/common/api/exit/exitWarehousing.js'
	import msgTip from '@/components/tip/tip.vue'
	import bjxInput from '@/components/bjx-inputs.vue'
	import {deepCopy,isEmpty,cartoon} from '@/common/util/util.js'
	export default {
		components: {search,tuiModal,msgTip,bjxInput},
		data() {
			return {
				filters: {
					wbprefix: '',
					wbNo: '',
					mainBill: '',
					hawbBill: ''
				},
				chooseItem: {},
				// 弹窗提示
				modal: false,
				dialogMsg: '',
				animationData: {},
				dataFlag: false,
				wbInfo: {},
				form: {
					locationCode: '',//测试数据
					numCanIn: '',
					wgtCanIn: ''
				}
			}
		},
		// computed: {
		// 	...mapGetters(['dic'])
		// },
		// onReady () {
		// 	console.log(this.dic)
		// },
		methods: {
			//报关状态格式化
			formatWbStatus (status) {
				let match = this.$store.state.dic.WB_STATUS_EXIT.find(item => item.value === status)
				if (match) {
					return match.label
				} else {
					return status
				}
			},
			focus (e) {
				console.log('focus')
				uni.pageScrollTo({
				    scrollTop: 1000,
				    duration: 300
				})
				this.getWareList(e)
			},
			blur () {
				console.log('focus')
			},
			getWareList (e) {
				console.log('e', e)
				// 覆盖 value1
				let data2 = this.$store.state.dic.warehouse_dic
				if(!e.value){
						e.callback(data2)
				}else{
					this.form.targetKw = e.value
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
			clear () {
				//清空搜索框
				this.chooseItem = {}
				this.$refs.search.clear()
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
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
					postData.mainWb = this.form.mainWb
					postData.hawbWb = this.form.hawbWb
					if (this.form.kwId) {
						postData.locationId = this.form.kwId
					} else {
						postData.locationId = this.chooseItem.id
					}
					postData.actNum = Number(this.form.numCanIn)
					postData.actWgt = Number(this.form.wgtCanIn)
					storageIn(postData).then(res => {
						if (res.message) {
							this.$message(res.message)
						}
						if (res.status) {
							if (Number(this.form.numCanIn) ===  Number(this.wbInfo.numCanIn)) {
								uni.pageScrollTo({
									scrollTop: 0,
									duration: 300
								})
								this.$refs.search.clear()
								this.clear()
							} else {
								this.chooseItem = {}
								this.form.locationCode = ''
								this.form.kwId = ''
								this.getData()
							}			
						} else {
							this.chooseItem = {}
							this.form.locationCode = ''
							this.form.kwId = ''
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
				if (isEmpty(this.form.id)) {
					this.$message('请先查询运单信息')
				} else if (this.compare(0,this.form.numCanIn, true) ||  this.compare(0,this.form.wgtCanIn,true)) {
					this.$message('入库件数、重量必须大于零')
				} else if (Math.floor(Number(this.form.numCanIn)) !== Number(this.form.numCanIn)) {
					this.$message('入库件数必须为整数')
				} else if (!this.form.locationCode) {
					this.$message('请填写库位')
				} else if (!this.form.numCanIn) {
					this.$message('请填写件数')
				} else if (!this.form.wgtCanIn) {
					this.$message('请填写重量')
				} else if (Object.keys(this.chooseItem).length < 1) {
					let data2 = this.$store.state.dic.warehouse_dic
					let match = data2.find(item => item.locationCode === this.form.locationCode)
					if (match) {
						this.chooseItem = match
					} else {
						this.$message('未匹配到库位')
						return
					}
				} else {
					if (this.compare(this.form.numCanIn,this.form.preNum) && this.compare(this.form.wgtCanIn,this.form.preWgt)) {
						this.dialogMsg = '件数超出总件数,重量超出总重量,请确认是否继续入库'
					}
					else if(this.compare(this.form.numCanIn,this.form.preNum)) { //入库件数大于货物信息件数
						this.dialogMsg = '件数超出总件数,请确认是否继续入库'
					}
					else if(this.compare(this.form.wgtCanIn,this.form.preWgt)) { //入库重量大于货物重量
					    this.dialogMsg = '重量超出总重量,请确认是否继续入库'
					}
					else {
						this.dialogMsg = '确认信息无误，请点击确认入库'
						console.log(this.form)
					}
					this.modal = true
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
				console.log('主单号', this.filters.mainBill)
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
				this.$loading('加载中')
				let data = deepCopy(this.filters)
				data.mainHaWb = data.mainBill
				getWbInfo (data).then(res=> {
					uni.hideLoading()
					if (res.status) {
						this.dataFlag = true
						cartoon(this)
						this.form = {}
						this.form = res.data
						this.wbInfo = deepCopy(res.data)
						console.log(this.form, '测试')
					} else {
						this.$message('运单号不存在')
					}
				})
			},
			//跳转至仓库盘点
			gotoInventory(){
				console.log(this.filters)
				this.$loading('正在跳转到仓库盘点')
				let url = '../inventory/index?mainBill=' + this.filters.mainBill + '&hawbBill=' + this.filters.hawbBill
				setTimeout(() => {
					uni.reLaunch({
						url: url,
					})
					uni.hideLoading()
				}, 200)
			}
		}
	}
</script>

<style lang="scss">
	.exit {
		margin-top: 180rpx;
		// padding-bottom: 240rpx;
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
		margin-top: 180rpx;
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
					font-size: 15px;
					color: #595959;
					float: left;
				}
				.right{
					float: right;
					font-family: Roboto-Regular;
					height: 104rpx;
					line-height: 104rpx;
					font-size: 17px;
					color: #262626;
					text-align: right;
				}
			}
		}
		.btn-bottom{
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			margin-top: 83rpx;
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
		.bottom-text{
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			margin-top: 51rpx;
			// margin-bottom: 48rpx;
			margin-bottom: 168rpx;
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
			margin-top: 20upx;
			display: flex;
			flex-direction: row;
			border-radius: 5px;
			background: #FFFFFF;
			.content-text{
				font-family: SourceHanSansSC-Regular;
				font-size: 18px;
				color: #262626;
			}
			.content-text2{
				font-family: SourceHanSansSC-Regular;
				font-size: 15px;
				color: #a6a6a6;
			}
			.left{
				text-align: left;
				width: 50%;
				padding: 0 40rpx;
				display: flex;
				flex-direction: column;
			}
			.right{
				text-align: right;
				padding: 0 40rpx;
				width: 50%;
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>
