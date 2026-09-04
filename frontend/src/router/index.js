import { createRouter, createWebHistory } from 'vue-router';
<<<<<<< HEAD

import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastrar.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Partidas from '../views/Partidas.vue'
=======
import Login from '../views/Login.vue';
import CadastroTimes from '../views/CadastroTimes.vue';
import Inicio from '../views/Inicio.vue';
import ListaTimes from '../views/ListaTimes.vue';
import Campeonatos from '../views/Campeonatos.vue';
import CadastroCampeonato from '../views/CadastroCampeonato.vue';
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
<<<<<<< HEAD

  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro,
  },

=======
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693
  {
    path: '/inicio',
    name: 'inicio',
    component: Inicio,
  },
<<<<<<< HEAD

=======
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693
  {
    path: '/times',
    name: 'times',
    component: ListaTimes,
  },
<<<<<<< HEAD

=======
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693
  {
    path: '/times/cadastro',
    name: 'cadastro-times',
    component: CadastroTimes,
  },
<<<<<<< HEAD

  {
    path: '/partidas',
    name: 'partidas',
    component:Partidas,
  },
=======
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
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;