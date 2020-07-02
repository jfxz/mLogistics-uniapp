import https from '@/common/interface.js'

// 查询运单信息
export const getWbInfo = (data) => {
    return https({
        url: '/indOutStorage/searchHandAndNotHand',
        method: 'GET',
				data
		// handle:true
    })
}
// 出库交接
export const handOver = (data) => {
    return https({
        url: '/indOutStorage/handOver',
        method: 'POST',
				data
		// handle:true
    })
}
// 取消交接
export const handOverCancel = (data) => {
    return https({
        url: '/indOutStorage/handOverCancel',
        method: 'POST',
				data
		// handle:true
    })
}