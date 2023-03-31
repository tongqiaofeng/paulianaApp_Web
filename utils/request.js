// request请求
const API_HOST = 'http://192.168.0.164:8087/jewellery/wechat/api';

// const API_HOST = 'https://hk.wistechx.cn/JewelleryMallApi';

export const api_host = API_HOST;

export const request = function (url, data = {}, method = 'GET', header = {}) {
	if (!header['Content-type']) {
		header['Content-type'] = 'application/json';
		header['token'] = uni.getStorageSync('token');
	}

	return new Promise((reslove, reject) => {
		uni.request({
			url: API_HOST + url,
			method: method,
			data: data,
			header: header,
			success: (res) => {
				if (res.statusCode === 200) {
					reslove(res);
				} else if (res.data.code === 500) {
					uni.showToast({
						title: '服务器异常',
						icon: 'loading',
						duration: 1000,
					});
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
};
