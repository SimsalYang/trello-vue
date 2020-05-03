import Vue from 'vue';
import VMessage from './VMessage.vue';

// 把对象变成构造函数
const VMessageClass = Vue.extend(VMessage);

let instances = [];
/**
 * 工厂函数
 * 调用一次，创建一个 VMessage 对象
 * 管理 VMessage 组件对象队列
 */
function Message(data) {
  data = data || {};

  // 如果传入的是字符串，那么直接做 message 处理
  if (typeof data === 'string') {
    data = {
      message: data
    }
  }

  // 为实例添加 onClose 方法
  data.onClose = function () {
    // console.log('close');
    Message.close(instance);
  }

  let instance = new VMessageClass({
    data
  });

  instance.$mount(); // $el
  document.body.appendChild(instance.$el);
  // 固定的偏移值
  let offset = data.offset || 20;
  // 动态增加的偏移值
  let offsetTop = offset;
  instances.forEach(item => {
    offsetTop += item.$el.offsetHeight + offset;
  });
  instance.$el.style.top = offsetTop + 'px';
  instances.push(instance);
}

/**
 * 为 Message 扩充静态方法
 * 方便调用
 */
// 通过数组的方式批量生成函数
['info', 'success', 'error', 'warning'].forEach(type => {
  Message[type] = function (data) {
    if (typeof data === 'string') {
      data = {
        message: data
      }
    }
    data.type = type;
    return Message(data);
  }
});

Message.close = function (instance) {
  /**
   * 获取当前实例的高度
   * 把当前实例后面的所有实例 top 减去这个高度，再减去 偏移值
   * 得到后面每一个的偏移值
   */
  // 计算出当前消失的实例的消失的高度，等于本身的便宜高度加上实例固定便宜高度
  let removeHeight = instance.$el.offsetHeight + instance.offset;
  // 找到当前消失的实例索引
  let index = instances.findIndex(item => item === instance);
  // 从实例数组中移除消失的实例
  instances = instances.filter(item => item !== instance);
  // 从消失的实例开始循环计算后面所有实例的偏移高度
  for (let i = index; i < instances.length; i++) {
    instances[i].$el.style.top = parseFloat(instances[i].$el.style.top) - removeHeight + 'px';
  }
}

export default Message;