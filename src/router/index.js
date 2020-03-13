import Vue from 'vue';
import VueRouter from 'vue-router';
import yiqingMap from '../views/yiqingMap.vue';
import worldMap from '../views/worldMap.vue';
import earth from '../views/earth-3d.vue';

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
  {
    path: '/earth',
    name: 'earth',
    component: earth,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
