<template>
  <v-app>

    <!-- Main content -->
    <v-main class="p-4" style="background:#A4A0AA;">
      <transition name="slide-in-left" mode="out-in">
        <router-view @toggle-drawer="toggleDrawer" />
      </transition>
    </v-main>


    <div class="overlay" v-if="loader == true">
        <!-- <v-img width="500%" src="https://media1.tenor.com/m/DwzuGdPtg6EAAAAC/african-laugh-cry-boy.gif"></v-img> -->
      <div class="spinner-box">
      <div class="configure-border-1">  
        <div class="configure-core"></div>
      </div>  
      <div class="configure-border-2">
        <div class="configure-core"></div>
      </div> 
    </div>
    </div>
  </v-app>
</template>

<script setup>
import { ref, provide, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useMainStore } from './store/mainStore';

const drawer = ref(true);
const isMobile = ref(false);
const loader = ref(false)
const storedData = useMainStore()



const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
  drawer.value = !isMobile.value;
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile);
});


const navItems = [
  { title: 'Home', route: '/', icon:'mdi-home' },
];

const route = useRoute();

const isActive = (routePath) => route.path === routePath;

function onNavigate() {
  if (isMobile.value) {
    drawer.value = false;
  }
  toggleroute()
}

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};
const toggleroute = () => {
  loader.value = true
  setTimeout(() => {
      loader.value = false
  },600);  
};


provide('isMobile', isMobile);
provide('drawer', drawer);
provide('toggleDrawer', toggleDrawer);

</script>

<style scoped>
/* Drawer slide transition */
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Cursor improvements */

/* Default cursor for user info section (non-clickable) */
.v-navigation-drawer > div:first-child {
  cursor: default;
}

/* Pointer cursor for clickable navigation list items */
.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Subtle scale effect on hover for better feedback */
.v-list-item:hover {
  transform: scale(1.03);
  cursor: pointer;
}
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(75, 61, 61, 0.379);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  /* From Uiverse.io by csozidev */ 
/*
 I DID NOT MAKE THIS! THIS IS JUST A REPOST FROM: 
 codepen.io/AlexWarnes/pen/jXYYKL 
 My website: english.csozi.hu*/

.configure-border-1 {
  width: 50px;
  height: 50px;
  padding: 3px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fb5b53;
  animation: configure-clockwise 3s ease-in-out 0s infinite alternate;
}

.configure-border-2 {
  width: 50px;
  height: 50px;
  padding: 3px;
  left: -50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(63,249,220);
  transform: rotate(45deg);
  animation: configure-xclockwise 3s ease-in-out 0s infinite alternate;
}

.configure-core {
  width: 100%;
  height: 100%;
  background-color: #1d2630;
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }

  25% {
    transform: rotate(-45deg);
  }

  50% {
    transform: rotate(-135deg);
  }

  75% {
    transform: rotate(-225deg);
  }

  100% {
    transform: rotate(-315deg);
  } 
}
</style>
<style lang="scss">
@import "./assets/fonts/fonts.css";

@font-face {
  font-family: "Poppins";
  src: url("./assets/font/poppins.medium.ttf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}
@font-face {
  font-family: "AeonikBold";
  src: url("./assets/font/AeonikFono-Bold.otf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}

@font-face {
  font-family: "ChaletBook";
  src: url("./assets/font/ChaletBookRegular.ttf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}

body {
  font-family: "Poppins";
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.slide-in-left-enter-active {
  animation: slide-in-left 0.3s cubic-bezier(.55,0,.1,1) forwards;
}
.slide-in-left-leave-active {
  animation: slide-out-left 0.3s cubic-bezier(.55,0,.1,1) forwards;
}
.slide-in-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-in-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-in-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-in-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
  