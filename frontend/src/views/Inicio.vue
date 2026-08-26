<template>
  <div class="app-shell">
    <!-- Menu lateral -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-badge">
          <img src="../assets/logo.jpeg" alt="Logo VoleiTCC" />
        </div>
        <span>VoleiApp</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/inicio" class="nav-item" active-class="nav-item-active">
          <IconHome />
          <span>Início</span>
        </RouterLink>
        <RouterLink to="/times" class="nav-item" active-class="nav-item-active">
          <IconTimes />
          <span>Times</span>
        </RouterLink>
        <RouterLink to="/campeonatos" class="nav-item" active-class="nav-item-active">
          <IconTrophy />
          <span>Campeonatos</span>
        </RouterLink>
        <RouterLink to="/tabelas" class="nav-item" active-class="nav-item-active">
          <IconTable />
          <span>Tabelas</span>
        </RouterLink>
        <RouterLink to="/partidas" class="nav-item" active-class="nav-item-active">
          <IconCalendar />
          <span>Partidas</span>
        </RouterLink>
        <RouterLink to="/perfil" class="nav-item" active-class="nav-item-active">
          <IconUser />
          <span>Perfil</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Conteúdo principal -->
    <main class="content">
      <section class="hero">
        <div class="hero-text">
          <span class="hero-tag">⚡ PLATAFORMA DE VÔLEI</span>
          <h1>Organize jogos, times e campeonatos</h1>
          <p>Crie times, marque partidas, dispute torneios e acompanhe a classificação — tudo em um só lugar.</p>
          <div class="hero-actions">
            <RouterLink to="/partidas/nova" class="btn-hero-principal">Agendar partida</RouterLink>
            <RouterLink to="/times" class="btn-hero-secundario">Ver times</RouterLink>
          </div>
        </div>
        <svg class="hero-globe" width="260" height="260" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#f0b429" stroke-width="0.5" />
          <path
            d="M12 3c2.5 2.5 2.5 15.5 0 18M4.5 8c3 1.8 12 1.8 15 0M4.5 16c3-1.8 12-1.8 15 0"
            stroke="#f0b429"
            stroke-width="0.4"
            fill="none"
          />
        </svg>
      </section>

      <section class="stats">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue"><IconUser /></div>
          <div class="stat-value">{{ resumo.times }}</div>
          <div class="stat-label">Times</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-yellow"><IconTrophy /></div>
          <div class="stat-value">{{ resumo.campeonatos }}</div>
          <div class="stat-label">Campeonatos</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-green"><IconCalendar /></div>
          <div class="stat-value">{{ resumo.partidasAtivas }}</div>
          <div class="stat-label">Partidas ativas</div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, h } from 'vue';
import { RouterLink } from 'vue-router';

// TODO: trocar por dados reais vindos da API (ex: api.get('/resumo'))
const resumo = ref({
  times: 3,
  campeonatos: 2,
  partidasAtivas: 1,
});

// Ícones simples em SVG (sem dependências externas)
function svgIcon(paths) {
  return {
    render() {
      return h(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' },
        paths.map((d) =>
          h('path', {
            d,
            stroke: 'currentColor',
            'stroke-width': 1.8,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          })
        )
      );
    },
  };
}

const IconHome = svgIcon(['M3 11l9-7 9 7M5 10v10h14V10']);
const IconTimes = svgIcon(['M9 11a3 3 0 100-6 3 3 0 000 6z', 'M16 11a3 3 0 100-6 3 3 0 000 6z', 'M2 20c0-3 3-5 7-5s7 2 7 5', 'M14 15c3.2.4 5 2 5 5']);
const IconTrophy = svgIcon(['M8 4h8v4a4 4 0 01-8 0V4z', 'M8 4H4v2a4 4 0 004 4', 'M16 4h4v2a4 4 0 01-4 4', 'M12 12v4', 'M9 20h6', 'M10 16h4v4h-4z']);
const IconTable = svgIcon(['M3 5h18v14H3z', 'M3 10h18', 'M9 5v14']);
const IconCalendar = svgIcon(['M3 5h18v16H3z', 'M8 3v4', 'M16 3v4', 'M3 10h18']);
const IconUser = svgIcon(['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 20c0-4 3.5-7 8-7s8 3 8 7']);
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f6fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #0b1f4d;
  color: #fff;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 24px;
  font-size: 18px;
  font-weight: 800;
}

.logo-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0b429;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  color: #cfd8ea;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item-active {
  background: #f0b429;
  color: #0b1f4d;
}

/* Conteúdo */
.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0b1f4d 0%, #163b7c 60%, #1e4fa3 100%);
  border-radius: 20px;
  padding: 40px 44px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero-text {
  max-width: 620px;
  position: relative;
  z-index: 1;
}

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

.hero h1 {
  font-size: 34px;
  font-weight: 800;
  margin: 0 0 14px;
  line-height: 1.15;
}

.hero p {
  color: #d6ddef;
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 24px;
}

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
}

.btn-hero-principal {
  background: #f0b429;
  color: #0b1f4d;
}

.btn-hero-secundario {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.hero-globe {
  opacity: 0.5;
  flex-shrink: 0;
}

/* Cards de resumo */
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
  box-shadow: 0 4px 16px rgba(20, 30, 60, 0.06);
}

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

.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: #0b1f4d;
}

.stat-label {
  font-size: 13.5px;
  color: #6b7280;
  margin-top: 2px;
}

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }
  .sidebar-nav {
    flex-direction: row;
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
</style>