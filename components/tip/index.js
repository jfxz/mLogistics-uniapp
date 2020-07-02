import Vue from 'vue'
import Message from './tip.vue'

const messageBox = Vue.extend(Message)

Message.install = function (options, type) {
  let opt = {
		timer: 20000,
		msg: "无法连接到服务器~",
		type: "translucent",
		show: true
	}
  let instance = new messageBox({
    data: opt,
		ref: '22'
  }).$mount()

  // document.body.appendChild(instance.$el)
// document.body.appendChild(instance.$el)
console.log('instance', instance)
  Vue.nextTick(() => {
    instance.show = true
		instance.showTips(opt)
  })
}

export default Message