<script>
	export default {
		onLaunch: function () {
			
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "components/colorui/main.css";
	@import "components/colorui/icon.css";
	/*每个页面公共css */
	@import "./common/uni.css";
	@import "./common/common.css";
	@import "./components/colorui/main.css";
  @import "./components/colorui/icon.css";
	.search-class {
		position: absolute;
		top: 320rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		height: 475rpx;
		width: calc(100% - 50rpx);
		margin: 0 25rpx;
		padding: 60rpx 60rpx;
		.search {
			button {
				margin-top:35rpx;
				background-image: linear-gradient(-90deg, 
						#41c989 0%, 
						#3ace6e 100%), 
					linear-gradient(
						#3ace6e, 
						#3ace6e);
					background-blend-mode: normal, 
						normal;
			}
		}
		.input-class {
			height: 120rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			input {
				border-bottom: solid 2rpx #e1e5e4;
				font-size: 38rpx;
				line-height: 33rpx;
				letter-spacing: 2rpx;
				color: #262626;
				height:100rpx;
			}
			.input1 {
				 &::before {
						content: " ";
						position: absolute;
						z-index: 9;
						margin-left: -20rpx;
						height: 15rpx;
						width: 15rpx;
						margin-top: 30rpx;
						border-radius: 50%;
						background: #41c989;
					}
			}
			.input2 {
				&::before {
					content: " ";
					position: absolute;
					z-index: 9;
					margin-left: -20rpx;
					height: 15rpx;
					width: 15rpx;
					margin-top: 30rpx;
					border-radius: 50%;
					background: #ef6161;
				}
			}
		}
	}
	.bottom-btn {
		height: 115rpx;
		background-color: #ffffff;
		width: 100%;
		position: fixed;
		bottom: 0;
		animation: btnMove 0.3s ease-in-out;
		display: flex;
		justify-content: space-between;
		border: solid 1rpx #e1e5e4;
		padding: 0 30rpx;
		z-index: 10;
		.right-btn {
			display: flex;
			.block-class {
				margin-right: 20rpx;
			}
		}
		.btn_left {
			color: #a6a6a6;
			font-size: 33rpx;
			// line-height: 115rpx;
			image {
				margin-top:15rpx;
				display: block;
				width: 43rpx;
				height: 43rpx;
				position:relative;
				left:50%;
				transform: translateX(-50%);
			}
		}
		.btn_right {
			width: 202rpx;
			height: 92rpx;
			background-image: linear-gradient(-90deg, 
				#41c989 0%, 
				#3ace6e 100%), 
			linear-gradient(
				#ffffff, 
				#ffffff);
			background-blend-mode: normal, 
				normal;
			border-radius: 46rpx;
			color: #ffffff;
			line-height: 92rpx;
			font-weight: bold;
			text-align: center;
			font-size: 33rpx;
			margin-top: 10rpx;
			&.btn1 {
				color: #3ace6e;
				background: #FFFFFF;
				border: solid 2rpx #3ace6e;
			}
		}
	}
</style>
