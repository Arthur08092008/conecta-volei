```vue
<template>
  <div class="app-shell">

    <!-- MENU LATERAL -->
    <Sidebar />

    <!-- CONTEÚDO PRINCIPAL -->
    <main class="content">

      <!-- HERO -->
      <section class="hero">

        <div class="hero-text">

          <span class="hero-tag">
            ⚡ PLATAFORMA DE VÔLEI
          </span>

          <h1>
            Organize jogos, times e campeonatos
          </h1>

          <p>
            Crie times, marque partidas, dispute torneios e acompanhe
            a classificação — tudo em um só lugar.
          </p>

          <div class="hero-actions">
            <RouterLink
              to="/agendas"
              class="btn-hero-principal"
            >
              Agendar partida
            </RouterLink>

            <RouterLink
              to="/times"
              class="btn-hero-secundario"
            >
              Ver times
            </RouterLink>
          </div>

        </div>

        <!-- ÍCONE GLOBO -->
        <svg
          class="hero-globe"
          width="260"
          height="260"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#f0b429"
            stroke-width="0.5"
          />

          <path
            d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
            stroke="#f0b429"
            stroke-width="0.4"
            fill="none"
          />
        </svg>

      </section>

      <!-- CARDS DE RESUMO -->
      <section class="stats">

        <!-- TIMES -->
        <div class="stat-card">

          <div class="stat-icon stat-icon-blue">
            <IconUser />
          </div>

          <div class="stat-value">
            {{ resumo.times }}
          </div>

          <div class="stat-label">
            Times
          </div>

        </div>

        <!-- CAMPEONATOS -->
        <div class="stat-card">

          <div class="stat-icon stat-icon-yellow">
            <IconTrophy />
          </div>

          <div class="stat-value">
            {{ resumo.campeonatos }}
          </div>

          <div class="stat-label">
            Campeonatos
          </div>

        </div>

        <!-- PARTIDAS -->
        <div class="stat-card">

          <div class="stat-icon stat-icon-green">
            <IconCalendar />
          </div>

          <div class="stat-value">
            {{ resumo.partidasAtivas }}
          </div>

          <div class="stat-label">
            Partidas ativas
          </div>

        </div>

      </section>

    </main>

  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { RouterLink } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'


/* =========================
   DADOS DO RESUMO
========================= */

const resumo = ref({
  times: 3,
  campeonatos: 2,
  partidasAtivas: 1,
})


/* =========================
   ÍCONES SVG
========================= */

function svgIcon(paths) {
  return {
    render() {
      return h(
        'svg',
        {
          width: 20,
          height: 20,
          viewBox: '0 0 24 24',
          fill: 'none',
        },
        paths.map((d) =>
          h('path', {
            d,
            stroke: 'currentColor',
            'stroke-width': 1.8,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          })
        )
      )
    },
  }
}

const IconTrophy = svgIcon([
  'M8 4h8v4a4 4 0 01-8 0V4z',
  'M8 4H4v2a4 4 0 004 4',
  'M16 4h4v2a4 4 0 01-4 4',
  'M12 12v4',
  'M9 20h6',
  'M10 16h4v4h-4z'
])

const IconCalendar = svgIcon([
  'M3 5h18v16H3z',
  'M8 3v4',
  'M16 3v4',
  'M3 10h18'
])

const IconUser = svgIcon([
  'M12 12a4 4 0 100-8 4 4 0 000 8z',
  'M4 20c0-4 3.5-7 8-7s8 3 8 7'
])
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
   CONTEÚDO PRINCIPAL
========================= */

.content {
  flex: 1;

  padding: 32px;

  overflow-y: auto;

  box-sizing: border-box;
}


/* =========================
   HERO
========================= */

.hero {
  position: relative;

  overflow: hidden;

  background: linear-gradient(
    135deg,
    #0b1f4d 0%,
    #163b7c 60%,
    #1e4fa3 100%
  );

  border-radius: 20px;

  padding: 40px 44px;

  color: #fff;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 24px;
}


/* TEXTO DO HERO */

.hero-text {
  max-width: 620px;

  position: relative;

  z-index: 1;
}


/* TAG */

.hero-tag {
  display: inline-block;

  background: #f0b429;

  color: #0b1f4d;

  font-size: 12px;

  font-weight: 800;

  letter-spacing: 0.04em;

  padding: 6px 12px;

  border-radius: 999px;

  margin-bottom: 16px;
}


/* TÍTULO */

.hero h1 {
  font-size: 34px;

  font-weight: 800;

  margin: 0 0 14px;

  line-height: 1.15;
}


/* DESCRIÇÃO */

.hero p {
  color: #d6ddef;

  font-size: 15px;

  line-height: 1.5;

  margin: 0 0 24px;
}


/* =========================
   BOTÕES
========================= */

.hero-actions {
  display: flex;

  gap: 12px;
}


.btn-hero-principal,
.btn-hero-secundario {
  padding: 12px 22px;

  border-radius: 10px;

  font-size: 14.5px;

  font-weight: 700;

  text-decoration: none;

  cursor: pointer;

  border: none;

  transition:
    transform 0.15s,
    opacity 0.15s;
}


.btn-hero-principal {
  background: #f0b429;

  color: #0b1f4d;
}


.btn-hero-secundario {
  background: rgba(255, 255, 255, 0.12);

  color: #fff;
}


.btn-hero-principal:hover,
.btn-hero-secundario:hover {
  transform: translateY(-1px);

  opacity: 0.9;
}


/* =========================
   GLOBO
========================= */

.hero-globe {
  opacity: 0.5;

  flex-shrink: 0;
}


/* =========================
   CARDS DE RESUMO
========================= */

.stats {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 20px;

  margin-top: 24px;
}


.stat-card {
  background: #fff;

  border-radius: 16px;

  padding: 22px 24px;

  box-shadow:
    0 4px 16px rgba(20, 30, 60, 0.06);
}


/* =========================
   ÍCONES DOS CARDS
========================= */

.stat-icon {
  width: 38px;

  height: 38px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 14px;
}


.stat-icon-blue {
  background: #e6ecfb;

  color: #2f4bb0;
}


.stat-icon-yellow {
  background: #fdf0d5;

  color: #c98a12;
}


.stat-icon-green {
  background: #e1f6ea;

  color: #1f9d55;
}


/* =========================
   VALORES
========================= */

.stat-value {
  font-size: 26px;

  font-weight: 800;

  color: #0b1f4d;
}


/* =========================
   LABEL
========================= */

.stat-label {
  font-size: 13.5px;

  color: #6b7280;

  margin-top: 2px;
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

  .hero {
    flex-direction: column;

    align-items: flex-start;
  }

  .hero-globe {
    display: none;
  }

  .stats {
    grid-template-columns: 1fr;
  }

}


@media (max-width: 600px) {

  .content {
    padding: 16px;
  }

  .hero {
    padding: 30px 24px;
  }

  .hero h1 {
    font-size: 28px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn-hero-principal,
  .btn-hero-secundario {
    width: 100%;

    text-align: center;

    box-sizing: border-box;
  }

}

</style>