import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastrar.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Campeonatos from '../views/Campeonatos.vue';
import CadastroCampeonato from '../views/CadastroCampeonato.vue';
import Agendas from '../views/Agendas.vue';
import Checklist from '../views/Checklist.vue';
import Perfil from '../views/Perfil.vue';

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

  // Agendas
  {
    path: '/agendas',
    name: 'agendas',
    component: Agendas,
  },

  // Checklist
  {
    path: '/checklist',
    name: 'checklist',
    component: Checklist,
  },

  // Perfil
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;