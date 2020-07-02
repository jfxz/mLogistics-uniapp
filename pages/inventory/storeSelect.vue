<template>
	<view class="kwSelect">
		<arrow name="库位选择"></arrow>
		<view class="search-class" style="top: 130rpx;height: 340rpx;padding: 10rpx 60rpx;">
			<view class="input-class" style="height: 100rpx;">
				<input class="uni-input input1"  :value="filter.code" @input="codeChange" placeholder="请输入编码"/>
				<text class="uni-icon" style="line-height: 2.3;" v-if="showMainClearIcon" @click="clearMainIcon">&#xe434;</text>
			</view>
			
			<view class="input-class" style="height: 100rpx;">
				<input class="uni-input input2" :value="filter.name" @input="nameChange" placeholder="请输入名称"/>
				<text class="uni-icon" style="line-height: 2.3;" v-if="showHawbClearIcon" @click="clearHawbIcon">&#xe434;</text>
			</view>
			
			<view class="search">
				<button type="primary" @tap="getData">搜索</button>
			</view>
		</view>
			
		<view class="list">
			<t-table border="2" border-color="#95b99e" @change="change">
					<t-tr font-size="16" color="#262626" align="center">
							<t-th align="center">#</t-th>
							<t-th align="center">编码</t-th>
							<t-th align="center">名称</t-th>
							<t-th align="center">操作</t-th>
					</t-tr>
					<t-tr font-size="15" color="#262626" align="center" v-for="(item, index) in pageTableData" :key="item.id">
							<t-td align="center">{{ (current - 1) * 10 + index + 1 }}</t-td>
							<t-td align="center">{{ item.locationCode }}</t-td>
							<t-td align="center">{{ item.locationAttribute }}</t-td>
							<t-td align="center"><button size="mini" type="primary" @click="choose(item)">选择</button></t-td>
					</t-tr>
			</t-table>
		</view>
		<view class="page">
			<uni-pagination :current="current" :total="total" title="标题文字" :show-icon="true" @change="change" />
			<!-- <view>
				<text class="example-info">当前页：{{ current }}，数据总量：{{ total }}条，每页数据：{{ 10 }}</text>
			</view> -->
		</view>
		<!-- <view class="bottom-btn">
			<view class="btn_left" @tap="cancal">
				<image src="../../static/cancel.png" mode="aspectFit"></image>
				<text>取消</text>
			</view>
			<view class="btn_right" @tap="save">
				确定
			</view>
		</view> -->
	</view>
</template>

<script>
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue'
	import tTr from '@/components/t-table/t-tr.vue'
	import tTd from '@/components/t-table/t-td.vue'
	import arrow	from '@/components/arrow/arrow.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: {arrow, tTable, tTh, tTr, tTd, uniPagination},
		data() {
			return {
				current: 1,
				pageSize: 10,
				showMainClearIcon: false,
				showHawbClearIcon: false,
				filter: {
					code: '',
					name: ''
				},
				tableList: []
			}
		},
		computed: {
			...mapGetters(['dic']),
			total () {
				return this.tableList.length
			},
			// 计算分页
			pageTableData () {
				let pages = Math.ceil(this.tableList.length / 10)// 10为每页设置数量
				let newList = []
				for (let i = 0; i < pages; i++) {
					let sonList = []
					sonList = this.tableList.slice(i * 10, (i + 1) * 10)// 10为每页设置数量
					newList.push(sonList)
				}
				console.log('newList', newList)
				return newList[this.current - 1]
			}
		},
		onReady () {
			getApp().globalData.chooseItem = {}
			this.tableList = this.dic.warehouse_dic
		},
		methods: {
			choose (item) {
				getApp().globalData.chooseItem = item
				uni.navigateBack()
			},
			getData () {
				this.tableList = this.dic.warehouse_dic
				if (this.filter.code && !this.filter.name) {
					this.tableList = this.tableList.filter(item => item.locationCode === this.filter.code)
				} else if (!this.filter.code && this.filter.name) {
					this.tableList = this.tableList.filter(item => item.locationAttribute === this.filter.name)
				} else	if (this.filter.code && this.filter.name) {
					this.tableList = this.tableList.filter(item => item.locationCode === this.filter.code && item.locationAttribute === this.filter.name)
					console.log(123, this.tableList)
				} else {
					this.tableList = this.dic.warehouse_dic
				}
				this.current = 1
			},
			change(e) {
				this.current = e.current
			},
			clearMainIcon () {
				this.filter.code = ''
				this.showMainClearIcon = false
			},
			clearHawbIcon () {
				this.filter.name = ''
				this.showHawbClearIcon = false
			},
			codeChange (val) {
				this.filter.code = val.target.value.toLocaleUpperCase()
				console.log(val.target.value)
				if (val.detail.value.length > 0) {
				    this.showMainClearIcon = true;
				} else {
				    this.showMainClearIcon = false;
				}
			},
			nameChange (val) {
				this.filter.name = val.target.value.toLocaleUpperCase()
				if (val.detail.value.length > 0) {
				    this.showHawbClearIcon = true;
				} else {
				    this.showHawbClearIcon = false;
				}
			},
			save () {
				
			},
			cancal () {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
.kwSelect {
	background: linear-gradient(#3ace6e, white);
	height: 100vh;
	.list {
		position: relative;
		top: 400rpx;
		padding: 0 25rpx;
		margin-bottom: 60rpx;
		.t-th {
			font-weight: bold;
		}
		.t-td {
			padding: 10rpx;
		}
	}
	.page {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 60rpx;
		background: #f7f7f7;
	}
	
}
</style>
