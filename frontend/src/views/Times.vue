<template>
  <div class="app-shell">

    <!-- MENU LATERAL -->
    <Sidebar />

    <!-- CONTEÚDO DA PÁGINA -->
    <main class="times-page">

      <header class="page-header">
        <h1>Times</h1>
        <p>Gerencie os times cadastrados no sistema</p>
      </header>

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
              >
                {{ editando ? 'Salvar alterações' : 'Cadastrar time' }}
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
            v-if="times.length === 0"
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
                <td>
                  {{ time.nome }}
                </td>

                <td>
                  {{ time.cidade }}
                </td>

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

    </main>

  </div>
</template>


<script>
import Sidebar from '../components/Sidebar.vue'

export default {
  name: 'TimesPage',

  components: {
    Sidebar,
  },

  data() {
    return {
      // Dados mock
      // Depois você pode substituir pela chamada da API
      times: [
        {
          id: 1,
          nome: 'Vôlei Clube Central',
          cidade: 'Curitiba',
          categoria: 'Masculino',
        },
        {
          id: 2,
          nome: 'Águias do Vôlei',
          cidade: 'São Paulo',
          categoria: 'Feminino',
        },
        {
          id: 3,
          nome: 'Estrelas do Litoral',
          cidade: 'Santos',
          categoria: 'Misto',
        },
      ],

      form: {
        nome: '',
        cidade: '',
        categoria: '',
      },

      editando: false,
      idEditando: null,
    }
  },

  methods: {

    salvarTime() {
      if (this.editando) {

        const index = this.times.findIndex(
          (t) => t.id === this.idEditando
        )

        if (index !== -1) {
          this.times[index] = {
            ...this.form,
            id: this.idEditando,
          }
        }

        this.cancelarEdicao()

      } else {

        const novoId = this.times.length
          ? Math.max(
              ...this.times.map((t) => t.id)
            ) + 1
          : 1

        this.times.push({
          ...this.form,
          id: novoId,
        })

        this.limparForm()
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


    excluirTime(id) {
      if (
        confirm(
          'Tem certeza que deseja excluir este time?'
        )
      ) {
        this.times = this.times.filter(
          (t) => t.id !== id
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

/* =================================
   ESTRUTURA DA PÁGINA
================================= */

.app-shell {
  min-height: 100vh;

  display: flex;

  background: #f4f7fb;

  font-family:
    'Segoe UI',
    Arial,
    sans-serif;
}


/* =================================
   CONTEÚDO
================================= */

.times-page {
  flex: 1;

  min-width: 0;

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

  margin: 0 0 24px;
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

.btn-primary:hover {
  background: #f6c90e;

  color: #0a3d62;
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
   RESPONSIVIDADE
================================= */

@media (max-width: 1000px) {

  .content-grid {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 900px) {

  .app-shell {
    flex-direction: column;
  }

  .times-page {
    padding: 20px;
  }

}


@media (max-width: 600px) {

  .times-page {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .times-table {
    display: block;

    overflow-x: auto;
  }

}

</style>
