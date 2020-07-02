<template>
	<view class="exitGoods">
		<search ref="search" :billFlag="true" @mainChange="mainChange" @getData="getData"></search>
		<view :animation="animationData" v-if="dataFlag" class="changePosition">
			<view class="exitGoods-top">
				<view class="top-text">
					<text>运单信息</text>
				</view>
				<view class="top-info">
					<view class="detail-flex">
						<view class="content" style="text-align: left;">
							<view class="value">
								{{form.specialCodes || ''}}
							</view>
							<view class="label">
								处理代码
							</view>
						</view>
						<view class="content">
							<view class="value status">
								{{formatWbStatus(form.wbStatus) || ''}}
							</view>
							<view class="label">
								运单状态
							</view>
						</view>
						
						<view class="content" style="text-align: right;">
							<view class="value">
								<!-- 3 -->
								{{form.actNum || ''}}
							</view>
							<view class="label">
								总件数
							</view>
						</view>
					</view>
					<view class="detail-flex">
						<view class="content" style="text-align: left;">
							<view class="value">
							<!-- 	4 -->
								{{form.preWgt || ''}}
							</view>
							<view class="label">
								预录入毛重
							</view>
						</view>			
						<view class="content">
							<view class="value">
								<!-- 6 -->
								{{form.size || ''}}
							</view>
							<view class="label">
								体积
							</view>
						</view>
						<view class="content" style="text-align: right;">
							<view class="value">
								<!-- 5 -->
								{{form.feeWgt || ''}}
							</view>
							<view class="label">
								已缴费重量
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="bottom-title">
					<text>发货信息</text>
				</view>
				<view class="input-flex">
					<text class="left">航班号</text>
					<input class="right" placeholder-class="placeholder-font" placeholder="航司" style="margin-left: 200rpx;text-align: center;width: 150rpx;border-right:solid 1rpx #e6e6e6;" type="text"  v-model="info.carrier"/>
					<input class="right" placeholder-class="placeholder-font" placeholder="航班" style="width: 100rpx;" type="text" v-model="info.flight"/>
				</view>
				<view class="input-flex">
					<text class="left">航班日期</text>
					<picker mode="date" :value="info.flightDate" @change="bindDateChange">
						<view style="width: 300rpx;height: 100%;text-align:right;" class="right">{{info.flightDate}}</view>
					</picker>
				</view>
				<view class="input-flex">
					<text class="left">出库件数</text>
					<input class="right" placeholder-class="placeholder-font" type="number" v-model="info.num" placeholder="请输入出库件数"/>
				</view>
				<view class="input-flex">
					<text class="left">出库重量</text>
					<input class="right" placeholder-class="placeholder-font" type="number" v-model="info.wgt" placeholder="请输入出库重量"/>
				</view>
				<view class="input-flex">
					<text class="left">出库人</text>
					<input class="right" placeholder-class="placeholder-font" type="text" v-model="info.name" placeholder="请输入出库人"/>
				</view>
				<view class="input-flex">
					<text class="left">出库人证件号码</text>
					<input class="right" placeholder-class="placeholder-font" type="idcard" v-model="info.idCard" placeholder="请输入证件号码"/>
				</view>
				<view class="input-flex">
					<text class="left">出库车牌号码</text>
					<input class="right" placeholder-class="placeholder-font" type="text" v-model="info.carNo" placeholder="请输入车牌号码"/>
				</view>
				<view class="input-flex">
					<text class="left">出库备注</text>
					<input class="right" placeholder-class="placeholder-font" type="text" v-model="info.comment" placeholder="请输入出库备注"/>
				</view>
			</view>
		</view>
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="dialogMsg"></tui-modal>
	</view>
</template>

<script>
	import search from '@/components/search.vue'
	import {getWbInfo,outWb,cancelOut} from '@/common/api/exit/exitGoods.js'
	import dayjs from '@/common/util/dayjs.min.js'
	import {isEmpty,deepCopy,cartoon} from '@/common/util/util.js'
	import tuiModal from "@/components/modal"
	// import { mapGetters } from 'vuex'
	export default {
		components:{search,tuiModal},
		data() {
			return {
				modal: false,
				dialogMsg: '',
				filters: {
					mainBill: ''
				},
				animationData: {},
				dataFlag: false,
				form: {
					specialCodes: '',
					actNum: '',
					preWgt: '',
					feeWgt: '',
					size: '',
					wbStatus: ''
				},
				info: {
					// flight: '',
					flightDate : dayjs().format('YYYY-MM-DD')
				}
			} 
		},
		watch: {
		    'form.wbStatus': {
				handler(newVal, oldVal) {
					console.log('新值',newVal)
					this.$emit('updateWorld', newVal);
				},
				immediate: true,
				deep: true
			}
		 },
		// computed: {
		// 	...mapGetters(['dic'])
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
			//确认出库
			save () {
				if (this.form.wbStatus === '3') {//已出库
					if (isEmpty(this.form.id)) {
						this.$message('请先查询运单信息')
					} else {
						this.dialogMsg = '确认取消入库？点击确认即可取消入库'
						this.modal = true
					}
				} else {
					if (isEmpty(this.form.id)) {
						this.$message('请先查询运单信息')
					} else if (isEmpty(this.info.flight)) {
						this.$message('航班号不允许为空')
					} else if (isEmpty(this.info.flightDate)) {
						this.$message('航班日期不允许为空')
					} else if (isEmpty(this.info.num)) {
						this.$message('出库件数不允许为空')
					} else if (isEmpty(this.info.wgt)) {
						this.$message('出库重量不允许为空')
					} else if (isEmpty(this.info.name)) {
						this.$message('出库人不允许为空')
					} else if (isEmpty(this.info.idCard)) {
						this.$message('出库人证件号码不允许为空')
					} else if (isEmpty(this.info.carNo)) {
						this.$message('出库车牌号码不允许为空')
					} else {
						if (this.compare(0,this.info.num, true) || this.compare(0,this.info.wgt,true)) {
							this.$message('出库件数、重量必须大于零')
						} else if (Math.floor(Number(this.info.num)) !== Number(this.info.num)) {
							this.$message('出库件数必须为整数')
						} else if (this.compare(this.info.num,this.form.actNum) || this.compare(this.form.wgt,this.form.actWgt)) {
							this.$message('货物件数/重量与总件数/重量不符，无法出库，请核查')
							// if(this.compare(this.info.num,this.form.actNum)) { //入库件数大于货物信息件数
							// 	this.dialogMsg = '件数超出总件数,请确认是否继续出库'
							// }
							// else if(this.compare(this.info.wgt,this.form.actWgt)) { //入库重量大于货物重量
							// 	this.dialogMsg = '重量超出总重量,请确认是否继续出库'
							// }
							// else if () {
							// 	this.dialogMsg = 
							// }
						} else {
							this.dialogMsg = '确认信息无误，请点击确认出库'
							console.log(this.info)
							this.modal = true
						}
					}
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
			hide() {
				this.modal = false
			},
			handleClick(e) { // 点击确认出库
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					if (this.form.wbStatus === '3') {
						this.modal = false
						let data = deepCopy(this.form)
						cancelOut(data).then(res => {
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
							this.$refs.search.clear()
							this.clear()
							if (res.message) {
								this.$message(res.message)
							}
						})
					} else {
						this.modal = false
						let data = deepCopy(this.info)
						data.flightDate = dayjs(data.flightDate).valueOf()
						data.num = Number(data.num)
						data.wgt = Number(data.wgt)
						data.wbId = this.form.id
						data.mainWb = this.form.mainWb
						data.hawbWb = this.form.hawbWb
						outWb(data).then(res => {
							uni.pageScrollTo({
								scrollTop: 0,
								duration: 300
							})
							this.$refs.search.clear()
							this.clear()
							if (res.message) {
								this.$message(res.message)
							}
						})
					}
				}
			},
			//清空
			clear () {
				this.$refs.search.clear()
				Object.keys(this.info).forEach(item => {
					console.log(item)
					if (item === 'flightDate') {
						this.info[item] = dayjs().format('YYYY-MM-DD')
					} else {
						this.info[item] = ''
					}
				})
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
			},
			getData () {
				let data = deepCopy(this.filters)
				data.mainHaWb = data.mainBill
				getWbInfo(data).then(res => {
					console.log(res)
					if (res.status) {
						this.from = {}
						this.dataFlag = true
						cartoon(this)
						this.form = res.data
					} else {
						this.$message('运单号不存在')
					}
				})
				// console.log(this.filters)
			},
			//时间选择
			bindDateChange(e) {
				this.info.flightDate =  e.target.value
			},
			// 主单号赋值
			mainChange (val) {
				this.filters.mainBill = val
			}
			 
		}
	}
</script>

<style lang="scss">
	.exitGoods{
		margin-top: 180rpx;
		margin-bottom: 120rpx;
		border-radius: 10rpx;
		.changePosition{
			position: absolute;
			width: 100%;
			left: 720px;
		}
		.exitGoods-top{
			height: 422rpx;
			margin: 0 25rpx;
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			.top-text{
				height: 104rpx;
				padding-left: 20rpx;
				font-family: SourceHanSansSC-Medium;
				font-size: 38rpx;
				font-weight: normal;
				font-stretch: normal;
				line-height: 104rpx;
				letter-spacing: 0rpx;
				color: #262626;
				border-bottom: solid 1rpx #d9d9d9;;
			}
			.top-info{
				display: flex;
				flex-direction: column;
				.detail-flex {
					display: flex;
					flex-direction: row;
					.content {
						display: flex;
						flex-direction: column;
						width: 33%;
						.label {
							text-align: center;
							font-size: 29rpx;
							color: #a6a6a6;
						}
						.value {
							height: 45rpx;
							margin-top: 40rpx;
							font-size: 35rpx;
							color: #262626;
							text-align: center;
							&.status {
								color: #007aff;
							}
						}
					}
				}
			}
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
				font-family: Roboto-Regular;
				height: 104rpx;
				line-height: 104rpx;
				font-size: 35rpx;
				color: #262626;
				text-align: right;
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
				font-family: SourceHanSansSC-Regular;
				background-color: #f5f5f5;
				border-radius: 46rpx;
			}
		}
		.placeholder-font{
			font-size: 28rpx;
			color: #bfbfbf;
		}
		.bottom{
			width: calc(100% - 50rpx);
			margin: 20rpx 25rpx 120rpx 25rpx;
			background: #FFFFFF;
			.bottom-title {
				font-size: 38rpx;
				padding-left: 28rpx;
				border-bottom: 1px solid #e1e5e4;
				height: 104rpx;
				line-height: 104rpx;
				color: #262626;
			}
		}
	}
</style>
