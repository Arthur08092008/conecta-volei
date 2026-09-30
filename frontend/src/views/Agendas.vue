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
   ESTADOS DO MODAL
========================= */
const modalAberto = ref(false);
const diaSelecionado = ref(null);
const salvandoJogo = ref(false);
const erroModal = ref('');

const novoJogo = ref({
  data_jogo: '',
  tipo: 'amistoso',
  campeonato_id: '',
  categoria: 'Masculino',
  modalidade: 'Vôlei de quadra',
  mandante: '',
  visitante: '',
  horario: '',
  local: ''
});

/* =========================
   DATA ATUAL
========================= */
const hoje = new Date();
const mes = ref(hoje.getMonth() + 1);
const ano = ref(hoje.getFullYear());

const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

/* =========================
   DIAS E MESES
========================= */
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const nomeMes = computed(() => nomesMeses[mes.value - 1]);

/* =========================
   DATA SELECIONADA
========================= */
const dataSelecionadaFormatada = computed(() => {
  if (!novoJogo.value.data_jogo) return '';

  const d = new Date(novoJogo.value.data_jogo + 'T00:00:00');

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
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
    campeonatos.value = Array.isArray(resposta.data) ? resposta.data : [];
  } catch (e) {
    console.error('Erro ao carregar campeonatos:', e);
    campeonatos.value = [];
  }
}

/* =========================
   NORMALIZAR PARTIDA
========================= */
function normalizarPartida(partida) {
  return {
    ...partida,
    mandante: partida.mandante ?? partida.time_a ?? '',
    visitante: partida.visitante ?? partida.time_b ?? '',
    data_jogo:
      partida.data_jogo ??
      (typeof partida.data === 'string' ? partida.data.slice(0, 10) : '')
  };
}

/* =========================
   CARREGAR PARTIDAS
========================= */
async function carregarPartidas() {
  carregando.value = true;
  erro.value = '';

  try {
    const params = { mes: mes.value, ano: ano.value };

    if (campeonatoSelecionado.value) {
      params.campeonato_id = campeonatoSelecionado.value;
    }

    const resposta = await api.get('/partidas', { params });

    partidas.value = Array.isArray(resposta.data)
      ? resposta.data.map(normalizarPartida)
      : [];
  } catch (e) {
    console.error('Erro ao carregar partidas:', e);
    erro.value =
      e.response?.data?.mensagem || 'Não foi possível carregar as partidas.';
  } finally {
    carregando.value = false;
  }
}

/* =========================
   MÊS ANTERIOR / PRÓXIMO
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
function formatarHorario(horario) {
  if (!horario) return '';
  return String(horario).slice(0, 5);
}

/* =========================
   MONTAR CALENDÁRIO
========================= */
const diasDoMes = computed(() => {
  const primeiroDia = new Date(ano.value, mes.value - 1, 1);
  const ultimoDia = new Date(ano.value, mes.value, 0);

  const totalDias = ultimoDia.getDate();
  const offset = primeiroDia.getDay();

  const celulas = Array(offset).fill(null);

  for (let numero = 1; numero <= totalDias; numero++) {
    const dataStr = `${ano.value}-${String(mes.value).padStart(2, '0')}-${String(numero).padStart(2, '0')}`;

    const partidasDoDia = partidas.value
      .filter((p) => p.data_jogo === dataStr)
      .sort((a, b) =>
        String(a.horario || '').localeCompare(String(b.horario || ''))
      );

    celulas.push({
      numero,
      data: dataStr,
      partidas: partidasDoDia
    });
  }

  return celulas;
});

/* =========================
   ABRIR MODAL
========================= */
function abrirModalNovoJogo(dia = null) {
  diaSelecionado.value = dia || null;

  novoJogo.value = {
    data_jogo:
      dia?.data ||
      `${ano.value}-${String(mes.value).padStart(2, '0')}-01`,
    tipo: 'amistoso',
    campeonato_id: '',
    categoria: 'Masculino',
    modalidade: 'Vôlei de quadra',
    mandante: '',
    visitante: '',
    horario: '',
    local: ''
  };

  erroModal.value = '';
  modalAberto.value = true;
}

/* =========================
   FECHAR MODAL
========================= */
function fecharModal() {
  modalAberto.value = false;
  diaSelecionado.value = null;
  erroModal.value = '';
}

/* =========================
   TIPO DE JOGO
========================= */
function selecionarTipoJogo(tipo) {
  novoJogo.value.tipo = tipo;

  if (tipo === 'amistoso') {
    novoJogo.value.campeonato_id = '';
  }
}

/* =========================
   SALVAR NOVO JOGO
========================= */
async function salvarJogo() {
  salvandoJogo.value = true;
  erroModal.value = '';

  try {
    if (!novoJogo.value.data_jogo) {
      erroModal.value = 'Informe a data da partida.';
      return;
    }

    if (!novoJogo.value.horario) {
      erroModal.value = 'Informe o horário da partida.';
      return;
    }

    if (!novoJogo.value.mandante.trim()) {
      erroModal.value = 'Informe o time mandante.';
      return;
    }

    if (!novoJogo.value.visitante.trim()) {
      erroModal.value = 'Informe o time visitante.';
      return;
    }

    if (
      novoJogo.value.mandante.trim().toLowerCase() ===
      novoJogo.value.visitante.trim().toLowerCase()
    ) {
      erroModal.value = 'Os times precisam ser diferentes.';
      return;
    }

    const dados = {
      data_jogo: novoJogo.value.data_jogo,
      tipo: novoJogo.value.tipo,
      campeonato_id: null,
      categoria: novoJogo.value.categoria,
      modalidade: novoJogo.value.modalidade,
      mandante: novoJogo.value.mandante.trim(),
      visitante: novoJogo.value.visitante.trim(),
      horario: novoJogo.value.horario,
      local: novoJogo.value.local ?? ''
    };

    console.log('Enviando partida:', dados);

    const resposta = await api.post('/partidas', dados);

    console.log('Partida criada:', resposta.data);

    partidas.value.push(normalizarPartida(resposta.data));

    fecharModal();
  } catch (e) {
    console.error('Erro ao salvar jogo:', e);
    console.error('Resposta do servidor:', e.response?.data);

    erroModal.value =
      e.response?.data?.mensagem ||
      e.response?.data?.detalhes ||
      'Não foi possível salvar o jogo.';
  } finally {
    salvandoJogo.value = false;
  }
}

/* =========================
   EXCLUIR JOGO
========================= */
async function excluirJogo(jogo) {
  const confirmar = window.confirm(
    `Excluir o jogo ${jogo.mandante} x ${jogo.visitante}?`
  );

  if (!confirmar) return;

  try {
    await api.delete(`/partidas/${jogo.id}`);

    partidas.value = partidas.value.filter((p) => p.id !== jogo.id);
  } catch (e) {
    console.error('Erro ao excluir jogo:', e);

    window.alert(
      e.response?.data?.mensagem ||
        'Não foi possível excluir o jogo. Tente novamente.'
    );
  }
}

/* =========================
   INICIALIZAÇÃO
========================= */
onMounted(async () => {
  await carregarCampeonatos();
  await carregarPartidas();
});
</script>

<template>
  <div class="agendas-layout">
    <Sidebar />

    <main class="agendas-main">
      <!-- CABEÇALHO -->
      <header class="topo">
        <button class="btn-voltar" type="button" @click="voltar">
          <Icon icon="mdi:arrow-left" width="20" />
          Voltar
        </button>

        <div class="topo-titulo">
          <h1>Agenda de jogos</h1>
          <p>Veja e cadastre as partidas de cada dia do mês.</p>
        </div>

        <button class="btn-primario" type="button" @click="abrirModalNovoJogo()">
          <Icon icon="mdi:plus" width="20" />
          Novo jogo
        </button>
      </header>

      <!-- CONTROLES -->
      <section class="controles">
        <div class="navegacao-mes">
          <button
            class="btn-icone"
            type="button"
            aria-label="Mês anterior"
            @click="mesAnterior"
          >
            <Icon icon="mdi:chevron-left" width="24" />
          </button>

          <h2>{{ nomeMes }} <span>{{ ano }}</span></h2>

          <button
            class="btn-icone"
            type="button"
            aria-label="Próximo mês"
            @click="mesSeguinte"
          >
            <Icon icon="mdi:chevron-right" width="24" />
          </button>
        </div>

        <label class="filtro">
          <span>Campeonato</span>
          <select v-model="campeonatoSelecionado" @change="carregarPartidas">
            <option value="">Todos os jogos</option>
            <option v-for="c in campeonatos" :key="c.id" :value="c.id">
              {{ c.nome }}
            </option>
          </select>
        </label>
      </section>

      <!-- ERRO -->
      <div v-if="erro" class="alerta-erro" role="alert">
        <Icon icon="mdi:alert-circle-outline" width="20" />
        <span>{{ erro }}</span>
        <button type="button" @click="carregarPartidas">Tentar de novo</button>
      </div>

      <!-- CALENDÁRIO -->
      <section class="calendario" :class="{ 'is-carregando': carregando }">
        <div v-if="carregando" class="carregando">Carregando partidas...</div>

        <div class="grade-semana">
          <div v-for="d in diasSemana" :key="d" class="dia-semana">{{ d }}</div>
        </div>

        <div class="grade-dias">
          <template v-for="(dia, i) in diasDoMes" :key="i">
            <div v-if="!dia" class="celula vazia"></div>

            <div
              v-else
              class="celula"
              :class="{ hoje: dia.data === hojeStr }"
              @click="abrirModalNovoJogo(dia)"
            >
              <span class="numero">{{ dia.numero }}</span>

              <div class="jogos">
                <div
                  v-for="jogo in dia.partidas"
                  :key="jogo.id"
                  class="jogo"
                  :class="jogo.tipo"
                  :title="`${jogo.mandante} x ${jogo.visitante}${jogo.local ? ' - ' + jogo.local : ''}`"
                  @click.stop
                >
                  <div class="jogo-info">
                    <strong>{{ formatarHorario(jogo.horario) }}</strong>
                    <span>{{ jogo.mandante }} x {{ jogo.visitante }}</span>
                  </div>

                  <button
                    class="btn-excluir"
                    type="button"
                    aria-label="Excluir jogo"
                    @click.stop="excluirJogo(jogo)"
                  >
                    <Icon icon="mdi:trash-can-outline" width="16" />
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <p v-if="!carregando && !erro && partidas.length === 0" class="vazio">
        Nenhum jogo em {{ nomeMes.toLowerCase() }}. Clique em um dia para cadastrar.
      </p>
    </main>

    <!-- MODAL -->
    <div v-if="modalAberto" class="modal-fundo" @click.self="fecharModal">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-topo">
          <div>
            <h3>Novo jogo</h3>
            <p v-if="dataSelecionadaFormatada">{{ dataSelecionadaFormatada }}</p>
          </div>

          <button
            class="btn-icone"
            type="button"
            aria-label="Fechar"
            @click="fecharModal"
          >
            <Icon icon="mdi:close" width="22" />
          </button>
        </header>

        <div class="modal-corpo">
          <div class="campo">
            <span class="rotulo">Tipo de jogo</span>
            <div class="alternar">
              <button
                type="button"
                :class="{ ativo: novoJogo.tipo === 'amistoso' }"
                @click="selecionarTipoJogo('amistoso')"
              >
                Amistoso
              </button>
              <button
                type="button"
                :class="{ ativo: novoJogo.tipo === 'campeonato' }"
                @click="selecionarTipoJogo('campeonato')"
              >
                Campeonato
              </button>
            </div>
          </div>

          <label class="campo">
            <span class="rotulo">Categoria</span>
            <select v-model="novoJogo.categoria">
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Misto</option>
            </select>
          </label>

          <div class="linha">
            <label class="campo">
              <span class="rotulo">Data</span>
              <input v-model="novoJogo.data_jogo" type="date" />
            </label>

            <label class="campo">
              <span class="rotulo">Horário</span>
              <input v-model="novoJogo.horario" type="time" />
            </label>
          </div>

          <div class="linha">
            <label class="campo">
              <span class="rotulo">Time mandante</span>
              <input
                v-model="novoJogo.mandante"
                type="text"
                placeholder="Ex.: Escola Central"
              />
            </label>

            <label class="campo">
              <span class="rotulo">Time visitante</span>
              <input
                v-model="novoJogo.visitante"
                type="text"
                placeholder="Ex.: Colégio Norte"
              />
            </label>
          </div>

          <label class="campo">
            <span class="rotulo">Modalidade</span>
            <select v-model="novoJogo.modalidade">
              <option>Vôlei de quadra</option>
              <option>Vôlei de praia</option>
              <option>Futevôlei</option>
            </select>
          </label>

          <label class="campo">
            <span class="rotulo">Local (opcional)</span>
            <input
              v-model="novoJogo.local"
              type="text"
              placeholder="Ex.: Ginásio municipal"
            />
          </label>

          <p v-if="erroModal" class="erro-modal" role="alert">{{ erroModal }}</p>
        </div>

        <footer class="modal-rodape">
          <button class="btn-secundario" type="button" @click="fecharModal">
            Cancelar
          </button>
          <button
            class="btn-primario"
            type="button"
            :disabled="salvandoJogo"
            @click="salvarJogo"
          >
            {{ salvandoJogo ? 'Salvando...' : 'Salvar jogo' }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.agendas-layout {
  --quadra: #1d4e89;
  --quadra-escura: #12263f;
  --bola: #f2b705;
  --areia: #f5f2ea;
  --linha: #dcd7c9;
  --texto: #1c2430;
  --texto-suave: #5d6675;
  --perigo: #b3261e;

  display: flex;
  min-height: 100vh;
  background: var(--areia);
  color: var(--texto);
}

.agendas-main {
  flex: 1;
  min-width: 0;
  padding: 28px 32px 48px;
}

/* TOPO */
.topo {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.topo-titulo {
  flex: 1;
}

.topo-titulo h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--quadra-escura);
}

.topo-titulo p {
  margin: 4px 0 0;
  color: var(--texto-suave);
}

/* BOTÕES */
button {
  font: inherit;
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 3px solid var(--bola);
  outline-offset: 2px;
}

.btn-primario,
.btn-secundario,
.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid transparent;
}

.btn-primario {
  background: var(--quadra);
  color: #fff;
}

.btn-primario:hover:not(:disabled) {
  background: var(--quadra-escura);
}

.btn-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secundario,
.btn-voltar {
  background: transparent;
  color: var(--quadra-escura);
  border-color: var(--linha);
}

.btn-secundario:hover,
.btn-voltar:hover {
  border-color: var(--quadra);
}

.btn-icone {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 0;
  background: transparent;
  color: var(--quadra-escura);
}

.btn-icone:hover {
  background: rgba(29, 78, 137, 0.1);
}

/* CONTROLES */
.controles {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.navegacao-mes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navegacao-mes h2 {
  margin: 0;
  min-width: 190px;
  text-align: center;
  font-size: 1.35rem;
  color: var(--quadra-escura);
}

.navegacao-mes h2 span {
  font-weight: 400;
  color: var(--texto-suave);
}

.filtro {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--texto-suave);
}

.filtro select,
.campo input,
.campo select {
  padding: 10px 12px;
  border: 1.5px solid var(--linha);
  border-radius: 8px;
  background: #fff;
  font: inherit;
  color: var(--texto);
}

/* ALERTAS */
.alerta-erro {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fdecea;
  color: var(--perigo);
}

.alerta-erro span {
  flex: 1;
}

.alerta-erro button {
  border: 0;
  background: transparent;
  color: var(--perigo);
  font-weight: 600;
  text-decoration: underline;
}

.vazio {
  margin-top: 16px;
  color: var(--texto-suave);
}

/* CALENDÁRIO */
.calendario {
  position: relative;
  background: #fff;
  border: 1.5px solid var(--linha);
  border-radius: 12px;
  overflow: hidden;
}

.calendario.is-carregando .grade-dias {
  opacity: 0.5;
}

.carregando {
  position: absolute;
  top: 56px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--quadra-escura);
  color: #fff;
  font-size: 0.85rem;
}

.grade-semana,
.grade-dias {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.dia-semana {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  background: var(--quadra-escura);
  color: #fff;
}

.celula {
  min-height: 118px;
  padding: 8px;
  border-right: 1px solid var(--linha);
  border-bottom: 1px solid var(--linha);
  cursor: pointer;
  transition: background 0.15s;
}

.celula:nth-child(7n) {
  border-right: 0;
}

.celula.vazia {
  background: #faf8f3;
  cursor: default;
}

.celula:not(.vazia):hover {
  background: #f3f7fc;
}

.numero {
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.9rem;
}

.celula.hoje .numero {
  background: var(--bola);
  color: var(--quadra-escura);
}

.jogos {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.jogo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 4px 6px;
  border-left: 4px solid var(--quadra);
  border-radius: 4px;
  background: #e8f0f9;
  font-size: 0.78rem;
  cursor: default;
}

.jogo.campeonato {
  border-left-color: var(--bola);
  background: #fdf5d8;
}

.jogo-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.jogo-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-excluir {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--perigo);
}

.btn-excluir:hover {
  background: rgba(179, 38, 30, 0.12);
}

/* MODAL */
.modal-fundo {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(18, 38, 63, 0.55);
}

.modal {
  width: 100%;
  max-width: 560px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
}

.modal-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--linha);
}

.modal-topo h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--quadra-escura);
}

.modal-topo p {
  margin: 4px 0 0;
  color: var(--texto-suave);
  text-transform: capitalize;
}

.modal-corpo {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  overflow-y: auto;
}

.linha {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rotulo {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--texto-suave);
}

.alternar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1.5px solid var(--linha);
  border-radius: 8px;
  overflow: hidden;
}

.alternar button {
  padding: 10px;
  border: 0;
  background: #fff;
  color: var(--texto);
  font-weight: 600;
}

.alternar button.ativo {
  background: var(--quadra);
  color: #fff;
}

.erro-modal {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fdecea;
  color: var(--perigo);
}

.modal-rodape {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--linha);
}

/* RESPONSIVO */
@media (max-width: 820px) {
  .agendas-main {
    padding: 20px 12px 40px;
  }

  .topo {
    flex-wrap: wrap;
  }

  .celula {
    min-height: 84px;
    padding: 4px;
  }

  .jogo-info span {
    display: none;
  }

  .linha {
    grid-template-columns: 1fr;
  }
}
</style>