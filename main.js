import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;

// Vue.prototype.$baseUrl = 'http://192.168.0.164:8087/jewellery/wechat/api';
// Vue.prototype.$baseMagageUrl = 'http://192.168.0.164:8086/app';
Vue.prototype.$baseUrl = 'https://hk.wistechx.cn/JewelleryMallApi';
Vue.prototype.$baseMagageUrl = 'https://hk.wistechx.cn/JewelleryStockApi';
Vue.prototype.$baseImgUrl = 'https://hk.wistechx.cn/JewelleryMallApi';

// 公共样式
import './static/styles/common.scss';

Vue.prototype.checkBack = function (ret, bShwoTip = 1) {
	if (ret.data.code == 200) {
		return true;
	} else if (bShwoTip == 1) {
		if (ret.data.code == 400)
			uni.showToast({
				icon: 'none',
				title: ret.data.data,
				duration: 2000,
			});
		else if (ret.data.code == 300)
			uni.showToast({
				icon: 'none',
				title: '请登录后再操作',
				duration: 2000,
			});
		else
			uni.showToast({
				icon: 'none',
				title: '操作失败，请重试',
				duration: 2000,
			});
	}

	return false;
};

Vue.prototype.setUserInfo = function (ret) {
	console.log('用户信息');
	console.log(ret);

	let userInfo = {};
	userInfo.userToken = ret.data.token;
	userInfo.userNick = ret.data.nick;
	userInfo.userHeadPic = ret.data.headPic;
	userInfo.phoneNumber = ret.data.phoneNumber;
	userInfo.totalIntegral = ret.data.totalIntegral;
	userInfo.authority = ret.data.authority;
	userInfo.managerToken = ret.data.managerToken;

	console.log(userInfo);

	getApp().globalData.userInfo = userInfo;
	uni.setStorageSync('token', userInfo.userToken);
	uni.setStorageSync('nick', userInfo.userNick);
	uni.setStorageSync('headPic', userInfo.userHeadPic);
	uni.setStorageSync('phoneNumber', userInfo.phoneNumber);
	uni.setStorageSync('totalIntegral', userInfo.totalIntegral);
	uni.setStorageSync('authority', userInfo.authority);
	uni.setStorageSync('managerToken', userInfo.managerToken);
};

(Vue.prototype.editState = function (status, payStatus) {
	let font = '';
	switch (status) {
		case -2:
			font = '取消申请';
			break;
		case -1:
			font = '商家拒绝申请';
			break;
		case 0:
			font = '待商家同意';
			break;
		case 1:
			font = '商家已同意申请';
			break;
	}

	switch (payStatus) {
		case -1:
			font = '商家拒绝退款';
			break;
		case 0:
			font = '待商家退款';
			break;
		case 1:
			font = '退款中';
			break;
		case 2:
			font = '退款成功';
			break;
	}

	return font;
}),
	// 千分价格
	(Vue.prototype.formatNumberRgx = function (num) {
		if (num == '' || num == null || num == 0) {
			return 0;
		} else {
			let parts = num.toString().split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return parts.join('.');
		}
	});

Vue.prototype.getPrice = function (num, currency, noPrice, fixNum) {
	console.log(num);
	if (noPrice == undefined) noPrice = '--';
	if (num == null || num == 'null' || num == '' || num == 0) return noPrice;

	num = String(num);
	if (fixNum == undefined) fixNum = 2;

	var parts = num.toString().split('.');
	if (parts.length == 2) {
		if (fixNum == 0) {
			parts.splice(1, 1);
		} else if (parts[1].length > fixNum) {
			parts[1] = parts[1].substring(0, fixNum);
		}
	}
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return currency + ' ' + parts.join('.');
};


//判断浏览器是否是微信浏览器
//微信浏览器中打开H5隐藏顶部导航方法
Vue.prototype.hidePageNavInWechatBrowser = () => {
	//#ifdef H5
	if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
		"micromessenger") {
		let pageNav = document.getElementsByTagName("uni-page-head");
		if (pageNav && pageNav[0]) {
			pageNav[0].style.display = "none";
		};
		return true
	}
	//#endif
	return false;
};


Vue.prototype.setCopyData = function(text) {
		uni.setClipboardData({
			data: text, //要被复制的内容
			success: () => {
				//复制成功的回调函数
				uni.showToast({
					//提示
					title: '复制成功',
					icon: 'none',
				});
			},
		});
},


App.mpType = 'app';

const app = new Vue({
	...App,
});

app.$mount();
