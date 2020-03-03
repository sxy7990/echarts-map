import Vue from 'vue';
import VueRouter from 'vue-router';
import yiqingMap from '../views/yiqingMap.vue';
import worldMap from '../views/worldMap.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'yiqingMap',
    component: yiqingMap,
  },
  {
    path: '/worldMap',
    name: 'worldMap',
    component: worldMap,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
