import _config from './apiConfig'; // 导入私有配置
// export const ssoUrl = 'http://10.1.16.24:9091'
export const ssoUrl = 'http://110.80.9.190:9091'

//  http 请求配置项
export const AUTH_CLIENT_ID = 'toc'
export const AUTH_CLIENT_SECRET = 'toc'
import base64 from '@/common/crypto-js/base64.js'
export default function $http(options) {
	console.log(_config , options)
	_config.header['Content-Type'] = 'application/json;charset=utf-8'
	if (options && options.data && 'grant_type' in options.data || options.extra === 'auth') {
		options.url = ssoUrl + options.url;
		if (options.extra !== 'auth') {
			_config.header['Authorization'] = 'Basic ' + `${base64.Base64.btoa(`${AUTH_CLIENT_ID}:${AUTH_CLIENT_SECRET}`)}`
		}
		if(options.extra === 'auth') {
			_config.header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
		}
	} else {
		console.log(222222222, options)
		if (options.pgyer) {
			options.url = _config.pgyerUrl + options.url
			_config.header['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
		} else {
			options.url = _config.url + options.url;
			_config.header['Content-Type'] = 'application/json;charset=utf-8'
			_config.header['Authorization'] = 'Bearer ' + uni.getStorageSync('access_token')
		}
	}
	// _config.header['Authorization'] = uni.getStorageSync('access_token')
  return new Promise((resolve, reject) => {
		// 进行url字符串拼接
    // 拦截请求
    _config.complete = (response) => {
      //  request請求访问成功
      if (response.statusCode === 200) {
          // 接口请求成功
          resolve(response.data);
      } else {
        // 处理catch 请求，不在本页面之外处理，统一在这里处理
				if(options.handle){
					reject(response)
				}else{
					try {
					  Promise.reject(response).catch(err => {
							console.log('err', err)
					    _page_error(response.statusCode || response.errMsg, response);
							reject(response)
					  });
					} catch (e) {
						uni.hideLoading()
					  console.log(e)
					}
				}
      }

    }
    // 开始请求
    uni.request(Object.assign({},_config, options));
  })
}

// 接口錯誤
function _error(err, msg = '') {
console.log(123123123, err)
  switch (err) {
    case 400:
		uni.showModal({
		    title: '提示',
		    content: '登录异常，请重新登录',
		    success: function (res) {
		        if (res.confirm) {
							uni.reLaunch({
								url: '../pages/main/index',
							})
		        } else if (res.cancel) {
		        }
		    }
		})
  }
}
// request 錯誤
function _page_error(err, response) {
  switch (err) {
		case 403:
			var pages = getCurrentPages();
			var page = pages[pages.length - 1]
			uni.removeStorageSync('access_token')
			/* 判断是不是在登录界面 是则提示,否则确定框 */
			console.log(1111, response)
			if (page.route === 'pages/login/login') {
				uni.showToast({
					title: response.data.error_description || '登录异常，请重新登录',
					duration: 1000,
					icon:'none'
				})
			} else {
				uni.showModal({
					title: '提示',
					content: '登录异常，请重新登录',
					success: function (res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '../../../pages/login/login',
							})
						} else if (res.cancel) {
						}
					}
				})
			}
		  break;
		case 400: 
			uni.showToast({
				title: response.data.error_description,
				duration: 1000,
				icon:'none'
			})
			break;
		case 401:
			uni.removeStorageSync('access_token')
			uni.hideLoading()
			var pages = getCurrentPages();
			var page = pages[pages.length - 1]
			/* 判断是不是在登录界面 是则提示,否则确定框 */
			if (page.route === 'pages/login/login') {
				uni.showToast({
					title: response.data.error_description || '登录异常，请重新登录',
					duration: 1000,
					icon:'none'
				})
			} else {
				uni.showModal({
					title: '提示',
					content: response.data.message,
					success: function (res) {
						if (res.confirm) {
							uni.reLaunch({
								url: '../../pages/login/login',
							})
						} else if (res.cancel) {
						}
					}
				})
			}
			// uni.showToast({
			// 	title: response.data.message,
			// 	duration: 1000,
			// 	icon:'none'
			// })
		  console.error("请求被拒绝")
		  break;
    case 404:
      // 错误码404的处理方式
			uni.showToast({
				title: '没有找到页面',
				duration: 1000,
				icon:'none'
			})
      console.error("没有找到页面")
      break;
    case 405:
			uni.showToast({
				title: '错误的请求',
				duration: 1000,
				icon:'none'
			})
      console.error("错误的请求")
      break;
  }
}