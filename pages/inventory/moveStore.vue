<template>
	<view class="moveEdit">
		<arrow name="移库"></arrow>
		<view class="billMsg">
			<view class="mian">
				<view class="img">
					<image src="../../static/hawb.png" mode="aspectFit"></image>
				</view>
				<view class="msg">
					<view class="value">
						{{form.mainBill || ''}}
					</view>
					<view class="label">
						主单号
					</view>
				</view>
			</view>
			<view class="line">
			</view>
			<view class="haw">
				<view class="img">
					<image src="../../static/main.png" mode="aspectFit"></image>
				</view>
				<view class="msg">
					<view class="value">
						{{form.hawbBill || ''}}
					</view>
					<view class="label">
						分单号
					</view>
				</view>
			</view>
		</view>
		<view class="store">
			<view class="msg">
				<view class="label">
					处理代码
				</view>
				<view class="value read">
					{{form.special_code || ''}}
				</view>
			</view>
			<view class="msg">
				<view class="label">
					报关状态
				</view>
				<view class="value read">
					{{formatDeclare(form.declare_status)}}
				</view>
			</view>
			<view class="msg">
				<view class="label">
					原仓库
				</view>
				<view class="value read">
					{{form.WAREHOUSE_CODE || ''}}
				</view>
			</view>
			<view class="msg">
				<view class="label">
					原库位
				</view>
				<view class="value read">
					{{form.LOCATION_ID || ''}}
				</view>
			</view>
			<view class="msg">
				<view class="label">
					移库件数<text>(必填)</text>
				</view>
				<view class="value">
					<input type="number" :value="form.number" @input="numberChange"/>
				</view>
			</view>
			<view class="msg">
				<view class="label">
					移库重量<text>(必填)</text>
				</view>
				<view class="value">
					<input type="number" :value="form.weight" @input="weightChange"/>
				</view>
			</view>
			<view class="msg last">
				<view class="label">
					目标库位<text>(必填)</text>
				</view>
				<view class="value">
					<bjx-input the-style="width: 200rpx;height:111rpx;font-size: 35rpx;color: #262626;" itemStyle="bottom:110rpx" ref='inputs1' :value="form.targetKw" placeholder=' ' @list="getWareList"
					@select="selectItem" @focus="focus" @blur="blur" itemKey="locationCode">
								
						</bjx-input>
					<!-- {{form.targetKw}} -->
					<!-- <picker @change="targetChange" :value="index" :range="targetArray">
						<view class="picker-text">{{targetArray[index]}}</view>
					</picker> -->
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="btn_left" @tap="cancal">
				<image src="../../static/cancel.png" mode="aspectFit"></image>
				<text>取消</text>
			</view>
			<view class="btn_right" @tap="save">
				保存
				<!-- <button type="primary" @tap="save">保存</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	// import { mapGetters } from 'vuex'
	import {moveSave} from '@/common/api/inventory/inventory.js'
	import arrow	from '@/components/arrow/arrow.vue'
	import bjxInput from '@/components/bjx-inputs.vue'
	export default {
		components: {arrow, bjxInput},
		data() {
			return {
				chooseItem: {},
				index: -1,
				form: {
					wb_prefix: '',
					wb_no: '',
					special_code: '',
					declare_status: '',
					WAREHOUSE_CODE: '',
					LOCATION_ID: '',
					weight: '',
					number: '',
					targetKw: ''
				}
			}
		},
		onShow () {
			this.form = getApp().globalData.wbInfo
			// this.$set(this.form, 'targetKw', '')
			// console.log('00', JSON.stringify(getApp().globalData.wbInfo) )
			console.log(11, JSON.stringify(getApp().globalData.chooseItem))
			// if (getApp().globalData.chooseItem.locationCode) {
			// 	this.chooseItem = getApp().globalData.chooseItem
			// 	this.form.targetKw = getApp().globalData.chooseItem.locationCode
			// }
			
		},
		computed: {
			// ...mapGetters(['dic'])
		},
		methods: {
			focus (e) {
				this.chooseItem = null
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
					this.form.targetKw = (e.value)
						let data = []
						
						data2.forEach(item=>{
								if(item.locationCode.toLowerCase().indexOf(e.value.toLowerCase()) > -1){
										data.push(item)
								}
						})
						e.callback(data)
				}
			},
			selectItem (val) {
				this.chooseItem = val
				this.form.targetKw = val.locationCode
				console.log(val)
			},
			formatDeclare (status) {
				let match = this.$store.state.dic.DECLARE_STATUS.find(item => item.value === status)
				if (match) {
					return match.label
				}
			},
			jumpChoose () {
				uni.navigateTo({
					url: './storeSelect'
				})
			},
			save () {
				if (!this.form.weight) {
					this.$message('移库重量不能为空')
					return
				}
				if (!this.form.number) {
					this.$message('移库件数不能为空')
					return
				}
				if (!this.form.targetKw) {
					this.$message('目标库位不能为空')
					return
				}
				if (this.form.weight <= 0) {
					this.$message('移库重量需大于0')
					return
				}
				if (this.form.number <= 0) {
					this.$message('移库件数需大于0')
					return
				}
				if (this.form.weight > this.form.wgt_total) {
					this.$message('移库重量大于总重量')
					return
				}
				if (this.form.number > this.form.num_total) {
					this.$message('移库件数大于总件数')
					return
				}
				if (!this.chooseItem) {
					let data2 = this.$store.state.dic.warehouse_dic
					let match = data2.find(item => item.locationCode === this.form.targetKw)
					if (match) {
						this.chooseItem = match
					} else {
						this.$message('未匹配到库位')
						return
					}
				}
				if (this.chooseItem.locationAttribute !== this.form.special_code) {
					this.$message('库位属性不符')
					return
				}
				let para = {
					wbId: this.form.id,
					number: Number(this.form.number),
					weight: Number(this.form.weight),
					oldLocationId: this.form.locatId,
					locationId: this.chooseItem.id
				}
				this.$loading('保存中')
				moveSave(para).then(res => {
					if (res.status) {
						this.$message(res.message)
						uni.navigateBack()
					} else {
						this.$message(res.message)
					}
					uni.hideLoading()
				})
				console.log(para)
			},
			cancal () {
				uni.navigateBack()
			},
			targetChange (val) {
				this.index = val.target.value
				this.form.targetKw = this.targetArray[this.index]
			},
			targetKwChange (val) {
				this.form.targetKw = val.target.value
			},
			weightChange (val) {
				this.form.weight =  Number(val.target.value)
			},
			numberChange (val) {
				this.form.number = Number(val.target.value)
			}
		}
	}
</script>

<style lang="scss">
.moveEdit {
	background: linear-gradient(#3ace6e, white);
	height: 100vh;
	.store {
		height: 777rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		padding: 0 35rpx;
		margin: 0 25rpx;
		margin-bottom: 100rpx;
		.msg {
			display: flex;
			justify-content: space-between;
			height: 111rpx;
			border-bottom: solid 1rpx #d9d9d9;
			&.last {
				border: 0
			}
			.label {
				line-height: 111rpx;
				font-size: 31rpx;
				color: #595959;
				text {
					color: #a6a6a6;
				}
			}
			.value {
				line-height: 111rpx;
				font-size: 35rpx;
				color: #262626;
				&.read {
					color: #a6a6a6;
				}
				.picker-text {
					font-size: 35rpx;
					color: #262626;
					width: 200rpx;
					text-align: right;
					height: 111rpx;
					line-height: 111rpx;
				}
				input {
					text-align: right;
					height: 111rpx;
					line-height: 111rpx;
				}
			}
		}
		
		
	}
	.billMsg {
		display: flex;
		justify-content: space-around;
		height: 238rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 25rpx;
		margin-top: 40rpx;
		overflow-x: hidden;
		.line {
			width: 1rpx;
			height: 123rpx;
			background-color: #d9d9d9;
			position: relative;
			top: 50%;
			transform: translateY(-50%);
		}
		.mian {
			width: 50%;
		}
		.haw {
			width: 50%;
		}
		.msg {
			position: relative;
			left: 80rpx;
			top: 15rpx;
		}
		.img {
			position: relative;
			left: 10rpx;
			top: 90rpx;
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
		.value {
			letter-spacing: 2rpx;
			color: #262626;
			font-size: 38rpx;
			line-height:33rpx;
			height:33rpx;
		}
		.label {
			letter-spacing: 1rpx;
			color: #a6a6a6;
			font-size: 29rpx;
		}
	}
}
</style>
