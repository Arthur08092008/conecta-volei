<template>
  <div class="app-shell">
    <Sidebar />

    <!-- Conteúdo principal -->
    <main class="content">
      <div class="topo">
        <div>
          <h1>Agendas</h1>
          <p class="subtitulo">Calendário de partidas dos campeonatos</p>
        </div>
      </div>

      <div class="filtro-wrap">
        <label for="campeonato">Campeonato</label>
        <select id="campeonato" v-model="campeonatoSelecionado" @change="carregarPartidas">
          <option value="">Todos os campeonatos</option>
          <option v-for="c in campeonatos" :key="c.id" :value="c.id">{{ c.nome }}</option>
        </select>
      </div>

      <!-- Navegação do mês -->
      <div class="calendario-header">
        <button class="nav-mes" @click="mesAnterior">‹</button>
        <h2>{{ nomeMes }} {{ ano }}</h2>
        <button class="nav-mes" @click="mesSeguinte">›</button>
      </div>

      <p v-if="carregando" class="msg">Carregando partidas...</p>
      <p v-else-if="erro" class="msg erro">{{ erro }}</p>

      <!-- Grade do calendário -->
      <div v-else class="calendario-wrap">
        <div class="dias-semana">
          <span v-for="d in diasSemana" :key="d">{{ d }}</span>
        </div>
        <div class="grade">
          <div
            v-for="(dia, index) in diasDoMes"
            :key="index"
            class="celula-dia"
            :class="{ 'celula-vazia': !dia }"
          >
            <span v-if="dia" class="numero-dia">{{ dia.numero }}</span>
            <div
              v-for="jogo in dia?.partidas"
              :key="jogo.id"
              class="jogo-chip"
              :title="`${jogo.mandante} x ${jogo.visitante}`"
            >
              <span class="jogo-horario" v-if="jogo.horario">{{ formatarHorario(jogo.horario) }}</span>
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
import api from '../services/api';
import Sidebar from '../components/Sidebar.vue';

const carregando = ref(false);
const erro = ref('');

const campeonatos = ref([]);
const campeonatoSelecionado = ref('');
const partidas = ref([]);

const hoje = new Date();
const mes = ref(hoje.getMonth() + 1); // 1-12
const ano = ref(hoje.getFullYear());

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const nomeMes = computed(() => nomesMeses[mes.value - 1]);

async function carregarCampeonatos() {
  try {
    const resposta = await api.get('/campeonatos');
    campeonatos.value = resposta.data;
  } catch (e) {
    console.error('Erro ao carregar campeonatos:', e);
  }
}

async function carregarPartidas() {
  carregando.value = true;
  erro.value = '';
  try {
    const params = { mes: mes.value, ano: ano.value };
    if (campeonatoSelecionado.value) params.campeonato_id = campeonatoSelecionado.value;
    const resposta = await api.get('/partidas', { params });
    partidas.value = resposta.data;
  } catch (e) {
    console.error('Erro ao carregar partidas:', e);
    erro.value = 'Não foi possível carregar as partidas.';
  } finally {
    carregando.value = false;
  }
}

function mesAnterior() {
  if (mes.value === 1) {
    mes.value = 12;
    ano.value -= 1;
  } else {
    mes.value -= 1;
  }
  carregarPartidas();
}

function mesSeguinte() {
  if (mes.value === 12) {
    mes.value = 1;
    ano.value += 1;
  } else {
    mes.value += 1;
  }
  carregarPartidas();
}

function formatarHorario(hms) {
  return hms ? hms.slice(0, 5) : '';
}

// Monta a grade do mês (células vazias no início para alinhar o 1º dia
// da semana + um objeto por dia real, já com as partidas daquele dia)
const diasDoMes = computed(() => {
  const primeiroDia = new Date(ano.value, mes.value - 1, 1);
  const ultimoDia = new Date(ano.value, mes.value, 0);
  const totalDias = ultimoDia.getDate();
  const offset = primeiroDia.getDay(); // 0 = domingo

  const celulas = Array(offset).fill(null);

  for (let numero = 1; numero <= totalDias; numero++) {
    const dataStr = `${ano.value}-${String(mes.value).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;
    const partidasDoDia = partidas.value.filter((p) => {
      const dataPartida = typeof p.data_jogo === 'string' ? p.data_jogo.slice(0, 10) : '';
      return dataPartida === dataStr;
    });
    celulas.push({ numero, partidas: partidasDoDia });
  }

  return celulas;
});

onMounted(async () => {
  await carregarCampeonatos();
  await carregarPartidas();
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f6fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.topo {
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

.filtro-wrap {
  background: #fff;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 340px;
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.06);
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
}

.calendario-header {
  display: flex;
  align-items: center;
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

.calendario-wrap {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.06);
  padding: 16px;
}

.dias-semana {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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
  grid-template-columns: repeat(7, 1fr);
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

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }
  .celula-dia {
    min-height: 60px;
  }
}
</style>