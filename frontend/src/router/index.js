import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastrar.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Partidas from '../views/Partidas.vue';
import Campeonatos from '../views/Campeonatos.vue';
import CadastroCampeonato from '../views/CadastroCampeonato.vue';

const routes = [

  // Login
  {
    path: '/',
    name: 'login',
    component: Login,
  },

  // Cadastro de usuário
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
  },

  // Página inicial
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
  },

  // Lista de times
  {
    path: '/times',
    name: 'times',
    component: ListaTimes,
  },

  // Cadastro de times
  {
    path: '/times/cadastro',
    name: 'cadastro-times',
    component: CadastroTimes,
  },

  // Partidas
  {
    path: '/partidas',
    name: 'partidas',
    component: Partidas,
  },

  // Campeonatos
  {
    path: '/campeonatos',
    name: 'campeonatos',
    component: Campeonatos,
  },

  // Cadastro de campeonato
  {
    path: '/campeonatos/cadastro',
    name: 'cadastro-campeonato',
    component: CadastroCampeonato,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;