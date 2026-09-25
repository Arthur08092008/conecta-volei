```vue
<template>
  <div class="app-shell">

    <Sidebar />

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="content">

      <!-- TOPO -->
      <div class="topo">

        <div>
          <h1>Agendas</h1>
          <p class="subtitulo">
            Calendário de partidas dos campeonatos
          </p>
        </div>

        <!-- BOTÃO VOLTAR -->
        <button
          class="btn-voltar"
          type="button"
          @click="voltar"
        >
          <Icon
            icon="carbon:return"
            width="24"
            height="24"
          />
          <span>Voltar</span>
        </button>

      </div>

      <!-- FILTRO DE CAMPEONATO -->
      <div class="filtro-wrap">

        <label for="campeonato">
          Campeonato
        </label>

        <select
          id="campeonato"
          v-model="campeonatoSelecionado"
          @change="carregarPartidas"
        >
          <option value="">
            Todos os campeonatos
          </option>

          <option
            v-for="c in campeonatos"
            :key="c.id"
            :value="c.id"
          >
            {{ c.nome }}
          </option>
        </select>

      </div>

      <!-- NAVEGAÇÃO DO MÊS -->
      <div class="calendario-header">

        <button
          class="nav-mes"
          type="button"
          @click="mesAnterior"
        >
          ‹
        </button>

        <h2>
          {{ nomeMes }} {{ ano }}
        </h2>

        <button
          class="nav-mes"
          type="button"
          @click="mesSeguinte"
        >
          ›
        </button>

      </div>

      <!-- CARREGANDO -->
      <p
        v-if="carregando"
        class="msg"
      >
        Carregando partidas...
      </p>

      <!-- ERRO -->
      <p
        v-else-if="erro"
        class="msg erro"
      >
        {{ erro }}
      </p>

      <!-- CALENDÁRIO -->
      <div
        v-else
        class="calendario-wrap"
      >

        <!-- DIAS DA SEMANA -->
        <div class="dias-semana">

          <span
            v-for="d in diasSemana"
            :key="d"
          >
            {{ d }}
          </span>

        </div>

        <!-- GRADE -->
        <div class="grade">

          <div
            v-for="(dia, index) in diasDoMes"
            :key="index"
            class="celula-dia"
            :class="{ 'celula-vazia': !dia }"
          >

            <!-- NÚMERO DO DIA -->
            <span
              v-if="dia"
              class="numero-dia"
            >
              {{ dia.numero }}
            </span>

            <!-- PARTIDAS -->
            <div
              v-for="jogo in dia?.partidas"
              :key="jogo.id"
              class="jogo-chip"
              :title="`${jogo.mandante} x ${jogo.visitante}`"
            >

              <span
                v-if="jogo.horario"
                class="jogo-horario"
              >
                {{ formatarHorario(jogo.horario) }}
              </span>

              {{ jogo.mandante }} x {{ jogo.visitante }}

            </div>

          </div>

        </div>

      </div>

    </main>

  </div>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue';

import { Icon } from '@iconify/vue';

import api from '../services/api';

import Sidebar from '../components/Sidebar.vue';


/* =========================
   ESTADOS
========================= */

const carregando = ref(false);

const erro = ref('');

const campeonatos = ref([]);

const campeonatoSelecionado = ref('');

const partidas = ref([]);


/* =========================
   DATA ATUAL
========================= */

const hoje = new Date();

const mes = ref(
  hoje.getMonth() + 1
);

const ano = ref(
  hoje.getFullYear()
);


/* =========================
   DIAS E MESES
========================= */

const diasSemana = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb'
];

const nomesMeses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];


const nomeMes = computed(() => {
  return nomesMeses[mes.value - 1];
});


/* =========================
   VOLTAR
========================= */

function voltar() {
  window.history.back();
}


/* =========================
   CARREGAR CAMPEONATOS
========================= */

async function carregarCampeonatos() {

  try {

    const resposta = await api.get('/campeonatos');

    campeonatos.value = resposta.data;

  } catch (e) {

    console.error(
      'Erro ao carregar campeonatos:',
      e
    );

  }

}


/* =========================
   CARREGAR PARTIDAS
========================= */

async function carregarPartidas() {

  carregando.value = true;

  erro.value = '';

  try {

    const params = {
      mes: mes.value,
      ano: ano.value
    };

    if (campeonatoSelecionado.value) {

      params.campeonato_id =
        campeonatoSelecionado.value;

    }

    const resposta = await api.get(
      '/partidas',
      { params }
    );

    partidas.value = resposta.data;

  } catch (e) {

    console.error(
      'Erro ao carregar partidas:',
      e
    );

    erro.value =
      'Não foi possível carregar as partidas.';

  } finally {

    carregando.value = false;

  }

}


/* =========================
   MÊS ANTERIOR
========================= */

function mesAnterior() {

  if (mes.value === 1) {

    mes.value = 12;

    ano.value -= 1;

  } else {

    mes.value -= 1;

  }

  carregarPartidas();

}


/* =========================
   PRÓXIMO MÊS
========================= */

function mesSeguinte() {

  if (mes.value === 12) {

    mes.value = 1;

    ano.value += 1;

  } else {

    mes.value += 1;

  }

  carregarPartidas();

}


/* =========================
   FORMATAR HORÁRIO
========================= */

function formatarHorario(hms) {

  return hms
    ? hms.slice(0, 5)
    : '';

}


/* =========================
   MONTAR CALENDÁRIO
========================= */

const diasDoMes = computed(() => {

  const primeiroDia = new Date(
    ano.value,
    mes.value - 1,
    1
  );

  const ultimoDia = new Date(
    ano.value,
    mes.value,
    0
  );

  const totalDias =
    ultimoDia.getDate();

  const offset =
    primeiroDia.getDay();

  // Espaços vazios antes do primeiro dia
  const celulas =
    Array(offset).fill(null);


  // Adiciona os dias do mês
  for (
    let numero = 1;
    numero <= totalDias;
    numero++
  ) {

    const dataStr =
      `${ano.value}-${String(mes.value).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;


    const partidasDoDia =
      partidas.value.filter((p) => {

        const dataPartida =
          typeof p.data_jogo === 'string'
            ? p.data_jogo.slice(0, 10)
            : '';

        return dataPartida === dataStr;

      });


    celulas.push({
      numero,
      partidas: partidasDoDia
    });

  }


  return celulas;

});


/* =========================
   INICIALIZAÇÃO
========================= */

onMounted(async () => {

  await carregarCampeonatos();

  await carregarPartidas();

});

</script>


<style scoped>

/* =========================
   ESTRUTURA
========================= */

.app-shell {

  min-height: 100vh;

  display: flex;

  background: #f5f6fa;

  font-family:
    'Segoe UI',
    system-ui,
    -apple-system,
    sans-serif;

}


/* =========================
   CONTEÚDO
========================= */

.content {

  flex: 1;

  padding: 32px;

  overflow-y: auto;

  box-sizing: border-box;

}


/* =========================
   TOPO
========================= */

.topo {

  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 24px;

}


h1 {

  color: #0b1f4d;

  font-size: 26px;

  font-weight: 800;

  margin: 0;

}


.subtitulo {

  color: #6b7280;

  font-size: 14px;

  margin-top: 4px;

}


/* =========================
   BOTÃO VOLTAR
========================= */

.btn-voltar {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  width: 150px;

  padding: 10px 16px;

  border: none;

  border-radius: 8px;

  background: #6c757d;

  color: #fff;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;

}


.btn-voltar:hover {

  background: #5c636a;

  transform: translateY(-1px);

}


.btn-voltar svg {

  flex-shrink: 0;

}


/* =========================
   FILTRO
========================= */

.filtro-wrap {

  background: #fff;

  border-radius: 14px;

  padding: 16px 20px;

  margin-bottom: 20px;

  display: flex;

  flex-direction: column;

  gap: 6px;

  max-width: 340px;

  box-shadow:
    0 4px 16px rgba(20, 30, 60, 0.06);

}


.filtro-wrap label {

  font-size: 12.5px;

  font-weight: 700;

  color: #6b7280;

  text-transform: uppercase;

}


.filtro-wrap select {

  padding: 10px 12px;

  border: 1.5px solid #e2e6f0;

  border-radius: 8px;

  font-size: 14px;

  outline: none;

  background: #fff;

}


.filtro-wrap select:focus {

  border-color: #0b1f4d;

}


/* =========================
   CABEÇALHO DO CALENDÁRIO
========================= */

.calendario-header {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 16px;

  margin-bottom: 16px;

}


.calendario-header h2 {

  color: #0b1f4d;

  font-size: 18px;

  font-weight: 800;

  margin: 0;

  min-width: 160px;

  text-align: center;

}


.nav-mes {

  width: 34px;

  height: 34px;

  border-radius: 8px;

  border: 1.5px solid #e2e6f0;

  background: #fff;

  font-size: 18px;

  font-weight: 700;

  color: #0b1f4d;

  cursor: pointer;

}


.nav-mes:hover {

  border-color: #0b1f4d;

}


/* =========================
   MENSAGENS
========================= */

.msg {

  color: #6b7280;

  font-size: 14.5px;

  background: #fff;

  padding: 24px;

  border-radius: 14px;

  text-align: center;

}


.msg.erro {

  color: #c0392b;

}


/* =========================
   CALENDÁRIO
========================= */

.calendario-wrap {

  background: #fff;

  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 4px 16px rgba(20, 30, 60, 0.06);

  padding: 16px;

}


.dias-semana {

  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  margin-bottom: 8px;

}


.dias-semana span {

  text-align: center;

  font-size: 12px;

  font-weight: 700;

  color: #6b7280;

  text-transform: uppercase;

}


.grade {

  display: grid;

  grid-template-columns:
    repeat(7, 1fr);

  gap: 6px;

}


.celula-dia {

  min-height: 90px;

  border: 1px solid #eef0f5;

  border-radius: 10px;

  padding: 6px;

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.celula-vazia {

  border: none;

  background: transparent;

}


.numero-dia {

  font-size: 12.5px;

  font-weight: 700;

  color: #0b1f4d;

}


.jogo-chip {

  background: #e6ecfb;

  color: #2f4bb0;

  font-size: 11px;

  font-weight: 600;

  padding: 3px 6px;

  border-radius: 6px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}


.jogo-horario {

  font-weight: 800;

  margin-right: 3px;

}


/* =========================
   RESPONSIVIDADE
========================= */

@media (max-width: 900px) {

  .app-shell {

    flex-direction: column;

  }

  .content {

    padding: 20px;

  }

  .topo {

    flex-direction: column;

    align-items: stretch;

  }

  .btn-voltar {

    width: 100%;

  }

  .celula-dia {

    min-height: 60px;

  }

}


@media (max-width: 600px) {

  .content {

    padding: 16px;

  }

  .calendario-wrap {

    padding: 8px;

  }

  .grade {

    gap: 3px;

  }

  .celula-dia {

    min-height: 55px;

    padding: 4px;

  }

  .jogo-chip {

    font-size: 9px;

  }

}

</style>