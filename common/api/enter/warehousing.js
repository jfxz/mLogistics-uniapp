import https from '@/common/interface.js'
// 查询货物入库信息
export const getWbInfo = (data) => {
    return https({
        url: '/inastorage/searchwbinfo',
        method: 'POST',
				data
		// handle:true
    })
}
// 获取货物存放属性所有数据
export const getAllCode = (data) => {
    return https({
        url: '/specialcode/all',
        method: 'GET',
				data
		// handle:true
    })
}
// 通过货物存放属性获取库位以及财务代码
export const getRelationMsgByLocation = (data) => {
    return https({
        url: '/inastorage/getRelationMsgByLocation',
        method: 'POST',
				data
		// handle:true
    })
}

// 货物入库
export const savecargostorage = (data) => {
    return https({
        url: '/inastorage/savecargostorage',
        method: 'POST',
				data
		// handle:true
    })
}