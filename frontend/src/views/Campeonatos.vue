<template>
<<<<<<< HEAD
  <div class="page">
    
    <svg
      class="logo-bg"
      width="480"
      height="480"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="#f0b429" stroke-width="0.5" />
      <path
        d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
        stroke="#f0b429"
        stroke-width="0.4"
        fill="none"
      />
    </svg>
    <div class="circle-bg"></div>
 
    <div class="card">
      <div class="header">
        <div class="logo-circle">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#f0b429" stroke-width="1.6" />
            <path
              d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
              stroke="#ffffff"
              stroke-width="1.3"
              fill="none"
            />
          </svg>
        </div>
        <h1>Cadastro de Campeonato</h1>
        <p class="subtitle">Preencha os dados da competição</p>
      </div>
 
      <div v-if="enviado" class="sucesso">
        <div class="check-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#1f9d55"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="sucesso-titulo">Campeonato criado com sucesso!</p>
        <p class="sucesso-texto">{{ form.nome }} já está pronto para receber inscrições de equipes.</p>
        <button class="btn-secundario" @click="resetar">Cadastrar outro campeonato</button>
      </div>
 
      <form v-else @submit.prevent="handleSubmit">
        <div class="field">
          <label>Nome do campeonato</label>
          <input
            type="text"
            v-model="form.nome"
            placeholder="Ex: Copa Escolar de Vôlei 2026"
          />
        </div>
 
        <div class="linha-dupla">
          <div class="field flex1">
            <label>Data de início</label>
            <input type="date" v-model="form.dataInicio" />
          </div>
          <div class="field flex1">
            <label>Data de término</label>
            <input type="date" v-model="form.dataFim" />
          </div>
        </div>
 
        <div class="field">
          <label>Formato de disputa</label>
          <select v-model="form.formato">
            <option value="GRUPOS">Fase de grupos</option>
            <option value="MATA_MATA">Eliminatória (mata-mata)</option>
            <option value="MISTO">Grupos + eliminatórias</option>
          </select>
        </div>
 
        <div class="field">
          <label>Número máximo de equipes</label>
          <input
            type="number" min="2"
            v-model.number="form.maxEquipes"
            placeholder="Ex: 8"
          />
        </div>
 
        <div class="field">
          <label>Regulamento (opcional)</label>
          <textarea
            v-model="form.regulamento"
            rows="3"
            placeholder="Regras específicas, critérios de desempate, premiação..."
          ></textarea>
        </div>
 
        <p v-if="erro" class="erro">{{ erro }}</p>
 
        <button type="submit" class="btn-principal">Criar campeonato</button>
      </form>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "CadastroCampeonato",
  data() {
    return {
      form: {
        nome: "",
        dataInicio: "",
        dataFim: "",
        formato: "GRUPOS",
        maxEquipes: null,
        regulamento: "",
      },
      enviado: false,
      erro: "",
    };
  },
  methods: {
    handleSubmit() {
      if (!this.form.nome.trim() || !this.form.dataInicio || !this.form.dataFim) {
        this.erro = "Preencha nome, data de início e data de término.";
        return;
      }
 
      if (new Date(this.form.dataFim) < new Date(this.form.dataInicio)) {
        this.erro = "A data de término não pode ser anterior à data de início.";
        return;
      }
 
      if (!this.form.maxEquipes || this.form.maxEquipes < 2) {
        this.erro = "Informe um número de equipes válido (mínimo 2).";
        return;
      }
 
      this.erro = "";
 

      this.enviado = true;
    },
    resetar() {
      this.form = {
        nome: "",
        dataInicio: "",
        dataFim: "",
        formato: "GRUPOS",
        maxEquipes: null,
        regulamento: "",
      };
      this.enviado = false;
    },
  },
};
</script>
 
<style scoped>
.page {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0b1f4d 0%, #122f6b 55%, #163a82 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  padding: 40px 20px;
}
 
.logo-bg {
  position: absolute;
  bottom: -140px;
  right: -120px;
  opacity: 0.9;
}
 
.circle-bg {
  position: absolute;
  top: -180px;
  left: -200px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}
 
.card {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  padding: 44px 48px 40px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
}
 
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}
 
.logo-circle {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #0b1f4d;
  border: 3px solid #f0b429;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
 
h1 {
  color: #0b1f4d;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}
 
.subtitle {
  color: #6b7280;
  font-size: 15px;
  margin-top: 6px;
}
 
.field {
  margin-bottom: 16px;
}
 
.field label {
  display: block;
  color: #0b1f4d;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}
 
.field input,
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 15px;
  border: 1.5px solid #e2e5ec;
  border-radius: 10px;
  outline: none;
  color: #1f2937;
  background: #fafbfc;
  font-family: inherit;
}
 
.field select {
  cursor: pointer;
}
 
.field textarea {
  resize: vertical;
}
 
.linha-dupla {
  display: flex;
  gap: 12px;
}
 
.flex1 {
  flex: 1;
}
 
.erro {
  color: #d93025;
  font-size: 13.5px;
  margin-top: 4px;
  margin-bottom: 4px;
}
 
.btn-principal {
  width: 100%;
  background: #0b1f4d;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
  transition: background 0.15s;
}
 
.btn-principal:hover {
  background: #122f6b;
}
 
.sucesso {
  text-align: center;
  padding: 24px 0;
}
 
.check-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e8f7ee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
 
.sucesso-titulo {
  color: #0b1f4d;
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 4px;
}
 
.sucesso-texto {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
}
 
.btn-secundario {
  background: #0b1f4d;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
</style>
=======
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="icon">
          <img src="../assets/logo.jpeg" alt="Conecta Vôlei" class="icon-img" />
        </div>
        <span>Conecta Volei</span>
      </div>
      <nav>
        <router-link to="/">Início</router-link>
        <router-link to="/times">Times</router-link>
        <router-link to="/campeonatos" class="active">Campeonatos</router-link>
        <router-link to="/tabelas">Tabelas</router-link>
        <router-link to="/partidas">Partidas</router-link>
        <router-link to="/perfil">Perfil</router-link>
      </nav>
    </aside>

    <main>
      <div class="page-header">
        <div>
          <h1>Campeonatos</h1>
          <p>{{ campeonatos.length }} campeonato(s) cadastrado(s)</p>
        </div>
        <button class="btn-primary" @click="irParaCadastro">+ Novo campeonato</button>
      </div>

      <p v-if="carregando" class="msg">Carregando campeonatos...</p>
      <p v-if="erro" class="msg erro">{{ erro }}</p>

      <div class="card" v-if="!carregando && !erro">
        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>PERÍODO</th>
              <th>FORMATO</th>
              <th>Nº EQUIPES</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in campeonatos" :key="c.id">
              <td class="nome-cell">{{ c.nome }}</td>
              <td class="periodo-cell">{{ formatarData(c.data_inicio) }} - {{ formatarData(c.data_fim) }}</td>
              <td><span class="badge badge-gold">{{ c.formato }}</span></td>
              <td class="equipes-cell">{{ c.max_equipes }} equipes</td>
              <td><span class="badge" :class="classeStatus(c.status)">{{ c.status }}</span></td>
              <td>
                <div class="actions-cell">
                  <button class="btn-excluir" @click="excluirCampeonato(c.id)">Excluir</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-state" v-if="campeonatos.length === 0">
          Nenhum campeonato cadastrado ainda.
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Campeonatos',
  data() {
    return {
      campeonatos: [],
      carregando: true,
      erro: null
    };
  },
  mounted() {
    this.carregarCampeonatos();
  },
  methods: {
    async carregarCampeonatos() {
      this.carregando = true;
      this.erro = null;
      try {
        const resposta = await fetch('http://localhost:3000/campeonatos');
        if (!resposta.ok) throw new Error('Falha ao buscar campeonatos');
        this.campeonatos = await resposta.json();
      } catch (e) {
        this.erro = 'Não foi possível carregar os campeonatos.';
        console.error(e);
      } finally {
        this.carregando = false;
      }
    },
    async excluirCampeonato(id) {
      if (!confirm('Deseja realmente excluir este campeonato?')) return;
      try {
        const resposta = await fetch(`http://localhost:3000/campeonatos/${id}`, {
          method: 'DELETE'
        });
        if (!resposta.ok) throw new Error('Falha ao excluir');
        this.campeonatos = this.campeonatos.filter(c => c.id !== id);
      } catch (e) {
        alert('Erro ao excluir campeonato.');
        console.error(e);
      }
    },
    irParaCadastro() {
      this.$router.push('/campeonatos/cadastro');
    },
    formatarData(dataStr) {
      if (!dataStr) return '-';
      const data = new Date(dataStr);
      return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    },
    classeStatus(status) {
      if (status === 'Em andamento') return 'badge-green';
      if (status === 'Encerrado') return 'badge-gray';
      return 'badge-purple'; // "Em breve" ou outro valor
    }
  }
};
</script>

<style scoped>
:root {
  --navy: #101c46;
  --navy-light: #16224f;
  --gold: #f0a800;
}

.layout {
  display: flex;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f4f5f9;
  color: #1a1a2e;
}

.sidebar {
  width: 260px;
  background: #101c46;
  padding: 28px 20px;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
  padding: 0 8px;
}

.logo .icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0b429;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo .icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo span {
  color: #fff;
  font-size: 20px;
  font-weight: 800;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

nav a {
  color: #c7cbe0;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 10px;
}

nav a:hover {
  background: #16224f;
  color: #fff;
}

nav a.active {
  background: #f0a800;
  color: #101c46;
}

main {
  flex: 1;
  padding: 40px 48px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 6px 0;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.btn-primary {
  background: #101c46;
  color: #fff;
  border: none;
  padding: 14px 22px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary:hover {
  background: #16224f;
}

.card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e7e8ef;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  padding: 18px 24px;
  background: #fafafc;
  border-bottom: 1px solid #e7e8ef;
}

tbody td {
  padding: 18px 24px;
  font-size: 15px;
  border-bottom: 1px solid #e7e8ef;
}

tbody tr:last-child td {
  border-bottom: none;
}

.nome-cell {
  font-weight: 700;
}

.periodo-cell,
.equipes-cell {
  color: #6b7280;
  font-size: 14px;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.badge-purple { background: #e7e6fb; color: #4b3fd1; }
.badge-green { background: #e3f8ea; color: #1f9d55; }
.badge-gray { background: #eef0f4; color: #6b7280; }
.badge-gold { background: #fdf1dc; color: #a06600; }

.actions-cell {
  display: flex;
  justify-content: flex-end;
}

.btn-excluir {
  background: #fde7e9;
  color: #d1435b;
  border: none;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #6b7280;
}

.msg {
  padding: 24px;
  color: #6b7280;
}

.msg.erro {
  color: #d1435b;
}
</style>
>>>>>>> 07a131da61aaab5194772d8e9c351f3ccfa4d693
