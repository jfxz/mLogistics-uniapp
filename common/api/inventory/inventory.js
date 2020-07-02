import https from '@/common/interface.js'

// 查询
export const getStore = (data) => {
    return https({
        url: '/inastorage/searchwbinfo',
        method: 'POST',
				data
		// handle:true
    })
}
// 删除
export const delData = (data) => {
    return https({
        url: '/inastorage/deletestorageinfo',
        method: 'POST',
				data
		// handle:true
    })
}
export const editStore = (data) => {
    return https({
        url: '/inastorage/storgeUpdate',
        method: 'POST',
				data
		// handle:true
    })
}

// 删除
export const moveSave = (data) => {
    return https({
        url: '/inastorage/storgeChangeLocation',
        method: 'POST',
				data
		// handle:true
    })
}
// 一致
export const moveSame = (data) => {
    return https({
        url: '/inastorage/storgeCheckSame',
        method: 'GET',
				data
		// handle:true
    })
}
// 不一致
export const moveNoSame = (data) => {
    return https({
        url: '/inastorage/storgePcsUpdate',
        method: 'GET',
				data
		// handle:true
    })
}
