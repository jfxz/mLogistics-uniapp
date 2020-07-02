import { getAbnType, getUldType, getWarehouseValue, getSpecialcode, getCustomer, getCargoname } from '../../common/api/dic/api.js' 
const dic = {
	state: {
		customer_dic: {},
		specialCode_dic: {},
		warehouse_dic: {},
		flightStatus_dic: {},
		abnType_dic: {},
		cargoname_dic: {},
		// 报关状态
		DECLARE_STATUS: [
			{
		    label: '未报关',
		    value: '0'
		  },
		  {
		    label: '待查验',
		    value: '1'
		  },
		  {
		    label: '暂扣',
		    value: '2'
		  },
		  {
		    label: '已报关',
		    value: '3'
		  }
		],
		//进口运单状态
		WB_STATUS: [
			{
			  label: '预报',
			  value: '0'
			},
			{
			  label: '提货',
			  value: '1'
			},
			{
			  label: '入库',
			  value: '2'
			},
			{
			  label: '通知',
			  value: '3'
			},
			{
			  label: '待发货',
			  value: '4'
			},
			{
			  label: '发货',
			  value: '5'
			}
		],
		WB_STATUS_EXIT: [
			{
			  label: '制单',
			  value: '0'
			},
			{
			  label: '入库',
			  value: '1'
			},
			{
			  label: '预约',
			  value: '2'
			},
			{
			  label: '出库',
			  value: '3'
			},
			{
			  label: '交接',
			  value: '4'
			}
		]
	},
	mutations: {
		SET_FLIGHTSTATUS: (state, data) => {
			state.flightStatus_dic = data
		},
		SET_ABNTYPE: (state, data) => {
			state.abnType_dic = data
		},
		SET_WAREHOUSE: (state, data) => {
			state.warehouse_dic = data
		},
		SET_SPECIALCODE: (state, data) => {
			state.specialCode_dic = data
		},
		SET_CUSTOMER: (state, data) => {
			state.customer_dic = data
		},
		SET_CARGONAME: (state, data) => {
			state.cargoname_dic = data
		}
	},
	actions: {
		GetCargoname ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getCargoname().then((res) => {
					const data = res.data
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_CARGONAME', data)
			})
		},
		GetWarehouse ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getWarehouseValue().then((res) => {
					console.log('staus', res)
					const data = res.data
					// commit('SET_FLIGHTSTATUS', data)
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_WAREHOUSE', data)
			})
		},
		GetCustomerValue ({ commit, state, dispatch }) {
			return new Promise((resolve,reject) => {
				getCustomer().then((res) => {	
					const data = res.data
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_CUSTOMER', data)
			})
		},
		GetSpaceialCodeValue ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getSpecialcode().then((res) => {
					console.log('staus', res)
					const data = res.data
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_SPECIALCODE', data)
			})
		},
		// 获取uld状态
		GetAbnType ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getAbnType().then((res) => {
					console.log('staus', res)
					const data = res.data
					// commit('SET_FLIGHTSTATUS', data)
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_ABNTYPE', data)
			})
		},
		// 获取航班状态信息
		GetFlightStatusInfo ({ commit, state, dispatch }) {
			return new Promise((resolve, reject) => {
				getFlightStatus().then((res) => {
					console.log('staus', res)
					const data = res.data
					// commit('SET_FLIGHTSTATUS', data)
					resolve(data)
				}).catch(res => {
					reject(res)
				})
			}).then(data => {
				commit('SET_FLIGHTSTATUS', data)
			})
		}
	}
}
export default dic