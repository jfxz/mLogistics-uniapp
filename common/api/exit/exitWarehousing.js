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
// 入库
export const storageIn = (data) => {
    return https({
        url: '/indStorage/storageIn?mainWb=${data.mainWb}&hawbWb=${data.hawbWb}&locationId=${data.locationId}&actNum=${data.actNum}&actWgt=${data.actWgt}',
        method: 'GET',
				data
		// handle:true
    })
}
