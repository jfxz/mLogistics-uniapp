<template>
	<view class="moveEdit">
		<arrow name="库存修改"></arrow>
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
					库存重量<text>(必填)</text>
				</view>
				<view class="value">
					<input type="number" :value="form.WGT" @input="WGTChange"/>
				</view>
			</view>
			<view class="msg last">
				<view class="label">
					库存件数<text>(必填)</text>
				</view>
				<view class="value">
					<input type="number" :value="form.NUM" @input="NUMChange"/>
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
		<tui-modal :show="modal" @click="handleClick" @cancel="hide" title="提示" :content="modalMsg"></tui-modal>
	</view>
</template>

<script>
	import {editStore} from '@/common/api/inventory/inventory.js'
	import arrow	from '@/components/arrow/arrow.vue'
	import tuiModal from "@/components/modal"
	export default {
		components: {arrow, tuiModal},
		data() {
			return {
				modalMsg: '',
				modal: false,
				form: {
					wb_prefix: '',
					wb_no: '',
					WAREHOUSE_CODE: '',
					LOCATION_ID: '',
					NUM: '',
					WGT: ''
				}
			}
		},
		onReady () {
			console.log(356, getApp().globalData.wbInfo)
			this.form = getApp().globalData.wbInfo
		},
		methods: {
			hide() {
				this.modal = false
			},
			handleClick(e) { // 点击确认入库
				let index = e.index
				if (index === 0) {
					this.modal = false
				} else {
					this.submit()
				}
			},
			submit () {
				let para = {
					storageId: this.form.ID,
					number: Number(this.form.NUM),
					weight: Number(this.form.WGT)
				}
				editStore(para).then(res => {
					if (res.status) {
						this.$message(res.message)
						setTimeout(() => {
							uni.navigateBack()
						}, 300)
					} else {
						this.$message(res.message)
					}
				})
			},
			save () {
				if (this.form.NUM === '') {
					this.$message('库存件数不能为空')
					return
				}
				if (this.form.WGT === '') {
					this.$message('库存重量不能为空')
					return
				}
				if (this.form.NUM <= 0) {
					this.$message('库存件数需大于0')
					return
				}
				if (this.form.WGT <= 0) {
					this.$message('库存重量需大于0')
					return
				}
				let overWgt = this.form.WGT > this.form.wgt_total
				let overNum = this.form.NUM > this.form.num_total
				if (overWgt || overNum) {
					this.modalMsg = `${overWgt ? '重量超出总重量 ' : ''}${overNum ? '件数超出总件数' : ''}`
					this.modal = true
					return
				}
				this.submit()
			},
			cancal () {
				uni.navigateBack()
			},
			NUMChange (val) {
				this.form.NUM = Number(val.target.value)
			},
			WGTChange (val) {
				this.form.WGT = Number(val.target.value)
			}
		}
	}
</script>

<style lang="scss">
.moveEdit {
	background: linear-gradient(#3ace6e, white);
	height: 100vh;
	.store {
		height: 444rpx;
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
			height: 33rpx;
			line-height:33rpx;
		}
		.label {
			letter-spacing: 1rpx;
			color: #a6a6a6;
			font-size: 29rpx;
		}
	}
}
</style>
