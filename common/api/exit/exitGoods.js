import https from '@/common/interface.js'

// 查询运单信息
export const getWbInfo = (data) => {
    return https({
        url: '/indWayBill/findByMainHawb',
        method: 'GET',
				data
		// handle:true
    })
}
// 出库
export const outWb = (data) => {
    return https({
        url: '/indOutStorage',
        method: 'POST',
				data
		// handle:true
    })
}
// 取消出库
export const cancelOut = (data) => {
    return https({
        url: '/indOutStorage/delete',
        method: 'POST',
				data
		// handle:true
    })
}
