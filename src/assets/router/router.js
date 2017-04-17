// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 子页面
import children from '../../component/children.vue'

const routes = [
  {
    path: '/login', // 登录
    component: resolve => require(['../../component/login.vue'],
      resolve),
    meta: { auth: false }
  },
  {
    path: '/children', // 子页面
    component: children,
    children: [
      {
        path: '/home', // 首页
        component: resolve => require(['../../component/home.vue'],
          resolve)
      },
      {
        path: '/commodityBrand', // 商品品牌
        component: resolve => require(['../../component/commodityBrand.vue'],
          resolve)
      },
      {
        path: '/commodityClassification', // 商品分类
        component: resolve => require(['../../component/commodityClassification.vue'],
          resolve)
      },
      {
        path: '/goodsPrivateColor', // 商品私有颜色
        component: resolve => require(['../../component/goodsPrivateColor.vue'],
          resolve)
      },
      {
        path: '/goodsPrivateSize', // 商品私有尺码
        component: resolve => require(['../../component/goodsPrivateSize.vue'],
          resolve)
      },
      {
        path: '/goodsPrivateProperty', // 商品私有属性
        component: resolve => require(['../../component/goodsPrivateProperty.vue'],
          resolve)
      },
      {
        path: '/goodsPrivatePropertyValues', // 商品私有属性值
        component: resolve => require(['../../component/goodsPrivatePropertyValues.vue'],
          resolve)
      },
      {
        path: '/addMerchandise', // 添加商品
        component: resolve => require(['../../component/addMerchandise.vue'],
          resolve)
      },
      {
        path: '/modificationMerchandise', // 修改商品
        component: resolve => require(['../../component/modificationMerchandise.vue'],
          resolve)
      },
      {
        path: '/listOfGoods', // 商品列表
        component: resolve => require(['../../component/listOfGoods.vue'],
          resolve)
      },
      {
        path: '/addRobotInstructions', // 机器人使用说明
        component: resolve => require(['../../component/addRobotInstructions.vue'],
          resolve)
      },
      {
        path: '/tvmFansList', // TVM吸粉列表
        component: resolve => require(['../../component/tvmFansList.vue'],
          resolve)
      },
      {
        path: '/privateBrandStores', // 设置自由品牌
        component: resolve => require(['../../component/privateBrandStores.vue'],
          resolve)
      },
      {
        path: '/goodsSetSwitch', // 商品设置的开关
        component: resolve => require(['../../component/goodsSetSwitch.vue'],
          resolve)
      },
      {
        path: '/add3DModel', // 3D模型上传
        component: resolve => require(['../../component/add3DModel.vue'],
          resolve)
      },
      {
        path: '/addCarouselDrawing', // 添加轮播图
        component: resolve => require(['../../component/addCarouselDrawing.vue'],
          resolve)
      },
      {
        path: '/trainingClassifyList', // 添加培训分类&&培训分类列表
        component: resolve => require(['../../component/trainingClassifyList.vue'],
          resolve)
      },
      {
        path: '/addTraining', // 添加培训详情
        component: resolve => require(['../../component/addTraining.vue'],
          resolve)
      },
      {
        path: '/trainingList', // 培训列表
        component: resolve => require(['../../component/trainingList.vue'],
          resolve)
      }
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 输出router
export default router
