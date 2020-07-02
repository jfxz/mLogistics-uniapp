<template>
	<view class="selfMention">
		<search ref="search" @mainChange="mainChange" @hawChange="hawChange" @getData="getData"></search>
		<view class="title">
			<text class="circle"></text>
			<text class="text-label">运单信息</text>
		</view>
		<view class="top-flex">
			<view class="top-title">
				<text>运单状态</text>
				<view class="title-color">
					<text class="text-info">发货</text>
				</view>
			</view>
			<view class="top-content">
				<view class="content">
					<view class="row">
						<view class="world-left">
							<text>库位</text>
						</view>
						<view class="world-right">
							<text>库位1/1,库位2/2件</text>
						</view>
					</view>
				</view>
				<view class="content">
					<view class="content-flex">
						<view class="content-left">
							<text>处理代码</text>
						</view>
						<view class="content-right">
							<text>1</text>
						</view>
					</view>
					<view class="content-flex">
						<view class="content-left">
							<text>结构异常</text>
						</view>
						<view class="content-right">
							<text>无</text>
						</view>
					</view>
				</view>
				<view class="content">
					<view class="content-flex">
						<view class="content-left">
							<text>总件数</text>
						</view>
						<view class="content-right">
							<text>1</text>
						</view>
					</view>
					<view class="content-flex">
						<view class="content-left">
							<text>已缴费总量</text>
						</view>
						<view class="content-right">
							<text>无</text>
						</view>
					</view>
				</view>
				<view class="content">
					<view class="content-flex">
						<view class="content-left">
							<text>总重量</text>
						</view>
						<view class="content-right">
							<text>3</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="title" style="margin-top: 45rpx;margin-bottom: 25rpx;">
			<text class="circle"></text>
			<text class="text-label">发货信息</text>
		</view>
		<view class="middle">
			<view class="input-flex">
				<text class="left">发货件数</text>
				<input class="right" type="number" v-model="form.num" />
			</view>
			<view class="input-flex">
				<text class="left">发货重量</text>
				<input  class="right" type="digit" v-model="form.wgt" />
			</view>
			<view class="input-flex">
				<text class="left">收货人</text>
				<input class="right" type="text" v-model="form.name" placeholder="请输入收货人姓名"/>
			</view>
			<view class="input-flex">
				<text class="left">收货人证件号码</text>
				<input  class="right" type="idcard" v-model="form.card"/>
			</view>
			<view class="input-flex">
				<text class="left">是否自提</text>
				<view class="switch-right">
					<switch :checked="isSelf" @change="selfChange" />
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="bottom-title">
				<text>其他信息</text>
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
				<input class="right" type="number" v-model="other.phone" placeholder="请输入联系方式"/>
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
			<view class="input-flex">
				<input type="text" class="remake-input" v-model="other.remake" placeholder="请输入发货备注(50字)..."/>
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
				isService: false,
				isRemind: false,
				showMainClearIcon: false,
				showHawbClearIcon: false,
				filters: {
					mainBill: '',
					hawbBill: ''
				},
				other: {
					name: '',
					card: '',
					phone: '',
					isRemind: '',
					isService: '',
					remake: ''
				},
				isSelf: false,
				form: {
					isSelf: '',
					card: '',
					name: '',
					wgt: '',
					num: '',
					isSelf: ''
				}
			}
		},
		methods: {
			clear () {
				this.isSelf = false
				this.isRemind = false
				this.isService = false
				//清空搜索框
				this.$refs.search.clear()
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				Object.keys(this.other).forEach(item => {
					this.other[item] = ''
				})
				Object.keys(this.filters).forEach(item => {
					this.filters[item] = ''
				})
			},
			//取消发货/保存
			save () {
				console.log(this.form)
			},
			getData () {
				console.log(this.filter)
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
			//自提
			selfChange: function (e) {
				this.form.isSelf = e.target.value
			},
			//送达
			serviceChange: function (e) {
				this.other.isService =  e.target.value
			},
			//短信提醒
			remindChange: function (e) {
				this.other.isRemind = e.target.value
			}
		}
	}
</script>

<style lang="scss">
	.selfMention{
		border-radius: 10rpx;
		.title {
			margin: 0 25rpx;
			.circle {
				width: 15upx;
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
					line-height: 60upx;
					height: 60upx;
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
					margin-left: 17rpx;
					line-height: 75rpx;
					text-align: center;
					background: -webkit-linear-gradient(#fac55f,#ffaa00);
					transform: skewX(-15deg);
					.text-info {
						 display: inline-block;
						 font-family: FZZYJW--GB1-0;
						 font-size: 35rpx;
						 color: #FFFFFF;
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
					height: 101rpx;
					.row{
						display: flex;
						flex-direction: row;
						.world-left{
							text-align: left;
							line-height: 101rpx;
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
				color: #262626;
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
			.remake-input{
				font-size: 31rpx;
				height: 92rpx;
				width: 100%;
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
				height: 120rpx;
				line-height: 120rpx;
				color: #67b0ff;
			}
		}
	}
</style>
