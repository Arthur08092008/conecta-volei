import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Campeonatos from '../views/Campeonatos.vue';
import CadastroCampeonato from '../views/CadastroCampeonato.vue';

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
    path: '/campeonatos',
    name: 'campeonatos',
    component: Campeonatos,
  },
  {
    path: '/campeonatos/cadastro',
    name: 'cadastro-campeonato',
    component: CadastroCampeonato,
  },
  // As proximas telas (cadastro de jogadores, partidas)
  // entram aqui como novas rotas conforme forem criadas.
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;