<template>
	<view class="abnormal">
		<arrow name="异常处理" v-if="jumpFlag"></arrow>
		<view class="top" v-if="jumpFlag"></view>
		<search ref="search" :sty="jumpFlag" @mainChange="mainChange" @hawChange="hawbChange" @getData="getData('manual')"></search>
		<!-- <view class="search-class" :style="{top: jumpFlag ? '130rpx' : '320rpx'}">
			<view class="input-class">
				<input class="uni-input input1" :value="filters.mainBill" @input="mainChange" placeholder="请扫描/输入主单号"/>
				<text class="uni-icon" style="line-height: 2.3;" v-if="showMainClearIcon" @click="clearMainIcon">&#xe434;</text>
			</view>
			
			<view class="input-class">
				<input class="uni-input input2" :value="filters.hawbBill" @input="hawbChange" placeholder="请扫描/输入分单号"/>
				<text class="uni-icon" style="line-height: 2.3;" v-if="showHawbClearIcon" @click="clearHawbIcon">&#xe434;</text>
			</view>
			
			<view class="search">
				<button type="primary" @tap="getData">搜索</button>
			</view>
		</view> -->
		<view class="msg-class" :animation="animationData" v-if="dataFlag" :style="{top: jumpFlag ? '600rpx' : '60rpx'}">
			<view class="title-img">
				<image src="../../static/ano-msg.png" mode="aspectFit"></image>
			</view>
			<view class="main-title">
				异常信息
			</view>
			<view class="detail-flex">
				<!-- <view class="abn-num">
					<view class="value abn">
						{{form.abnNum === null ? '' : form.abnNum}}
					</view>
					<view class="label abn">
						异常件数
					</view>
				</view> -->
				<view class="tol-num">
					<view class="value">
						{{wbform.numTotal === null ? '' : wbform.numTotal}}
					</view>
					<view class="label">
						总件数
					</view>
				</view>
				
				<view class="tol-weight">
					<view class="value">
						{{wbform.wgtTotal === null ? '' : wbform.wgtTotal}}
					</view>
					<view class="label">
						总重量
					</view>
				</view>
			</view>
			<view class="contend">
				<view class="abn-weight">
					<view class="label">
						异常件数
					</view>
					<view class="value">
						<input type="number" :value="form.abnNum" @input="numberChange"/>
					</view>
				</view>
				<view class="abn-weight">
					<view class="label">
						异常重量
					</view>
					<view class="value">
						<input type="number" :value="form.abnWgt" @input="weightChange"/>
					</view>
				</view>
				<view class="abn-weight">
					<view class="label">
						异常类型
					</view>
					<view class="value">
						<picker @change="typeChange" :value="typeIndex" :range="abnTypeArr">
							<view class="picker">
								<text style="margin-right: 0">{{typeIndex>-1?abnTypeArr[typeIndex]:''}}</text>
							</view>
						</picker>
						<!-- <image style="width: 19rpx;height: 32rpx;" src="../../static/arrow_left.png" mode="aspectFit"></image> -->
					</view>
				</view>
				<view class="mid">
					<view class="letter">
						<view class="grid margin-bottom text-center col-3">
							<view class="padding">
								<view class="label">A</view>
								<view class="value"><input type="number" :value="form.numAn" @input="letterAChange"/></view>
							</view>
							<view class="padding">
								<view class="label">C</view>
								<view class="value"><input type="number" :value="form.numCn" @input="letterCChange"/></view>
							</view>
							<view class="padding">
								<view class="label">P</view>
								<view class="value"><input type="number" :value="form.numPn" @input="letterPChange"/></view>
							</view>
						</view>
						
						<view class="grid margin-bottom text-center col-3">
							<view class="padding">
								<view class="label">L</view>
								<view class="value"><input type="number" :value="form.numLn" @input="letterLChange"/></view>
							</view>
							<view class="padding">
								<view class="label">S</view>
								<view class="value"><input type="number" :value="form.numSn" @input="letterSChange"/></view>
							</view>
							<view class="padding">
								<view class="label">T</view>
								<view class="value"><input type="number" :value="form.numTn" @input="letterTChange"/></view>
							</view>
						</view>
						
						<view class="grid margin-bottom text-center col-3">
							<view class="padding">
								<view class="label">M</view>
								<view class="value"><input type="number" :value="form.numMn" @input="letterMChange"/></view>
							</view>
							<view class="padding">
								<view class="label">H</view>
								<view class="value"><input type="number" :value="form.numHn" @input="letterHChange"/></view>
							</view>
							<view class="padding">
								<view class="label">Q1</view>
								<view class="value"><input type="number" :value="form.numQn1" @input="letterQ1Change"/></view>
							</view>
						</view>
						
						<view class="grid margin-bottom text-center col-3">
							<view class="padding">
								<view class="label">Q2</view>
								<view class="value"><input type="number" :value="form.numQn2" @input="letterQ2Change"/></view>
							</view>
							<view class="padding">
								<view class="label">A+P</view>
								<view class="value"><input type="number" :value="form.numAp" @input="letterAPChange"/></view>
							</view>
							<view class="padding">
								<view class="label">A+C</view>
								<view class="value"><input type="number" :value="form.numAc" @input="letterACChange"/></view>
							</view>
						</view>
						
						<view class="grid margin-bottom text-center col-3">
							<view class="padding">
								<view class="label" style="position:relative;left:-40rpx;">A+P+C</view>
								<view class="value"><input type="number" :value="form.numApc" @input="letterAPCChange"/></view>
							</view>
							<view class="padding">
								<view class="label">P+C</view>
								<view class="value"><input type="number" :value="form.numPc" @input="letterPCChange"/></view>
							</view>
							<view class="padding">
							</view>
						</view>
					</view>
					<view class="abnReason">
						<view class="label">
							异常原因
						</view>
						<view class="value">
							<input type="text" placeholder="请输入异常原因(50字)..." :value="form.abnReason" @input="abnReasonChange"/>
						</view>
					</view>
					
					<view class="abnReason">
						<view class="label">
							处理意见
						</view>
						<view class="value">
							<input type="text" placeholder="请输入处理意见(50字)..." :value="form.dealSuggestion" @input="dealSuggestionChange"/>
						</view>
					</view>
					<view class="abnImage">
						<view class="label">
							异常图片
						</view>
							<view class="grid col-4 grid-square flex-sub">
								<view class="bg-img" v-for="(item,index) in formatImgList" :key="index" @tap="previewImage(index)" :data-url="imgList[index]">
								 <image :src="formatImgList[index]" mode="aspectFill"></image>
									<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
										<text class='cuIcon-close'></text>
									</view>
								</view>
								<view class="solids" @tap="chooseImage">
									<text class='cuIcon-cameraadd' style="background-color: #f5f5f5;"></text>
								</view>
							</view>
					</view>
					
					<view class="case">
						<view class="label">
							是否结案
						</view>
						<view class="value">
							<!-- <switch :class="isDealOver === '1'?'checked':''" :checked="isDealOver === '1'?true:false" @change="caseChange" /> -->
							<switch :checked="isDealOver === '1'" @change="caseChange" />
						</view>
						
					</view>
				</view>
			</view>
		</view>
		<view :animation="animationData2" v-if="btnShow && jumpFlag">
			<foot-btn @clear="clear">
				<template slot="btn1">
					<view class="btn_right btn1" @tap="next()">
						<text class="btn_mid">下一个</text>
					</view>
				</template>
				<template slot="btn2">
					<view class="btn_right" @tap="save">
						保存
					</view>
				</template>
			</foot-btn>
		</view>
	</view>
</template>

<script>
	import {baseUrl} from '@/common/apiConfig.js'
	import footBtn from '@/components/footBtn.vue'
	import arrow	from '@/components/arrow/arrow.vue'
	import search from '@/components/search.vue'
	// import { mapGetters } from 'vuex'
	import {cartoon, deepCopy} from '@/common/util/util.js'
	import {getAbnMsg, abnSave, delImg} from '@/common/api/enter/abnormal.js'
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	var imageType = {
		'data:image/gif;': 'gif',
		'data:image/png;': 'png',
		'data:image/jpeg;': 'jpeg',
		'data:image/x-icon;': 'icon'
	}
	export default {
		components: {search, arrow, footBtn},
		data() {
			return {
				dataFlag: false,
				currenIndex: 0,
				btnShow: false,
				animationData: {},
				animationData2: {},
				jumpFlag: false,
				baselist: [],
				saveImg: [],
				getAbnList: {},
				formatImgList: [],
				filters: {
					mainBill: '',
					hawbBill: ''
				},
				showMainClearIcon: false,
				showHawbClearIcon: false,
				typeIndex: -1,
				abnTypeArr: [],
				wbform: {
					numTotal: '',
					wgtTotal: ''
				},
				form: {
					abnNum: '',
					abnWgt: '',
					abnType: '',
					abnReason : '',
					dealSuggestion : '',
					numAn: '',
					numCn: '',
					numPn: '',
					numLn: '',
					numSn: '',
					numTn: '',
					numMn: '',
					numHn: '',
					numQn1: '',
					numQn2: '',
					numAp: '',
					numAc: '',
					numApc: '',
					numPc: ''
				},
				isDealOver: '',
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				sizeTypeIndex: 1,
				sizeType: ['压缩', '原图', '压缩或原图'],
				sourceTypeIndex: 2,
				imgList: [],
				sourceType: ['拍照', '相册', '拍照或相册']
			}
		},
		computed: {
			// ...mapGetters(['dic'])
		},
		onReady () {
			console.log(222, this.$store.state)
			this.abnTypeArr = this.$store.state.dic.abnType_dic.map(item => {return `${item.abnCode}(${item.abnChs})`})
		},
		onLoad (val) {
			this.currenIndex = 0
			if ('mainBill' in val) {
				this.jumpFlag = true
				this.filters = {...val}
				console.log(this.$refs)
				this.$nextTick(function(){
					setTimeout(() => {
						this.$refs.search.addMain(this.filters.mainBill)
						this.$refs.search.addHaw(this.filters.hawbBill,this.filters.mainBill)
						this.getData()
					}, 100)
				})
				
			} else {
				this.jumpFlag = false
			}
			console.log(111, val)
		},
		methods: {
			initForm (flag) {
				// Object.keys(this.wbform).forEach(item => {
				// 	this.wbform[item] = ''
				// })
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
					if (item === 'id') {
						delete this.form[item]
					}
				})
				if (flag !== 'flag') {
					this.currenIndex ++
				}
				this.isDealOver = '0'
				this.imgList = []
				this.formatImgList = []
				this.typeIndex = -1
				if (flag !== 'flag') {
					this.form['wbId'] = this.wbform.id
					this.form['wbNo'] = this.wbform.wbNo
					this.form['wbPrefix'] = this.wbform.wbPrefix
				}
			},
			next () {
				if (this.currenIndex + 1 >= this.getAbnList.abnregList.length) {
					this.initForm()
				} else {
					this.currenIndex ++
					Object.keys(this.form).forEach(item => {
						this.form[item] = ''
						if (item === 'id') {
							delete this.form[item]
						}
					})
					this.isDealOver = '0'
					this.imgList = []
					this.formatImgList = []
					this.typeIndex = -1
					this.form = Object.assign({}, this.getAbnList.abnregList[this.currenIndex])
					let filterPhoto = this.getAbnList.abnregphotoList.filter(item => item.abnId === this.form.id)
					// this.imgList = filterPhoto
					this.formatImgList = filterPhoto.map(i => i.photoName)
					this.saveImg = filterPhoto
					// this.imgList = this.getAbnList.abnregphotoList
					this.isDealOver = this.getAbnList.abnregList[this.currenIndex].isDealOver
					this.typeIndex = this.$store.state.dic.abnType_dic.findIndex(item => item.abnCode === this.form.abnType)
				}
			},
			save () {
				console.log('abnregList', this.getAbnList.abnregList[this.currenIndex])
				if (this.getAbnList.abnregList && this.getAbnList.abnregList[this.currenIndex] && this.getAbnList.abnregList[this.currenIndex].isDealOver === '1') {
					this.getAbnList.abnregList[this.currenIndex]['isDealOver'] = this.isDealOver
				}
				let isDealOver = this.getAbnList.abnregList[this.currenIndex] ? this.getAbnList.abnregList[this.currenIndex].isDealOver : '0'
				if (isDealOver === '1') {
					this.$message('该异常已结案，不可修改，请先取消结案')
					return
				}
				if (this.form.abnType === '') {
					this.$message('异常类型不能为空')
					return
				}
				if (this.form.abnNum === '') {
					this.$message('异常件数不能为空')
					return
				}
				if (this.form.abnReason && this.form.abnReason.length > 50) {
						this.$message('异常原因字数不能超过50字')
						return
				}
				if (this.form.dealSuggestion && this.form.dealSuggestion.length > 50) {
					this.$message('处理意见字数不能超过50字')
					return
				}
				console.log('getAbnList', this.getAbnList)
				let para = {
					wbId: this.wbform.id,
					wbPrefix: this.wbform.wbPrefix,
					wbNo: this.wbform.wbNo
				}
				this.getAbnList.abnregList[this.currenIndex] = Object.assign({}, para, {files: this.imgList}, this.form, {isDealOver: this.isDealOver})
				this.getAbnList.abnregList[this.currenIndex]['isDealOver'] = this.isDealOver
				this.$loading('保存中')
				abnSave(this.getAbnList.abnregList[this.currenIndex]).then(res => {
					if (res.status) {
						console.log(1111122222222, this.imgList)
						if (this.imgList.length !== 0) {
							let count = this.imgList.length
							this.imgList.forEach((item, index) => {
								uni.uploadFile({
										url: baseUrl + '/inaabnreg/saveInaAbnRegPhoto', //仅为示例，非真实的接口地址
										files: [item],
										formData: {
												'wbId': this.wbform.id,
												'abnId': this.form.id
										},
										header: {
											Authorization: 'Bearer ' + uni.getStorageSync('access_token')
										},
										success: (uploadFileRes) => {
											if (count === index + 1) {
												this.$message('成功')
												console.log('success', uploadFileRes);
												uni.hideLoading()
												this.getData()
											}
											
										},
										fail: (err) => {
											console.log('err', err)
											uni.hideLoading()
										}
								});
							})
							
						} else {
							this.$message(res.message)
							this.getData()
						}
						// this.getData()
					} else {
						this.$message(res.message)
					}
					// console.log(res)
				})
			},
			getData (flag) {
				if (flag === 'manual') {
					this.currenIndex = 0
					console.log('manualmanualmanual')
				}
				console.log('currenIndex', this.currenIndex)
				this.isDealOver = '0'
				this.imgList = []
				this.typeIndex = -1
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				Object.keys(this.wbform).forEach(item => {
					this.wbform[item] = ''
				})
				let para = {
					wbNo: this.filters.hawbBill,
					wbprefix: this.filters.mainBill
				}
				if (!this.filters.hawbBill && this.filters.mainBill) {
					para = {
						wbNo: this.filters.mainBill.substring(3, this.filters.mainBill.length),
						wbprefix: this.filters.mainBill.substring(0, 3)
					}
				}
				if (!this.filters.mainBill) {
					this.$message('请输入运单号')
					return
				}
				this.getAbnList['abnregList'] = []
				this.$loading('加载中')
				getAbnMsg(para).then(res => {
					if (res.status) {
						this.dataFlag = true
						cartoon(this)
						this.wbform = Object.assign({}, res.data.wbinfo)
					}
					if (res.status && res.data.abnregList.length !== 0) {
						this.getAbnList = res.data
						this.form = Object.assign({}, this.getAbnList.abnregList[this.currenIndex])
						let filterPhoto = this.getAbnList.abnregphotoList.filter(item => item.abnId === this.form.id)
						this.saveImg = filterPhoto
						console.log('filterPhoto', filterPhoto)
						this.formatImgList = filterPhoto.map(i => i.photoName)
						this.isDealOver = this.getAbnList.abnregList[this.currenIndex].isDealOver
						this.typeIndex = this.$store.state.dic.abnType_dic.findIndex(item => item.abnCode === this.form.abnType)
						this.$message(res.message)
					} else {
						this.initForm('flag')
						this.$message(res.message)
					}
					uni.hideLoading()
				})
			},
			// 清空主单、分单
			clearMainIcon () {
				this.filters.mainBill = ''
				this.showMainClearIcon = false
			},
			clearHawbIcon () {
				this.filters.hawbBill = ''
				this.showHawbClearIcon = false
			},
			// 主单、分单改变监听
			mainChange (val) {
				this.filters.mainBill = val
				// if (val.detail.value.length > 0) {
				//     this.showMainClearIcon = true;
				// } else {
				//     this.showMainClearIcon = false;
				// }
			},
			hawbChange (val) {
				this.filters.hawbBill = val
				// if (val.detail.value.length > 0) {
				//     this.showHawbClearIcon = true;
				// } else {
				//     this.showHawbClearIcon = false;
				// }
			},
			numberChange (val) {
				this.form.abnNum = val.target.value
			},
			weightChange (val) {
				this.form.abnWgt = val.target.value
			},
			typeChange (e) {
				if (Number(e.detail.value) === -1) {
					this.typeIndex = 0
				} else {
					this.typeIndex = e.detail.value
				}
				this.form.abnType = this.$store.state.dic.abnType_dic[this.typeIndex].abnCode
			},
			clear () {
				this.isDealOver = '0'
				this.imgList = []
				this.typeIndex = -1
				// this.clearMainIcon()
				// this.clearHawbIcon()
				if (this.jumpFlag) {
					uni.pageScrollTo({
					    scrollTop: 0,
					    duration: 300
					})
				}
				Object.keys(this.form).forEach(item => {
					this.form[item] = ''
				})
				this.$refs.search.clear()
			},
			caseChange (e) {
				if (e.target.value) {
					this.isDealOver = '1'
				} else {
					this.isDealOver = '0'
				}
			},
			DelImg(e) {
				console.log(e)
				uni.showModal({
					title: '删除图片',
					content: '确定要删除这张图片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							if (this.saveImg && this.saveImg[e.currentTarget.dataset.index]) {
								delImg({photoId: this.saveImg[e.currentTarget.dataset.index].id}).then(res => {
									if (res.status) {
										this.$message(res.message)
										this.saveImg.splice(e.currentTarget.dataset.index, 1)
										this.formatImgList.splice(e.currentTarget.dataset.index, 1)
									} else {
										this.$message(res.message)
									}
									this.getData()
								})
							} else {
								this.formatImgList.splice(e.currentTarget.dataset.index, 1)
								this.imgList.splice(e.currentTarget.dataset.index, 1)
							}
							// this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			chooseImage: async function() {
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif
			
				if (this.imgList.length >= 9) {
					console.log("是否继续?");
					this.$message('最多可上传9张照片')
					return
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imgList.length + this.count[this.countIndex] > 9 ? 9 - this.imgList.length : this.count[this.countIndex],
					success: (res) => {
						console.log(res)
						// if ((res.tempFiles[0].size / 1024) > 4000) {
						// 	this.$message('上传图片不能超过500k')
						// 	return
						// }
						let img = []
						res.tempFilePaths.forEach(item => {
							img.push({uri: item})
						})
						this.imgList = this.imgList.concat(img)
						this.formatImgList = this.formatImgList.concat(res.tempFilePaths)
						console.log('imgList', this.imgList)
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			previewImage (index) {
				var current = index
				console.log(index)
				uni.previewImage({
					current: current,
					urls: this.formatImgList
				})
			},
			abnReasonChange (val) {
				this.form.abnReason = val.target.value
			},
			dealSuggestionChange (val) {
				this.form.dealSuggestion = val.target.value
			},
			letterAChange (val) {
				this.form.numAn = val.target.value
			},
			letterCChange (val) {
				this.form.numCn = val.target.value
			},
			letterPChange (val) {
				this.form.numPn = val.target.value
			},
			letterLChange (val) {
				this.form.numLn = val.target.value
			},
			letterSChange (val) {
				this.form.numSn = val.target.value
			},
			letterTChange (val) {
				this.form.numTn = val.target.value
			},
			letterMChange (val) {
				this.form.numMn = val.target.value
			},
			letterHChange (val) {
				this.form.numHn = val.target.value
			},
			letterQ1Change (val) {
				this.form.numQn1 = val.target.value
			},
			letterQ2Change (val) {
				this.form.numQn2 = val.target.value
			},
			letterAPChange (val) {
				this.form.numAp = val.target.value
			},
			letterACChange (val) {
				this.form.numAc = val.target.value
			},
			letterAPCChange (val) {
				this.form.numApc = val.target.value
			},
			letterPCChange (val) {
				this.form.numPc = val.target.value
			}
		},
		onPageScroll (top) {
			let vm = this
			vm.animationData2 = {}
			let animation = uni.createAnimation({
				duration: 100,
				timingFunction: 'ease-in-out',
			})
			if (top.scrollTop < 10) {
				// animation.translateY(20).step()
				vm.animationData2 = animation.export()
				setTimeout(function() {
					vm.btnShow = false
					vm.animationData2 = {}
				}, 100)
			} else {
				setTimeout(() => {
					vm.btnShow = true
				}, 100)
				
			}
		}
	}
</script>

<style lang="scss">
	.abnormal {
		// padding-top: 50rpx;
		.top {
			position: absolute;
			top: 0;
			width: 100%;
			height: 384rpx;
			z-index: -1;
			// background: #1AAD19;
			background-image: linear-gradient(-90deg, 
					#3ace6e 0%, 
					#41c989 100%), 
				linear-gradient(
					#3ace6e, 
					#3ace6e);
				background-blend-mode: normal, normal;
		}
	}
	.msg-class {
		position: relative;
		height: 314rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		// width: 100%;
		margin: 0 25rpx;
		padding-top: 60rpx;
		left: 720px;
		top: 60rpx;
		.mid {
			.case {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;
			}
			.abnImage {
				padding: 30rpx 0;
				border-bottom: 1rpx solid #e1e5e4;
				.label {
					font-size: 31rpx;
					line-height: 33rpx;
					color: #262626;
					margin-bottom: 30rpx;
				}
			}
			.abnReason {
				padding: 30rpx 0;
				border-bottom: 1rpx solid #e1e5e4;
				.label {
					font-size: 31rpx;
					line-height: 33rpx;
					color: #262626;
				}
				.value {
					input {
						font-size: 31rpx;
						height: 92rpx;
						background-color: #f5f5f5;
						border-radius: 46rpx;
						margin-top: 30rpx;
						padding: 0 20rpx;
					}
				}
			}
			.letter {
				padding: 30rpx 0rpx;
				border-bottom: 1rpx solid #e1e5e4;
				.padding {
					display: flex;
					justify-content: center;
					padding: 0;
					.label {
						line-height:73rpx;
						font-size: 31rpx;
						letter-spacing: 2rpx;
						color: #595959;
						width: 60rpx;
					}
					.value {
						margin-left: 10rpx;
						width: 139rpx;
						input {
							height: 73rpx;
							border-radius: 10rpx;
							border: solid 1rpx #d9d9d9;
							color: #262626;
							font-size: 35rpx;
						}
					}
				}
			}
		}
		.contend {
			background-color: #ffffff;
			border-radius: 10rpx;
			margin-top: 80rpx;
			padding: 0 20px;
			margin-bottom: 150rpx;
			.abn-weight {
				display: flex;
				justify-content: space-between;
				height: 80rpx;
				border-bottom: 1rpx solid #e1e5e4;
				.label {
					color: #595959;
					font-size: 31rpx;
					line-height: 80rpx;
				}
				.value {
					color: #262626;
					font-size: 35rpx;
					line-height: 80rpx;
					input {
						height:80rpx;
						line-height:80rpx;
						text-align:right;
					}
					image {
						margin-left: 20rpx;
					}
					picker {
						position: relative;
						z-index: 2;
					}
					.picker {
						line-height: 100upx;
						font-size: 28upx;
						// text-overflow: ellipsis;
						// white-space: nowrap;
						// overflow: hidden;
						width: 400rpx;
						height: 80rpx;
						text-align: right;
						text {
								color: #262626;
								font-size: 35rpx;
								line-height: 80rpx;
								display: inline-block;
								margin-right: 30rpx;
								position:relative;
								right:30rpx;
								bottom:10rpx;
						}
					}
					
					picker::after {
						z-index: 1;
						font-family: cuIcon;
						display: block;
						content: "\e6a3";
						position: absolute;
						font-size: 34upx;
						color: #8799a3;
						line-height: 100upx;
						width: 10upx;
						text-align: center;
						// top: 0;
						bottom: -10rpx;
						right: 20rpx;
						margin: auto;
					}
				}
			}
		}
		.title-img {
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%, -50%);
			image {
				width: 126rpx;
				height: 126rpx;
			}
		}
		.detail-flex {
			display: flex;
			justify-content: space-around;
			.label {
				text-align: center;
				width: 150rpx;
				font-size: 29rpx;
				color: #a6a6a6;
				&.abn {
					color: #f32d2d;
				}
			}
			.value {
				padding-top: 30rpx;
				width: 150rpx;
				height: 100rpx;
				font-size: 50rpx;
				color: #262626;
				text-align: center;
				&.abn {
					color: #f32d2d;
				}
			}
		}
		.main-title {
			color: #262626;
			font-size: 38rpx;
			text-align: center;
			font-weight: bold;
		}
	}
</style>
