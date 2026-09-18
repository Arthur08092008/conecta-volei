<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-badge">
        <img src="../assets/logo.jpeg" alt="Logo Conecta Vôlei" />
      </div>

      <span>Conecta Vôlei</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        to="/inicio"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconHome />
        <span>Início</span>
      </RouterLink>

      <RouterLink
        to="/times"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconTimes />
        <span>Times</span>
      </RouterLink>

      <RouterLink
        to="/campeonatos"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconTrophy />
        <span>Campeonatos</span>
      </RouterLink>

      <RouterLink
        to="/tabelas"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconTable />
        <span>Tabelas</span>
      </RouterLink>

      <RouterLink
        to="/partidas"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconCalendar />
        <span>Partidas</span>
      </RouterLink>

      <RouterLink
        to="/perfil"
        class="nav-item"
        active-class="nav-item-active"
      >
        <IconUser />
        <span>Perfil</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { h } from 'vue'

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

const IconHome = svgIcon([
  'M3 11l9-7 9 7M5 10v10h14V10',
])

const IconTimes = svgIcon([
  'M9 11a3 3 0 100-6 3 3 0 000 6z',
  'M16 11a3 3 0 100-6 3 3 0 000 6z',
  'M2 20c0-3 3-5 7-5s7 2 7 5',
  'M14 15c3.2.4 5 2 5 5',
])

const IconTrophy = svgIcon([
  'M8 4h8v4a4 4 0 01-8 0V4z',
  'M8 4H4v2a4 4 0 004 4',
  'M16 4h4v2a4 4 0 01-4 4',
  'M12 12v4',
  'M9 20h6',
  'M10 16h4v4h-4z',
])

const IconTable = svgIcon([
  'M3 5h18v14H3z',
  'M3 10h18',
  'M9 5v14',
])

const IconCalendar = svgIcon([
  'M3 5h18v16H3z',
  'M8 3v4',
  'M16 3v4',
  'M3 10h18',
])

const IconUser = svgIcon([
  'M12 12a4 4 0 100-8 4 4 0 000 8z',
  'M4 20c0-4 3.5-7 8-7s8 3 8 7',
])
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  flex-shrink: 0;

  background: #0b1f4d;
  color: #fff;

  padding: 24px 16px;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;
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

  transition:
    background 0.15s,
    color 0.15s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item-active {
  background: #f0b429;
  color: #0b1f4d;
}

/* Responsividade do Sidebar */
@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    min-height: auto;

    flex-direction: row;
    align-items: center;

    overflow-x: auto;
  }

  .sidebar-logo {
    padding: 0 16px 0 0;
    flex-shrink: 0;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-shrink: 0;
  }

  .nav-item {
    white-space: nowrap;
  }
}
</style>