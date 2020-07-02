<template>
	<view class="pickGoods">
		<search ref="search" @mainChange="mainChange" @hawChange="hawChange" @getData="getData"></search>
		<view class="title" style="margin-bottom: 25rpx;">
			<text class="circle"></text>
			<text class="text-label">运单信息</text>
		</view>
		<view class="top-flex">
			<view class="top-title">
				<text>运单状态</text>
				<view class="title-color" :class="[status === '预约'? '':'text-color']">
					<text class="text-info">{{status}}</text>
				</view>
			</view>
			<view class="top-content">
				<view class="content">
					<view class="content-top">
						<text>{{info.totalNum}}</text>
					</view>
					<view class="content-bottom">
						<text>总件数</text>
					</view>
				</view>
				<view class="content">
					<view class="content-top">
						<text>{{info.totalWgt}}</text>
					</view>
					<view class="content-bottom">
						<text>总重量</text>
					</view>
				</view>
				<view class="content">
					<view class="content-top">
						<text>未报关</text>
					</view>
					<view class="content-bottom">
						<text>报关状态</text>
					</view>
				</view>
			</view>
		</view>
		<view class="title" style="margin-top: 37rpx;margin-bottom: 25rpx;">
			<text class="circle"></text>
			<text class="text-label">提货信息</text>
		</view>
		<view class="bottom">
			<view class="input-flex">
				<text class="left">提货件数</text>
				<input class="right" type="number" v-model="form.num" />
			</view>
			<view class="input-flex">
				<text class="left">提货重量</text>
				<input  class="right" type="digit" v-model="form.wgt" />
			</view>
			<view class="input-flex">
				<text class="left">证件号码</text>
				<input class="right" type="text" v-model="form.idcard" />
			</view>
			<view class="input-flex">
				<text class="left">提货车牌</text>
				<input  class="right" type="text" v-model="form.card" placeholder-class="placeholder-font" placeholder="请输入提货车牌" />
			</view>
			<view class="input-flex">
				<text class="left">提货备注</text>
				<input class="right" type="text" v-model="form.remake" placeholder-class="placeholder-font" placeholder="请输入备注(50字)" />
			</view>
		</view>
	</view>
</template>

<script>
	import search from '@/components/search.vue'
	export default {
		components: {search},
		data() {
			return {
				filters: {
					mainBill: '',
					hawbBill: ''
				},
				status: '提货',
				statusList: ['预约','提货'],
				showMainClearIcon: false,
				showHawbClearIcon: false,
				form: {
					remake: '',
					card: '',
					idcard: '',
					wgt: '',
					num: ''
				},
				info: {
					totalNum: '1',
					totalWgt: '1'
				}
			}
		},
		watch: {
		    status: {
				handler(newVal, oldVal) {
					// console.log('新值',newVal)
					this.$emit('updateWorld', newVal);
				},
				immediate: true,
			}
		 },
		 onLoad:function(){
		 	this.filters.mainBill = 'DEQ35629875'
			this.filters.hawbBill = 'DE1234'
		 },
		methods: {
			clear () {
				//清空搜索框
				this.$refs.search.clear()
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				Object.keys(this.info).forEach(item => {
					this.info[item] = ''
				})
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
			},
			//取消提货/提货
			save () {
				if (this.status === '预约') {
					//提货接口
				} else {
					//取消提货接口
				}
				console.log(this.form)
				console.log(this.info)
			},
			//主单号赋值
			mainChange (val){
				console.log('主单号',val)
				this.filters.mainBill = val
			},
			//分单号赋值
			hawChange (val){
				this.filters.hawbBill = val
			},
			getData () {
				console.log(this.filter)
			}	
		}
	}
</script>

<style lang="scss">
	.pickGoods{
		border-radius: 10rpx;
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
			height: 285rpx;
			background: #FFFFFF;
			border-radius: 5px;
			.top-title{
				padding: 0rpx 20rpx;
				display: flex;
				flex-direction: row;
				height: 104upx;
				font-family: SourceHanSansSC-Regular;
				font-size: 29rpx;
				line-height: 100upx;
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
				.text-color {
					background: -webkit-linear-gradient(#ff3083,#ff304f);
				}
			}
			.top-content{
				padding: 0rpx 20rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				height: 180rpx;
				.content{
					display: flex;
					flex-direction: column;
					text-align: center;
					.content-top{
						padding-top: 49rpx;
						font-family: Roboto-Regular;
						font-size: 35rpx;
						color: #262626;
					}
					.content-bottom{
						font-family: SourceHanSansSC-Regular;
						font-size: 29rpx;
						color: #a6a6a6;
					}
				}
			}
		}
		.placeholder-font{
			font-size: 28rpx;
			color: #bfbfbf;
		}
		.bottom {
			width: calc(100% - 50rpx);
			margin: 0 25rpx;
			display: flex;
			flex-direction: column;
			border-radius: 5px;
			background: #FFFFFF;
			.input-flex{
				padding: 0 26rpx;
				border-bottom: 1px solid #e1e5e4;
				height: 106rpx;
				line-height: 106rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.left{
					font-family: SourceHanSansSC-Regular;
					font-size: 31rpx;
					color: #595959;
				}
				.right{
					font-family: Roboto-Regular;
					height: 106rpx;
					line-height: 106rpx;
					font-size: 35rpx;
					color: #262626;
					text-align: right;
				}
			}
		}
	}
</style>
