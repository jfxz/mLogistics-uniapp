<template>
	<view class="handover">
		<search ref="search" :timeFlag="true" holderText="请输入车牌号" @mainChange="mainChange" @timeChange="timeChange" @getData="getData"></search>
		<view v-if="dataFlag" :animation="animationData" class="changePosition">
			<view class="mid-msg">
				<view class="title">
					<view class="left" @click="changeTab('left')">
						<text :class="headFlag? 'head-click' : 'text-height'">待交接信息</text>
						<view class="cicle" v-show="headFlag"></view>
					</view>
					<view class="right" @click="changeTab('right')">
						<text :class="!headFlag? 'head-click' : 'text-height'">已交接信息</text>
						<view class="cicle" v-show="!headFlag"></view>
					</view>
				</view>
				<view v-if="contentFlag" class="image-content">
					<image style="height: 427rpx;" src="../../static/empty.png" mode="aspectFit"></image>
				</view>
				<view class="info-content" v-if="!contentFlag && headFlag">
					<evan-checkbox-group @change="onGroupChange" v-model="selectList">
						<view class="list-item" v-for="(item, index) in notHand"  :key="index">
							<view class="top-row">
								<image :src="index % 3 === 0? '../../static/logo1.png' : (index % 3 === 1? '../../static/logo2.png' : '../../static/logo2.png.png')" style="margin-top:45rpx; width: 34rpx;height: 34rpx;" mode="aspectFit"></image>
								<text>{{item.mainWb + item.hawbWb}}</text>
								<view style="margin-top:37rpx;float:right">
									<evan-checkbox primaryColor="#41c989" :label="item.id"></evan-checkbox>
								</view>
							</view>
							<view class="info-row">
								<view class="row-flex">
									<text class="label content-padding">件数</text>
									<text class="value" style="width: 110rpx;">{{item.num}}</text>
									<text class="label label2">航班号</text>
									<text class="value">{{item.carrier + item.flight}}</text>
								</view>
								<view class="row-flex">
									<text class="label content-padding">重量</text>
									<text class="value" style="width: 110rpx;">{{item.wgt}}</text>
									<text class="label label2">航班日期</text>
									<text class="value" style="width: 200rpx;">{{formatTime(item.flightDate)}}</text>
								</view>
							</view>
						</view>
					</evan-checkbox-group>
				</view>
				<view class="info-content" v-if="!contentFlag && !headFlag && alreadyHand.length > 0">
					<evan-checkbox-group @change="onGroupChange2" v-model="alreadyList">
						<view class="list-item" v-for="(item, index) in alreadyHand"  :key="index">
							<view class="top-row">
								<image :src="index % 3 === 0? '../../static/logo1.png' : (index % 3 === 1? '../../static/logo2.png' : '../../static/logo2.png.png')" style="margin-top:45rpx; width: 34rpx;height: 34rpx;" mode="aspectFit"></image>
								<text>{{item.mainWb + item.hawbWb}}</text>
								<view style="margin-top:37rpx;float:right">
									<evan-checkbox primaryColor="#41c989" :label="item.id"></evan-checkbox>
								</view>
							</view>
							<view class="info-row">
								<view class="row-flex">
									<text class="label content-padding">件数</text>
									<text class="value" style="width: 110rpx;">{{item.num}}</text>
									<text class="label label2">交接人</text>
									<text class="value">{{item.handOverName}}</text>
								</view>
								<view class="row-flex">
									<text class="label content-padding">重量</text>
									<text class="value" style="width: 110rpx;">{{item.wgt}}</text>
									<text class="label label2">交接时间</text>
									<text class="value" style="width: 200rpx;">{{formatTime(item.handOverTime)}}</text>
								</view>
							</view>
						</view>
					</evan-checkbox-group>
				</view>
			</view>
			<view class="bottom" v-if="!contentFlag && headFlag">
				<view class="bottom-title">
					<text class="text-bottom">添加备注</text>
					<view class="cicle"></view>
				</view>
				<view class="bottom-text">
					<view class="input-flex">
						<text class="left">交接人</text>
						<input  class="right" type="digit" v-model="form.handOverName" placeholder="请输入交接人"/>
					</view>
					<view class="input-flex">
						<text class="left">交接时间</text>
						<view @click="dateShow" style="width: 400rpx;" class="right">
						  <text>{{form.handOverTime}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<tui-datetime ref="dateTime" :type="1" cancelColor="#888" color="#5677fc" :setDateTime="setDateTime" @confirm="dateChange"></tui-datetime>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg">
		</tui-modal>
		<tui-modal :show="delModal" @cancel="hide('del')" :custom="true" :fadein="true">
			<view class="tui-modal-custom del">
				<image src="../../static/trash.png" mode="aspectFit"></image>
				<view class="delTitle">取消订单交接？</view>
				<view class="delMsg">
					运单状态将更新为出库
				</view>
				<view class="flex-btn">
					<button type="primary" class="btn cancel" plain="true" @tap="hide('del')">取消</button>
					<button type="primary" class="btn" plain="true" @tap="handleClick({index: 1})">确定</button>
				</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import search from '@/components/search.vue'
	import tuiModal from "@/components/modal"
	import msgTip from '@/components/tip/tip.vue'
	import EvanCheckbox from '@/components/evan-checkbox/evan-checkbox.vue'
	import EvanCheckboxGroup from '@/components/evan-checkbox/evan-checkbox-group.vue'
	import tuiDatetime from "@/components/dateTime/dateTime"
	import dayjs from '@/common/util/dayjs.min.js'
	import {getWbInfo,handOver,handOverCancel} from '@/common/api/exit/handover.js'
	import {deepCopy,isEmpty,cartoon} from '@/common/util/util.js'
	export default {
		components: {search,tuiModal,msgTip,EvanCheckbox,EvanCheckboxGroup,tuiDatetime},
		data() {
			return {
				// 弹窗提示
				modal: false,
				delModal: false,
				dialogMsg: '',
				headFlag: true,
				contentFlag: true,
				animationData: {},
				dataFlag: false,
				form: {handOverTime: dayjs().format('YYYY-MM-DD HH:mm:ss')},
				setDateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				notHand: [{value: '22'},{value: '666'},{value: '666'},{value: '666'},{value: '666'},{value: '666'},{value: '666'}],
				alreadyHand: [],
				selectList: [],
				alreadyList: [],
				filters: {
					carNo: '',
					outDate: dayjs().format('YYYY-MM-DD')
				}
			}
		},
		onReady() {
			
		},
		watch: {
		    headFlag: {
				handler(newVal, oldVal) {
					console.log('新值',newVal)
					this.$emit('updateWorld', newVal);
				},
				immediate: true,
				deep: true
			}
		 },
		methods:{
			//航班日期格式化
			formatTime(val) {
				if (val) {
					return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
				} else {
					return ''
				}
			},
			//监听车牌号变化
			mainChange(val) {
				console.log('车牌号',val)
				this.filters.carNo = val
			},
			//监听时间变化
			timeChange(val) {
				console.log('当前时间',val)
				this.filters.outDate = val
			},
			//关闭弹窗
			hide(val) {
				if (val === 'del') {
					this.delModal = false
				} else {
					this.modal = false
				}
			},
			handleClick(e) { // 点击确认交接或取消交接
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					if (this.headFlag) { //确认交接
						let postData = []
						this.notHand.forEach(item => {
							this.selectList.forEach(ids => {
								if (ids === item.id) {
									console.log(dayjs(this.form.handOverTime).valueOf(),this.form.handOverTime,'测试')
									item.handOverTime = dayjs(this.form.handOverTime).valueOf()
									item.handOverName = this.form.handOverName
									postData.push(item)
								}
							})
						})
						handOver(postData).then(res => {
							if (res.status) {
								this.$message(res.message)
							}
							this.modal = false
							this.getData()
						})
					} else { //取消交接
						let postData = []
						this.alreadyHand.forEach(item => {
							this.alreadyList.forEach(ids => {
								if (ids === item.id) {
									postData.push(item)
								}
							})
						})
						handOverCancel(postData).then(res => {
							if (res.status) {
								this.$message(res.message)
							}
							this.delModal = false
							this.getData()
						})
					}
				}
			},
			getData() {
				getWbInfo(this.filters).then(res => {
					if (res.status) {
						if (res.data.data.notHand.length === 0 && res.data.data.alreadyHand.length === 0) {
							this.$message('查无相关信息')
							this.contentFlag = true
						} else{
							this.dataFlag = true
							cartoon(this)
							this.contentFlag = false
							if (res.data.data.notHand.length === 0 && this.headFlag) {
								this.contentFlag = true
							}
							if (res.data.data.alreadyHand.length === 0 && !this.headFlag) {
								this.contentFlag = true
							}
							this.notHand = res.data.data.notHand
							this.alreadyHand = res.data.data.alreadyHand
						}
					} else {
						this.contentFlag = true
						this.$message(res.message)
					}
					console.log(res)
				})
			},
			save () {
				if (this.headFlag) { // 确认交接
					if (this.notHand.length === 0) {
						this.$message('请先查询运单信息')
					} else {
						if (this.selectList.length === 0) {
							this.$message('请先选择待交接信息')
						} else if (isEmpty(this.form.handOverName)) {
							this.$message('请先填写交接人')
						} else if (isEmpty(this.form.handOverTime)) {
							this.$message('请先填写交接时间')
						} else {
							this.dialogMsg = '确认信息无误，点击确认进行交接'
							this.modal = true
						}
					}
				} else { //取消交接
					if (this.alreadyHand.length === 0) {
						this.$message('请先查询运单信息')
					} else {
						if (this.alreadyList.length === 0) {
							this.$message('请先选择已交接信息')
						} else {
							// this.dialogMsg = '确认信息无误，点击确认取消交接'
							this.delModal = true
						}
					}
				}
			},
			clear() {
				this.headFlag =  true,
				this.contentFlag = true,
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
				this.notHand = []
				this.alreadyHand = []
				this.alreadyList =  [],
				this.selectList = []
				this.form =  {handOverTime: dayjs().format('YYYY-MM-DD HH:mm:ss')},
				this.$refs.search.clear()
			},
			changeTab(val) {
				console.log(val)
				if (val === 'left') {
					this.headFlag = true
					if (this.notHand.length === 0) {
						this.contentFlag = true
					} else {
						this.contentFlag = false
					}
				} else {
					this.headFlag = false
					if (this.alreadyHand.length === 0) {
						this.contentFlag = true
					} else {
						this.contentFlag = false
					}
				}
			},
			onGroupChange(e) {
				console.log(e)
				this.selectList = e
			},
			onGroupChange2(e) {
				console.log(e)
				this.alreadyList = e
			},
			//显示时间选择组件
			dateShow() {
			  this.$refs.dateTime.show()
			},
			//赋值交接时间
			dateChange(val) {
			  console.log(val)
			  this.form.handOverTime = val.result
			  this.setDateTime = val.result
			},
		}
	}
</script>

<style lang="scss">
	.handover {
		margin-top: 250rpx;
		border-radius: 10rpx;
		.changePosition{
			position: absolute;
			width: 100%;
			left: 720px;
			margin-bottom: 120rpx;
		}
		.mid-msg{
			margin: 0 25rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			.title{
				height: 135rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 31rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 135rpx;
				letter-spacing: 2rpx;
				color: #8c8c8c;
				border-bottom: solid 1rpx #e1e5e4;
				display: flex;
				flex-direction: row;
				.left{
					display: flex;
					flex-direction: column;
					padding-left: 29rpx;
					width: 240rpx;
					text{
						margin-bottom: 0;
						padding-bottom: 0;
					}
				}
				.text-height{
					line-height: 135rpx;
				}
				.right {
					display: flex;
					flex-direction: column;
					width: 240rpx;
				}
				.cicle {
					padding-top: 0;
					margin-top: 0;
					height: 11rpx;
					background-color: #ffd907;
					border-radius: 5rpx;
					width: 200rpx;
				}
				.head-click {
					padding-top: 30rpx;
					font-family: FZZYJW--GB1-0;
					font-size: 38rpx;
					letter-spacing: 2rpx;
					background-image: linear-gradient(#3ace6e, #41c989);
					-webkit-background-clip: text;
					color: transparent;
				}
			}
			.image-content{
				height: 427rpx;
			}
			.info-content{
				display: flex;
				flex-direction: column;
				.list-item{
					height: 292rpx;
					border-bottom: solid 1rpx #e1e5e4;
					.top-row{
						padding:0 29rpx;
						height: 34rpx;
						// display: flex;
						// flex-direction: row;
						text{
							margin-top: 45rpx;
							margin-left: 28rpx;
							font-family: Roboto-Medium;
							font-size: 38rpx;
							font-weight: normal;
							font-stretch: normal;
							letter-spacing: 0rpx;
							color: #262626;
							line-height: 34rpx;
						}
					
					}
					.info-row {
						margin-top: 50rpx;
						display: flex;
						flex-direction: column;
						.row-flex{
							margin-top: 30rpx;
							display: flex;
							flex-direction: row;
							.content-padding{
								padding-left: 80rpx;
							}
							.label{
								margin-top: 5rpx;
								font-family: SourceHanSansSC-Regular;
								font-size: 29rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 1rpx;
								color: #a6a6a6;
								width: 80rpx;
							}
							.value{
								font-family: Roboto-Regular;
								font-size: 31rpx;
								font-weight: normal;
								font-stretch: normal;
								letter-spacing: 2rpx;
								color: #404040;
								width: 100rpx;
								text-align: left;
							}
							.label2{
								width: 135rpx;
							}
						}
					}
				}
			}
		}
		.bottom {
			margin: 0 25rpx;
			margin-top:31rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			.bottom-title{
				padding: 0 28rpx;
				font-family: SourceHanSansSC-Regular;
				font-size: 38rpx;
				height: 107rpx;
				letter-spacing: 0rpx;
				color: #262626;
				border-bottom: solid 1rpx #e1e5e4;
				display: flex;
				flex-direction: column;
				.text-bottom{
					padding-top: 20rpx;
				}
				.cicle {
					height: 11rpx;
					background-color: #ffd907;
					border-radius: 5rpx;
					width: 150rpx;
				}
			}
			.input-flex{
				padding: 0 28rpx;
				border-bottom: 1px solid #e1e5e4;
				height: 104rpx;
				line-height: 104rpx;
				.left{
					font-family: SourceHanSansSC-Regular;
					font-size: 15px;
					color: #262626;
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
				margin-left: -88rpx;
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
</style>
