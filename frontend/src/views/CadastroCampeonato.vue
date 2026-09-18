<template>
  <Sidebar/>
  <div class="fundo">
    <div class="card">
      <div class="icone">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M8 4h8v4a4 4 0 01-8 0V4z" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8 4H4v2a4 4 0 004 4" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 4h4v2a4 4 0 01-4 4" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 12v4" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 20h6" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10 16h4v4h-4z" stroke="#f0a800" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1>Cadastro de Campeonato</h1>
      <p class="subtitulo">Preencha os dados da competição</p>

      <form @submit.prevent="salvar">
        <div class="campo">
          <label for="nome">Nome do campeonato</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            placeholder="Ex: Copa Escolar de Vôlei 2026"
            required
          />
        </div>

        <div class="linha">
          <div class="campo">
            <label for="inicio">Data de início</label>
            <input id="inicio" v-model="form.data_inicio" type="date" required />
          </div>
          <div class="campo">
            <label for="fim">Data de término</label>
            <input id="fim" v-model="form.data_fim" type="date" required />
          </div>
        </div>

        <div class="campo">
          <label for="formato">Formato de disputa</label>
          <select id="formato" v-model="form.formato" required>
            <option disabled value="">Selecione</option>
            <option>Fase de grupos</option>
            <option>Eliminatória simples</option>
            <option>Todos contra todos</option>
          </select>
        </div>

        <div class="campo">
          <label for="max_equipes">Número máximo de equipes</label>
          <input
            id="max_equipes"
            v-model.number="form.max_equipes"
            type="number"
            min="2"
            placeholder="Ex: 8"
            required
          />
        </div>

        <div class="campo">
          <label for="status">Status</label>
          <select id="status" v-model="form.status">
            <option>Em breve</option>
            <option>Em andamento</option>
            <option>Encerrado</option>
          </select>
        </div>

        <div class="campo">
          <label for="regulamento">Regulamento (opcional)</label>
          <textarea
            id="regulamento"
            v-model="form.regulamento"
            rows="3"
            placeholder="Regras da competição..."
          ></textarea>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>

        <div class="acoes">
          <button type="button" class="btn-secundario" @click="cancelar">Cancelar</button>
          <button type="submit" class="btn-primario" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar campeonato' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';

export default {
  name: 'CadastroCampeonato',
  data() {
    return {
      form: {
        nome: '',
        data_inicio: '',
        data_fim: '',
        formato: '',
        max_equipes: null,
        status: 'Em breve',
        regulamento: ''
      },
      salvando: false,
      erro: null
    };
  },
  methods: {
    async salvar() {
      this.salvando = true;
      this.erro = null;
      try {
        const resposta = await fetch('http://localhost:3000/campeonatos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        if (!resposta.ok) throw new Error('Falha ao salvar campeonato');
        this.$router.push('/campeonatos');
      } catch (e) {
        this.erro = 'Não foi possível salvar o campeonato. Tente novamente.';
        console.error(e);
      } finally {
        this.salvando = false;
      }
    },
    cancelar() {
      this.$router.push('/campeonatos');
    }
  }
};
</script>

<style scoped>
.fundo {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #16224f 0%, #101c46 60%, #0b1533 100%);
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
}

.icone {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #101c46;
  border: 3px solid #f0a800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  overflow: hidden;
}

.icone-img {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

h1 {
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: #101c46;
  margin: 0 0 8px 0;
}

.subtitulo {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 28px 0;
}

.campo {
  margin-bottom: 16px;
  flex: 1;
}

.campo label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #101c46;
  margin-bottom: 6px;
}

.campo input,
.campo select,
.campo textarea {
  width: 100%;
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #e7e8ef;
  font-size: 14px;
  font-family: inherit;
  background: #fafbfd;
}

.linha {
  display: flex;
  gap: 14px;
}

.msg-erro {
  color: #d1435b;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

.btn-secundario {
  background: #fff;
  color: #101c46;
  border: 1px solid #e7e8ef;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primario {
  background: #101c46;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>