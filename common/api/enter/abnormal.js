import https from '@/common/interface.js'

// 查询异常详情
export const getAbnMsg = (data) => {
    return https({
        url: '/inaabnreg/searchAbnormalInfo',
        method: 'GET',
				data
		// handle:true
    })
}
// 保存
export const abnSave = (data) => {
    return https({
        url: '/inaabnreg/saveInaAbnReg',
        method: 'POST',
				data
		// handle:true
    })
}
// 删除图片
export const delImg = (data) => {
    return https({
        url: '/inaabnreg/deleteAbnormalPhoto',
        method: 'GET',
				data
		// handle:true
    })
}
// 查询
export const getAbnormal = (data) => {
    return https({
        url: '/dodTransit/getWayBill',
        method: 'GET',
				data
		// handle:true
    })
}
// 中转交接
export const transitCommit = (data) => {
    return https({
        url: '/dodTransit/transitCommit',
        method: 'POST',
				data
		// handle:true
    })
}
// 交接取消
export const transitCancel = (data) => {
    return https({
        url: '/dodTransit/transitCancel',
        method: 'POST',
				data
		// handle:true
    })
}
