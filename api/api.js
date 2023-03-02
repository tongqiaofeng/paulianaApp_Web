import { request } from '@/utils/request';

/**
 * 活动列表
 * @returns
 */
export const activityList = () => {
	return request('/activityList');
};

/**
 * 设计图分类
 * @returns
 */
export const customerDesignSortList = () => {
	return request('/customerDesignSortList');
};

/**
 * 定制设计图展示
 * @returns
 */
export const customerDesignList = (tag) => {
	return request(`/customerDesignList?tag=${tag}`);
};

/**
 * 成品搜索列表
 * @returns
 */
export const jewellerySearch = (data) => {
	return request('/jewellerySearch', data, 'POST');
};

/**
 * 成品分类
 * @returns
 */
export const jewellerySortGet = () => {
	return request('/jewellerySortGet');
};

/**
 * 宝石搜索
 * gemName宝石名称 page当前页 pageNum sort
 * @param {*} data
 * @returns
 */
export const gemSearch = (data) => {
	return request('/gemSearch', data, 'POST');
};

/**
 * 宝石分类列表
 * @returns
 */
export const gemSortList = () => {
	return request('/gemSortList');
};

/**
 * 主推产品列表
 * @returns
 */
export const recommendProductList = () => {
	return request('/recommendProductList');
};

/**
 * 首页和分类数据 manageType 0首页  1分类
 * @param {*} manageType
 * @returns
 */
export const indexOrSortDataGet = (manageType = 0) => {
	return request('/indexOrSortDataGet?manageType=' + manageType);
};

/**
 * 产品标签
 */
export const productLabelListGet = () => {
	return request('/productLabelListGet');
};

/**
 * 成品搜索列表
 * @returns
 */
export const designSearch = (data) => {
	return request('/designSearch', data, 'POST');
};

/**
 * 设计图标签
 */
export const designLabelListGet = () => {
	return request('/designLabelListGet');
};

/**
 * 设计图详情
 * @param {*} id 
 * @returns 
 */
export const designInfoGet = (id) => {
  return request('/designInfoGet?designId=' + id);
}