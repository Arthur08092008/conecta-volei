<template>
  <div class="app-shell">
    <Sidebar />

    <div class="content">
      <div class="times-page">
        <header class="page-header">
          <h1>Times</h1>
          <p>Gerencie os times cadastrados no sistema</p>
        </header>

        <!-- ERRO GERAL -->
        <div v-if="erro" class="erro-msg" role="alert">
          {{ erro }}
        </div>

        <div class="content-grid">
          <!-- Formulário de cadastro/edição -->
          <section class="card form-card">
            <h2>{{ editando ? 'Editar Time' : 'Novo Time' }}</h2>

            <form @submit.prevent="salvarTime">
              <div class="field">
                <label for="nome">Nome do time</label>

                <input
                  id="nome"
                  v-model="form.nome"
                  type="text"
                  placeholder="Ex: Vôlei Clube Central"
                  required
                />
              </div>

              <div class="field">
                <label for="cidade">Cidade</label>

                <input
                  id="cidade"
                  v-model="form.cidade"
                  type="text"
                  placeholder="Ex: Curitiba"
                  required
                />
              </div>

              <div class="field">
                <label for="categoria">Categoria</label>

                <select
                  id="categoria"
                  v-model="form.categoria"
                  required
                >
                  <option disabled value="">
                    Selecione
                  </option>

                  <option value="Masculino">
                    Masculino
                  </option>

                  <option value="Feminino">
                    Feminino
                  </option>

                  <option value="Misto">
                    Misto
                  </option>
                </select>
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn-primary"
                  :disabled="salvando"
                >
                  {{
                    salvando
                      ? 'Salvando...'
                      : editando
                        ? 'Salvar alterações'
                        : 'Cadastrar time'
                  }}
                </button>

                <button
                  v-if="editando"
                  type="button"
                  class="btn-secondary"
                  @click="cancelarEdicao"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>

          <!-- Lista de times -->
          <section class="card list-card">
            <h2>
              Times cadastrados ({{ times.length }})
            </h2>

            <div
              v-if="carregando"
              class="empty-state"
            >
              Carregando times...
            </div>

            <div
              v-else-if="times.length === 0"
              class="empty-state"
            >
              Nenhum time cadastrado ainda.
            </div>

            <table
              v-else
              class="times-table"
            >
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cidade</th>
                  <th>Categoria</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="time in times"
                  :key="time.id"
                >
                  <td>{{ time.nome }}</td>

                  <td>{{ time.cidade }}</td>

                  <td>
                    <span
                      class="badge"
                      :class="badgeClass(time.categoria)"
                    >
                      {{ time.categoria }}
                    </span>
                  </td>

                  <td class="actions">
                    <button
                      class="icon-btn"
                      title="Editar"
                      @click="editarTime(time)"
                    >
                      ✏️
                    </button>

                    <button
                      class="icon-btn"
                      title="Excluir"
                      @click="excluirTime(time.id)"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api'

export default {
  name: 'TimesPage',

  components: {
    Sidebar,
    Icon,
  },

  data() {
    return {
      times: [],

      form: {
        nome: '',
        cidade: '',
        categoria: '',
      },

      editando: false,
      idEditando: null,

      carregando: false,
      salvando: false,
      erro: '',
    }
  },

  mounted() {
    this.carregarTimes()
  },

  methods: {
    mensagemErro(e, padrao) {
      return e.response?.data?.mensagem || padrao
    },

    /* =========================
       LISTAR
    ========================= */
    async carregarTimes() {
      this.carregando = true
      this.erro = ''

      try {
        const resposta = await api.get('/times')

        this.times = Array.isArray(resposta.data)
          ? resposta.data
          : []
      } catch (e) {
        console.error('Erro ao carregar times:', e)

        this.erro = this.mensagemErro(
          e,
          'Não foi possível carregar os times.'
        )
      } finally {
        this.carregando = false
      }
    },

    /* =========================
       CRIAR / EDITAR
    ========================= */
    async salvarTime() {
      this.salvando = true
      this.erro = ''

      const dados = {
        nome: this.form.nome.trim(),
        cidade: this.form.cidade.trim(),
        categoria: this.form.categoria,
      }

      try {
        if (this.editando) {
          const resposta = await api.put(
            `/times/${this.idEditando}`,
            dados
          )

          const index = this.times.findIndex(
            (t) => t.id === this.idEditando
          )

          if (index !== -1) {
            this.times[index] = resposta.data
          }

          this.cancelarEdicao()
        } else {
          const resposta = await api.post('/times', dados)

          this.times.push(resposta.data)

          this.limparForm()
        }
      } catch (e) {
        console.error('Erro ao salvar time:', e)

        this.erro = this.mensagemErro(
          e,
          'Não foi possível salvar o time.'
        )
      } finally {
        this.salvando = false
      }
    },

    editarTime(time) {
      this.form = {
        nome: time.nome,
        cidade: time.cidade,
        categoria: time.categoria,
      }

      this.editando = true
      this.idEditando = time.id
    },

    /* =========================
       EXCLUIR
    ========================= */
    async excluirTime(id) {
      if (
        !confirm(
          'Tem certeza que deseja excluir este time?'
        )
      ) {
        return
      }

      this.erro = ''

      try {
        await api.delete(`/times/${id}`)

        this.times = this.times.filter((t) => t.id !== id)

        if (this.idEditando === id) {
          this.cancelarEdicao()
        }
      } catch (e) {
        console.error('Erro ao excluir time:', e)

        this.erro = this.mensagemErro(
          e,
          'Não foi possível excluir o time.'
        )
      }
    },

    cancelarEdicao() {
      this.editando = false
      this.idEditando = null

      this.limparForm()
    },

    limparForm() {
      this.form = {
        nome: '',
        cidade: '',
        categoria: '',
      }
    },

    badgeClass(categoria) {
      return {
        Masculino: 'badge-azul',
        Feminino: 'badge-amarelo',
        Misto: 'badge-neutro',
      }[categoria]
    },
  },
}
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  min-width: 0;
}

.times-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f7fb;
  font-family:
    'Segoe UI',
    Arial,
    sans-serif;
  padding: 32px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* =================================
   CABEÇALHO
================================= */

.page-header h1 {
  color: #0a3d62;
  margin: 0 0 4px;
  font-size: 28px;
}

.page-header p {
  color: #5a6b7b;
  margin: 0;
}

/* =================================
   ERRO
================================= */

.erro-msg {
  margin-bottom: 16px;
  padding: 12px 14px;

  border-radius: 8px;

  background: #fdecea;
  color: #b3261e;

  font-size: 14px;
}

/* =================================
   GRID
================================= */

.content-grid {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 24px;
}

/* =================================
   CARDS
================================= */

.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;

  box-shadow:
    0 4px 16px rgba(10, 61, 98, 0.08);
}

.card h2 {
  color: #0a3d62;
  font-size: 18px;
  margin: 0 0 16px;

  border-bottom: 3px solid #f6c90e;
  padding-bottom: 8px;
}

/* =================================
   CAMPOS
================================= */

.field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 13px;
  color: #34495e;
  margin-bottom: 6px;
  font-weight: 600;
}

.field input,
.field select {
  padding: 10px 12px;

  border: 1.5px solid #d7e1ea;
  border-radius: 8px;

  font-size: 14px;
  outline: none;

  transition: border-color 0.2s;

  box-sizing: border-box;
  width: 100%;
}

.field input:focus,
.field select:focus {
  border-color: #0a3d62;
}

/* =================================
   BOTÕES DO FORMULÁRIO
================================= */

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn-primary {
  flex: 1;

  background: #0a3d62;
  color: #fff;

  border: none;

  padding: 12px;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;

  transition:
    background 0.2s,
    color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #f6c90e;
  color: #0a3d62;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #0a3d62;

  border: 1.5px solid #0a3d62;

  padding: 12px;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;
}

/* =================================
   ESTADO VAZIO
================================= */

.empty-state {
  color: #8a99a8;
  text-align: center;
  padding: 32px 0;
}

/* =================================
   TABELA
================================= */

.times-table {
  width: 100%;
  border-collapse: collapse;
}

.times-table th {
  text-align: left;

  color: #5a6b7b;

  font-size: 12px;
  text-transform: uppercase;

  padding: 10px 8px;

  border-bottom: 2px solid #f0f3f7;
}

.times-table td {
  padding: 12px 8px;

  border-bottom: 1px solid #f0f3f7;

  color: #2c3e50;

  font-size: 14px;
}

/* =================================
   BADGES
================================= */

.badge {
  padding: 4px 10px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;
}

.badge-azul {
  background: #e3edf7;
  color: #0a3d62;
}

.badge-amarelo {
  background: #fdf3cf;
  color: #a67c00;
}

.badge-neutro {
  background: #eef1f4;
  color: #5a6b7b;
}

/* =================================
   AÇÕES
================================= */

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;

  cursor: pointer;

  font-size: 16px;
  padding: 4px;

  border-radius: 6px;

  transition: background 0.2s;
}

.icon-btn:hover {
  background: #f0f3f7;
}

/* =================================
   RESPONSIVO
================================= */

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .times-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 600px) {
  .times-page {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>