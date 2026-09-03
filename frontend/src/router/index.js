import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastrar.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Partidas from '../views/Partidas.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },

  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
  },

  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
  },

  {
    path: '/times',
    name: 'times',
    component: ListaTimes,
  },

  {
    path: '/times/cadastro',
    name: 'cadastro-times',
    component: CadastroTimes,
  },

  {
    path: '/partidas',
    name: 'partidas',
    component:Partidas,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;