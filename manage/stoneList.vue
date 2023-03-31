<template>
	<view>
		<view class="search row vCenter" :style="{ top: windowTop + 'px' }">
			<uni-search-bar style="flex: 1;" v-model="keyword" placeholder="输入关键字搜索" @confirm="search(true)"	cancelButton="none" />
			<image style="width: 50rpx; height: 50rpx; padding: 0 20rpx 0 0;" src="../static/imgs/common/filter.png" mode="aspectFit" @click="showDrawer"></image>
		</view>

		<uni-drawer ref="filter"  mode="left" :width="windowWidth*3/4" :mask-click="true">
				<view class="filter" >
					<scroll-view scroll-y class="scroll">
						<uni-collapse>
							<uni-collapse-item  v-if="stockList.length > 0"  open title="库存地" thumb="../../../../static/imgs/common/local.png">
								<view style="margin: 0 80rpx;">
									<uni-data-checkbox selectedColor="#1ECC99" mode="list" multiple icon="right" v-model="stockId" :localdata="stockList" :map="collapseMap"></uni-data-checkbox>
									</view>
							</uni-collapse-item>
							<uni-collapse-item   v-if="stoneList.length > 0" title="裸石类型"  thumb="../../../../static/imgs/common/diamond.png">
								<view style="margin: 0 80rpx;">
									<uni-data-checkbox selectedColor="#1ECC99" mode="list" icon="right" v-model="stoneId" :localdata="stoneList" :map="collapseMap"></uni-data-checkbox>
								</view>
							</uni-collapse-item>
							<uni-collapse-item title="库存状态" thumb="../../../../static/imgs/common/state.png">
								<view style="margin: 0 80rpx;">
									<uni-data-checkbox selectedColor="#1ECC99" mode="list" icon="right" v-model="stateId" :localdata="stateList"></uni-data-checkbox>
								</view>
							</uni-collapse-item>
							<uni-collapse-item title="排序方式" thumb="../../../../static/imgs/common/sort2.png">
								<view style="margin: 0 80rpx;">
									<uni-data-checkbox selectedColor="#1ECC99" mode="list" icon="right" v-model="sortId" :localdata="sortList"></uni-data-checkbox>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</scroll-view>
					
					<view style="display: flex; justify-content: space-around;">
						<button class="btnReset" @click="ResetFilter" type="primary">重置</button>
						<button class="btnSet" @click="closeDrawer" type="primary">确认</button>
					</view> 
					
				</view>
				
				  
		</uni-drawer>
		
		<view v-if="list.length == 0 && curPage == 2" class="no-data" style="padding-top: 300rpx">
			<image src="../static/imgs/common/no.png" mode="aspectFill"></image>
			<text style="font-size: 28rpx">暂无商品哦~</text>
		</view>
		<view v-else class="list">
			<view v-for="(item, index) in list" :key="index" class="item row vCenter" @click="goToDetail(item.id)">
				<view class="img">
					<easy-loadimage class="img" :image-src="item.imgEx" :scroll-top="scrollTop"  mode="aspectFit"></easy-loadimage>
				</view>
				<view class="desc">
					<view class="brand" @longpress="setCopyData(item.productName)">{{item.productName}}</view>
					<view class="line">
						<text>类&emsp;型：</text> <text>{{item.materialName}}</text>
					</view>
					<view class="line" @longpress="setCopyData(getPrice(item.unitPrice, item.currency, '--', 0))" :style="{'font-weight': Math.abs(sortId) == 2 ? 'bold' : 'normal'}">
						<text>单&emsp;价：</text> <text>{{getPrice(item.unitPrice, item.currency, '--', 0)}}</text>
					</view>
					<view class="line" @longpress="setCopyData(getPrice(item.totalPrice, item.currency, '--', 0))" :style="{'font-weight': Math.abs(sortId) == 3 ? 'bold' : 'normal'}">
						<text>总&emsp;价：</text> <text>{{getPrice(item.totalPrice, item.currency, '--', 0)}}</text>
					</view>
					<view class="line">
						<text>数&emsp;量：</text> <text>{{item.number}}</text>
					</view>
					<view v-if="item.weight > 0" class="line" :style="{'font-weight': Math.abs(sortId) == 4 ? 'bold' : 'normal'}">
						<text>重&emsp;量：</text> <text>{{item.weight + item.chargeUnit}}</text>
					</view>
					<view class="line">
						<text>库存状态：</text> <text>{{item.storageName}} （{{getState(item.state)}}）</text>
					</view>
				</view>
			</view>
		</view>
		<view class="nomore" v-if="haveMore == false && list.length > 0">没有更多了</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				windowTop:44,
				scrollTop: 0,
				windowWidth:400,
				keyword: '',
				curPage: 1,
				list:[],
				haveMore: true,
								
				collapseMap:{text:'name',value:'id'},
				
				stockId:[],
				stockList:[],
				
				stateId:0,
				stateList:[  { value: -1, text: "全部" }, { value: 0, text: "库存中" }, { value: 1, text: "加工中" }, { value: 2, text: "加工完成" }, { value: 3, text: "已出售" }],
				
				stoneId:0,
				stoneList:[],
				
				sortId:0,
				sortList:[  { value: 0, text: "默认排序" }, { value: 1, text: "时间升序" }, { value: -1, text: "时间降序" }, { value: 2, text: "单价升序" }, { value: -2, text: "单价降序" }, { value: 3, text: "总价升序" }, { value: -3, text: "总价降序" }, { value: 4, text: "重量升序" }, { value: -4, text: "重量降序" }],
				
			}
		},
		onLoad(){
			this.search(true);
			this.getFilterInfo();
		},
		onReady() {
			if(this.hidePageNavInWechatBrowser()){
				this.windowTop = 0;
			}
			else{
				uni.getSystemInfo({
					success: (data) => {
						this.windowTop = data.windowTop;
					},
				});
			}	
			
			uni.getSystemInfo({
				success: (data) => {
					this.windowWidth = data.windowWidth;
				},
			});
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh(){
			this.search(true);
			uni.stopPullDownRefresh();
		},
		onReachBottom() {
			if (this.haveMore && this.list.length > 0) {
				this.search(false);
			}
		},
		methods: {
			search(rest) {
				
				if(rest){
					this.curPage = 1;
					this.haveMore = true;
					this.list = [];
				}
				
				uni.showLoading({ title: "加载中...", });
				
				let data = { keyword: this.keyword, page: this.curPage, pageNum: 10 };
				
				if(this.stockId.length > 0) data.storageIdList = this.stockId;
				if(this.stateId >= 0)  data.state = this.stateId;
				if(this.stoneId > 0)  data.materialId = this.stoneId;
				data.sort = this.sortId;
				
			
				uni.request({
					url: this.$baseMagageUrl + "/stockMaterialList",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("managerToken"),
					},
					data: data,
					complete: (res) => {
						uni.hideLoading();
						if (this.checkBack(res) == false) return;
				
						let list = res.data.data.list;
						let total = res.data.data.total;
						
						for (let i = 0; i < list.length; ++i) {
							if (list[i].img) {
								list[i].imgEx = this.$baseUrl + '/file/' + list[i].img;
							} else {
								list[i].imgEx = '../static/imgs/common/nopic.jpg';
							}
							
							console.log(list[i].pic)
						}
						
						
						this.list = this.list.concat(list);
						
						++this.curPage;
						if (this.list.length >= total)
							this.haveMore = false;

						uni.hideLoading();
						
						setTimeout(() => {
						  this.scrollTop++;
						}, 500);
						
					},
				});
			},
			getFilterInfo(){
				this.getStockList();
				this.getStoneList();
			},
			getStockList(){
				uni.request({
					url: this.$baseMagageUrl + "/warehouseStockTotalGet",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("managerToken"),
					},
					data:{},
					complete: (ret) => {
						console.log(ret);
						uni.hideLoading();
						if (this.checkBack(ret, true) == false) return;
						if (ret.data.data.length > 0) {
							this.stockList = ret.data.data;
						}
					},
				});
			},
			getStoneList(){
				uni.request({
					url: this.$baseMagageUrl + "/materialList",
					method: "POST",
					header: {
						"content-type": "application/json",
						token: uni.getStorageSync("managerToken"),
					},
					complete: (ret) => {
						console.log(ret);
						uni.hideLoading();
						if (this.checkBack(ret, true) == false) return;
						if (ret.data.data.length > 0) {
							this.stoneList = ret.data.data;
						}
					},
				});
			},
			showDrawer() {
				this.$refs.filter.open();
			},
			closeDrawer() {
				this.$refs.filter.close();
				this.search(true);
			},
			ResetFilter(){
				this.stockId = [];
				this.stateId = 0;
				this.stoneId = 0;
				this.sortId = 0;
			},
			getState(state){
				for(let i = 0; i < this.stateList.length; ++i){
					if(state == this.stateList[i].value)
						return this.stateList[i].text;
				}
				
				return '';
			},
			goToDetail(id){
				uni.navigateTo({
					url: '../pauliana/materialDetails?id=' + id,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.uni-data-checklist::v-deep .checkobx__list{
		border-color: #1ECC99 !important;
	}
	
	.search {
		position: sticky;
		top: var(--window-top);
		z-index: 980;
		background-color: white;
	}
	
	.filter{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
		background-color: white;
		
		.scroll{
			flex: 1;
			height:0;
		}
		
		.btnReset{
			margin: 20rpx 40rpx 60rpx 40rpx;
			background-color: #cccccc;
			flex: 1;
		}
		
		.btnSet{
			margin: 20rpx 40rpx 60rpx 40rpx;
			background-color: #1ECC99;
			flex: 1;
		}
	}
	
	.list{
		font-size: 26rpx;
		color: #03314B;
		margin: 20rpx;
		
		.item{
			margin-bottom: 40rpx;
			padding-bottom: 40rpx;
			border-bottom: 1rpx dashed #cccccc;
			
			.img{
				width: 180rpx;
				height: 180rpx;
				margin-right: 20rpx;
			}
			
			.desc{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				flex: 1;
				width: 0;
				
				.brand{
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 26rpx;
					
				}
				
				.line{
					display: flex;
					justify-content: space-between;
					margin-top: 10rpx;
				}
			}
			
		
		}
	}
	
	.nomore{
		text-align: center;
		font-size: 22rpx;
		color: #cccccc;
	}
</style>
