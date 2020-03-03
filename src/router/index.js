import Vue from 'vue';
import VueRouter from 'vue-router';
import yiqingMap from '../views/yiqingMap.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'yiqingMap',
    component: yiqingMap,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
