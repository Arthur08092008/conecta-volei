import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
  },
  {
    path: '/times/cadastro',
    name: 'cadastro-times',
    component: CadastroTimes,
  },
  // As proximas telas (cadastro de jogadores, partidas)
  // entram aqui como novas rotas conforme forem criadas.
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;