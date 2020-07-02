import https from '@/common/interface.js'

// 查询发货信息
export const findSomeInformation = (data) => {
    return https({
        url: '/inawaybill/findSomeInformation',
        method: 'POST',
				data
    })
}

// 查询入库信息
export const findDeliveryInfo = (data) => {
    return https({
        url: `/vwdeliveryinfo/page?pageSize=100&pageNumber=0&wbPrefix=${data.wbprefix}&wbNo=${data.wbNo}`,
        method: 'GET'
    })
}

// 保存信息
export const updateNote = (data) => {
    return https({
        url: '/delivery/updateNote',
        method: 'POST',
				data
    })
}
// 确认发货信息
export const startDelivery = (data) => {
    return https({
        url: '/vwdeliveryinfo/startDelivery',
        method: 'POST',
				data
    })
}
// 取消发货
export const canceldeliveryInfo = (data) => {
    return https({
        url: `/vwdeliveryinfo/cancelDelivery?deliveryId=${data.id}`,
        method: 'GET'
    })
}