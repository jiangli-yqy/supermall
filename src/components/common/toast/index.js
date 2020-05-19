import Toast from './Toast'
const obj = {}


// install执行会默认传入Vue
obj.install = function (Vue) {
  // console.log("执行了obj的install函数");

  // document.body.appendChild(Toast.$el)  toast组件元素可能还没创建出来，所以不能挂载

  // 1、创建组件构造器
  const toastConstructor = Vue.extend(Toast);

  // 2、new的方式，根据组件构造器，可以创建出来一个组件对象
  const toast = new toastConstructor();

  //3、将组件对象手动挂载到某一个元素上
  toast.$mount(document.createElement('div'));

  // 4、Toast.$el 对应的就是这个div，再挂载组件对象
  document.body.appendChild(toast.$el);


  Vue.prototype.$toast = toast;
}

export default obj