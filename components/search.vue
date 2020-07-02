<template>
	<view :class="billFlag? 'search-class search-class2' : 'search-class'" :style="sty? 'top: 130rpx': 'top:320rpx'">
		<view class="input-class">
			<input placeholder-style="font-size: 35rpx;color: #bfbfbf;margin-top: 25rpx;" class="uni-input input1" :value="mainBill" @input="mainChange" @blur="mainBlur" :placeholder="holderText.length > 0? holderText : '请扫描/输入主单号'"/>
			<text class="uni-icon" style="line-height: 2.3;" v-if="showMainClearIcon" @click="clearMainIcon">&#xe434;</text>
		</view>
		
		<view class="input-class" v-if="!billFlag && !timeFlag">
			<input placeholder-style="font-size: 35rpx;color: #bfbfbf;margin-top: 25rpx;" class="uni-input input2" :value="hawbBill" @blur="hawBlur" @input="hawbChange" placeholder="请扫描/输入分单号"/>
			<text class="uni-icon" style="line-height: 2.3;" v-if="showHawbClearIcon" @click="clearHawbIcon">&#xe434;</text>
		</view>
		<view class="input-class" v-if="timeFlag">
			<picker mode="date" class="pick-text" :value="time" @change="bindTimeChange">
				<view class="pick-input input2" :style="time? '' : 'color: #bfbfbf;'">{{time || '请选择出库日期'}}</view>
			</picker>
			<!-- <input class="uni-input input2" :value="hawbBill" @input="hawbChange" placeholder="请选择日期"/> -->
			<text class="uni-icon" style="line-height: 2.3;" v-if="showTimeClearIcon" @click="clearTimeIcon">&#xe434;</text>
		</view>
		<view class="search">
			<button type="primary" @tap="getData">搜索</button>
		</view>
	</view>
</template>	
<script>
	import {
	  deepCopy, model7
	} from '@/common/util/util.js'
	import dayjs from '@/common/util/dayjs.min.js'
	export default {
		props: {
			sty:{
				type: Boolean,
				default: () => false
			},
			billFlag:{
				type: Boolean,
				default: () => false
			},
			timeFlag: {
				type: Boolean,
				default: () => false
			},
			holderText: {
				type: String,
				default: ''
			}
		},
		watch: {
			time: {
			     handler(newValue, oldValue) {
			      if (newValue.length > 0) {
			      	this.showTimeClearIcon = true
			      }
			    },
				deep: true,
				immediate: true
			},
			// mainBill: {
			//      handler(newValue, oldValue) {
			//       console.log(newValue,'改变')
			//     },
			// 	deep: true,
			// 	immediate: true
			// }
		},
		data() {
			return {
				addMainBill: '', //记录传进来逐字增加的主单原始值
				addHawBill: '',//记录传进来逐字增加的分单原始值
				mainBill: '', //主单号或车牌号
				hawbBill: '',
				time: dayjs().format('YYYY-MM-DD'), //时间
				showMainClearIcon: false,
				showHawbClearIcon: false,
				showTimeClearIcon: false,
				timeDaly: 60, //单字符不受影响时的增加或消失毫秒数
				checkFlag: true ,//标志运单是否符合规则
			}
		},
		onLoad() {
			console.log(this.billFlag,'标志')
		},
		methods: {
			//清空时间
			clearTimeIcon () {
				this.deleteTime(this.time)
			},
			//时间逐字消失并可同步车牌号
			deleteTime (time,mainlen,timeLength) {
				if (time) {
					if (time.length > 0) {
						if(!timeLength) {
							let timeLength = time.length
						}
						let showTime = ''
						let timeDaly = this.timeDaly
						let timeLength = time.length
						if (mainlen) {
							if (mainlen > 0) {
								timeDaly = (mainlen * timeDaly) / timeLength
							}
						}
						showTime = time.substring(0, timeLength - 1)
						this.setTime(showTime)
						console.log(timeDaly, 'showTime')
						setTimeout(() => {
							this.clearTimeIcon(time,mainlen,timeLength)
						}, timeDaly)
					}
				}
			},
			// 清空主单、分单
			clearMainIcon () {
				this.deleteMain(this.mainBill)
				this.$emit('mainChange','')
			},
			clearHawbIcon () {
				this.deleteHaw(this.hawbBill)
				this.$emit('hawChange','')
			},
			clear () {
				this.addHawBill = ''
				this.addMainBill = ''
				this.checkFlag = true
				let mainlen = this.mainBill.length
				let hawlen = this.hawbBill.length
				let timeLength = this.time.length
				if (this.timeFlag) {
					this.deleteTime(this.time,mainlen,timeLength)
				} else {
					this.deleteHaw(this.hawbBill,mainlen,hawlen)
				}
				this.deleteMain(this.mainBill)
				this.$emit('mainChange','')
				this.$emit('hawChange','')
				this.$emit('timeChange','')
			},
			 bindTimeChange: function(e) {
				console.log(e,'时间')
				this.time = e.target.value
				this.$emit('timeChange',this.time)
			},
			//主单赋值供主组件调用
			setMainData(main) {
				this.mainBill = main
				if (this.mainBill.length > 0) {
					this.showMainClearIcon = true
				} else {
					this.showMainClearIcon = false
				}
			},
			setHawData(haw){
				this.hawbBill = haw
				if (this.hawbBill.length> 0) {
					this.showHawbClearIcon = true
				} else {
					this.showHawbClearIcon = false
				}
			},
			setTime (showTime) {
				this.time = showTime
				if (this.time.length > 0) {
					this.showTimeClearIcon = true
				} else {
					this.showTimeClearIcon = false
				}
			},
			// 主单、分单改变监听
			mainChange (val) {
				this.mainBill = val.target.value
				// this.mainBill = val.target.value.toLocaleUpperCase()
				if (val.detail.value.length > 0) {
					this.showMainClearIcon = true;
				} else {
					this.showMainClearIcon = false;
				}
				this.maniSetData(val.target.value.toLocaleUpperCase())
				
			},
			// 运单号检测
			mainBlur (val) {
				this.mainBill = this.mainBill.toLocaleUpperCase()
				if (this.holderText === '') { //为运单号时
					if (this.mainBill.length === 10 || this.mainBill.length === 11) {
						let wbPrefix = (this.mainBill.substring(0, this.mainBill.length - 8))
						let wbNo = this.mainBill.substring(this.mainBill.length - 8, this.mainBill.length)
						this.mainBill = wbPrefix + wbNo
						if (!model7(wbPrefix, wbNo) || wbNo.length !== 8) {
							// setTimeout(() => {
								this.checkFlag = false
								this.deleteMain(this.mainBill)
								this.maniSetData('')
								this.$message('运单号不符合规范')
								this.showMainClearIcon = false
								// this.$forceUpdate()
							// })
						} else {
							// setTimeout(() => {
								this.checkFlag = true
								this.$forceUpdate()
							// },50)	
						}
					} else {
						this.mainBill = this.mainBill.toLocaleUpperCase()
						this.checkFlag = false
						// setTimeout(() => { 
							this.deleteMain(this.mainBill)
							this.maniSetData('')
							this.showMainClearIcon = false
							// this.$forceUpdate()
							this.$message('运单号不符合规范')
						// }, 50)	
					}
				}
				// } else { //车牌号
					// setTimeout(() => {
						// this.mainBill = val.detail.value.toLocaleUpperCase()
						// this.maniSetData(this.mainBill)
						// this.$forceUpdate()
					// }, 50)
				// }
			},
			hawBlur (val) {
				setTimeout(() => {
					this.hawSetData(val.detail.value.toLocaleUpperCase())
					this.$forceUpdate()
				}, 50)
			},
			maniSetData (val) {
				this.$emit('mainChange',val)
			},
			hawSetData (val) {
				this.$emit('hawChange',val)
			},
			hawbChange (val) {
				if (val.detail.value.length > 0) {
				    this.showHawbClearIcon = true;
					this.hawSetData(val.detail.value)
				} else {
				    this.showHawbClearIcon = false;
					this.hawSetData(val.detail.value)
				}
				this.hawbBill = val.detail.value.toLocaleUpperCase()
			},
			getData() {
				setTimeout(() => {
					if (this.checkFlag) {
						this.$emit('getData')
					} else {
						this.$message('运单号不符合规范')
					}
				},100)
			},
			//主单号逐字增加
			addMain(mainBill,index) {//主单,计时器,调用时只传一个主单号
				if (mainBill && !index) {
					this.addMainBill = mainBill
				}
				if (!index) {
					index = 0
				}
				if (mainBill) {
					let mainlen = this.addMainBill.length //60*9 = 540毫秒
					if (index < mainlen) { //主单逐字增加
						let showMain = ''
						showMain = this.addMainBill.substring(0, index + 1)
						this.setMainData(showMain)
						setTimeout(() => {
							this.addMain(showMain,index + 1)
						}, this.timeDaly)
					}
				}
			},
			//分单号逐字增加,并可同步主单增加
			addHaw(hawBill,mainBill,index) {//调用时只传分单号,主单号
				if (hawBill && !index) {
					this.addHawBill = hawBill
				}
				if (!index) {
					index = 0
				}
				if (hawBill) {
					let timeDaly = this.timeDaly
					let hawlen = this.addHawBill.length //60*9 = 540毫秒
					if (mainBill) {
						if (mainBill.length > 0 && hawlen> 0) {
							timeDaly = (mainBill.length * timeDaly) / hawlen
						}
					}
					if (index < hawlen) { //分单逐字增加
						let showHaw = ''
						showHaw = this.addHawBill.substring(0, index + 1)
						this.setHawData(showHaw)
						setTimeout(() => {
							this.addHaw(showHaw,mainBill,index + 1)
						}, timeDaly)
					}
				}
			},
			//主单号逐字消失
			deleteMain(mainBill) {
				if (mainBill) {
					if (mainBill.length > 0) {
						let mainlen = mainBill.length //60*9 = 540毫秒
						let showMain = ''
						showMain = mainBill.substring(0, mainlen - 1)
						this.setMainData(showMain)
						setTimeout(() => {
							this.deleteMain(showMain)
						}, this.timeDaly)
					}
				}
			},
			//分单号逐字消失并可同步主单号
			deleteHaw(hawBill,mainlen,hawLength) {
				if (hawBill) {
					if (hawBill.length > 0) {
						if(!hawLength) {
							let hawLength = hawBill.length
						}
						let showHaw = ''
						let timeDaly = this.timeDaly
						let hawlen = hawBill.length
						if (mainlen) {
							if (mainlen > 0) {
								timeDaly = (mainlen * timeDaly) / hawLength
							}
						}
						showHaw = hawBill.substring(0, hawlen - 1)
						this.setHawData(showHaw)
						setTimeout(() => {
							this.deleteHaw(showHaw,mainlen,hawLength)
						}, timeDaly)
					}	
				}
			},
			//单号逐字消失
			show(mainBill,hawBill) {
				if (!mainBill) {
					mainBill = ''
				}
				if (!hawBill) {
					hawBill = ''
				}
				let _this = this
				let mainlen = mainBill.length
				let hawlen = hawBill.length
				let timeDaly = this.timeDaly
				if (mainlen > 0 || hawlen > 0) {
					if (mainlen > hawlen) { //主单长度大于分单长度
						let showMain = ''
						showMain = mainBill.substring(0, mainlen - 1)
						_this.setMainData(showMain)
						setTimeout(() => {
							_this.show(showMain,hawBill)
						}, timeDaly)
					} else if (mainlen === hawlen) { //主单长度等于分单长度
						let showMain = ''
						let showHaw = ''
						showMain = mainBill.substring(0, mainlen - 1)
						showHaw = hawBill.substring(0, hawlen - 1)
						_this.setMainData(showMain)
						_this.setHawData(showHaw)
						setTimeout(() => {
							_this.show(showMain,showHaw)
						}, timeDaly)
					} else { //主单长度小于分单长度
						let showHaw = ''
						showHaw = hawBill.substring(0, hawlen - 1)
						_this.setHawData(showHaw)
						setTimeout(() => {
							_this.show(mainBill,showHaw)
						}, timeDaly)
					}
				}			
			},
		}
	}
</script>

<style lang="scss">
	.search-class2{
		height: 355rpx;
	}
</style>
