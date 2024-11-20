import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import OpinionsView from '../views/OpinionsView.vue';
import AdministrationView from '../views/AdministrationView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/opinions/:gameName', name: 'Opinions', component: OpinionsView },
  { path: '/admin', name: 'Administration', component: AdministrationView },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
