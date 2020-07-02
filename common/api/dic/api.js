import https from '@/common/interface.js'
// 获取异常类型
export const getAbnType = (data) => {
    return https({
        url: '/abntype/all',
        method: 'GET',
				data
		// handle:true
    })
}
// 库位信息
export const getWarehouseValue = (data) => {
    return https({
        url: '/warehouseLocation/all',
        method: 'GET',
				data
		// handle:true
    })
}
// 客户信息
export const getCustomer = (data) => {
    return https({
        url: '/deliveryCustomer/all',
        method: 'GET',
				data
		// handle:true
    })
}
// 获取货物存放属性所有数据
export const getSpecialcode = (data) => {
    return https({
        url: '/specialcode/all',
        method: 'GET',
				data
		// handle:true
    })
}

// 获取货物名称
export const getCargoname = (data) => {
    return https({
        url: '/cargoname/all',
        method: 'GET',
				data
		// handle:true
    })
}

// 查询
export const getFlightStatus = (data) => {
    return https({
        url: '/type/flightStatusType',
        method: 'GET',
				data
		// handle:true
    })
}
export const getUldType = (data) => {
    return https({
        url: '/type/uldType',
        method: 'GET',
				data
		// handle:true
    })
}
