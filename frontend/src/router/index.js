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

// Mesma chave usada no login (localStorage.setItem)
const TOKEN_KEY = 'voleitcc_token';

const routes = [
  // =========================
  // ROTAS PÚBLICAS
  // =========================
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
    meta: { public: true },
  },

  // =========================
  // ROTAS PROTEGIDAS
  // =========================
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
    meta: { requiresAuth: true },
  },
  {
    path: '/times',
    name: 'times',
    component: ListaTimes,
    meta: { requiresAuth: true },
  },
  {
    path: '/times/cadastro',
    name: 'cadastro-times',
    component: CadastroTimes,
    meta: { requiresAuth: true },
  },
  {
    path: '/campeonatos',
    name: 'campeonatos',
    component: Campeonatos,
    meta: { requiresAuth: true },
  },
  {
    path: '/campeonatos/cadastro',
    name: 'cadastro-campeonato',
    component: CadastroCampeonato,
    meta: { requiresAuth: true },
  },
  {
    path: '/agendas',
    name: 'agendas',
    component: Agendas,
    meta: { requiresAuth: true },
  },
  {
    path: '/checklist',
    name: 'checklist',
    component: Checklist,
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
    meta: { requiresAuth: true },
  },

  // =========================
  // QUALQUER ROTA INEXISTENTE
  // =========================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// =========================
// PROTEÇÃO DAS ROTAS
// =========================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  // Rota protegida sem token: volta para o login
  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  // Já logado tentando acessar login/cadastro: vai para o início
  if (to.meta.public && token) {
    return next('/inicio');
  }

  next();
});

export default router;