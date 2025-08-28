<template>
  <v-toolbar :color="color" :flat="flat" :elevation="elevation">
    <!-- Hamburger menu for mobile -->
    <v-btn
      v-if="isMobile"
      icon
      size="small"
      :color="hamburgerColor"
      rounded="0"
      variant="elevated"
      @click="toggleDrawer"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <v-spacer />

    <!-- Render dynamic buttons with badge on online users -->
    <template v-for="(button, i) in toolbarButtons" :key="i">
      <v-badge
        v-if="button.icon === 'mdi-account-group'"
        :content="onlineUsers.length"
        color="red"
        overlap
        bordered
        offset-x="6"
        offset-y="6"
        :value="onlineUsers.length > 0"
      >
        <v-btn
          icon
          size="small"
          :variant="button.variant || 'elevated'"
          :color="button.color || 'primary'"
          rounded="0"
          class="mr-3"
          @click="button.onClick"
        >
          <v-icon>{{ button.icon }}</v-icon>
        </v-btn>
      </v-badge>

      <v-btn
        v-else
        icon
        size="small"
        :variant="button.variant || 'elevated'"
        :color="button.color || 'primary'"
        rounded="0"
        class="mr-3"
        @click="button.onClick"
      >
        <v-icon>{{ button.icon }}</v-icon>
      </v-btn>
    </template>

    <slot />
  </v-toolbar>

  <!-- History Dialog -->
  <v-dialog v-model="showHistory" max-width="600" persistent transition="slide-in-right">
    <v-card>
      <v-card-title>
        History
        <v-btn
          color="red"
          size="small"
          variant="elevated"
          icon
          rounded="0"
          style="float:right"
          @click="toggleHistory"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <History></History>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Profile Dialog -->
  <v-dialog v-model="showAccountDialog" max-width="480" persistent transition="slide-in-left">
    <v-card>
      <v-card-title>
        Account Details
        <v-btn @click="showAccountDialog = false" style="float:right" variant="elevated" icon color="red">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field readonly v-model="storedData.$state.userInformation.EmployeeCode" rounded="0" label="Account ID" />
        <v-text-field readonly v-model="storedData.$state.userInformation.EmployeeName" rounded="0" label="Account Name" />
        <v-text-field readonly v-model="storedData.$state.userInformation.DepartmentName" rounded="0" label="Account Department" />
        <v-text-field readonly v-model="storedData.$state.userInformation.SectionName" rounded="0" label="Account Section" />
        <v-text-field readonly v-model="storedData.$state.userInformation.TeamName" rounded="0" label="Account Team" />
        <v-text-field readonly v-model="storedData.$state.userInformation.AccessRights" rounded="0" label="Access Rights" />
        <v-card-actions>
          <v-row>
            <v-btn @click="showAccountDialog = false" color="primary" rounded="0" block variant="elevated">OKAY</v-btn>
          </v-row>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Online Users Dialog -->
  <v-dialog v-model="showOnlineUsersDialog" max-width="400" persistent transition="slide-in-left">
    <v-card>
      <v-card-title>
        Online Users
        <v-btn icon color="red" @click="showOnlineUsersDialog = false" style="float:right">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="user in onlineUsers" :key="user.EmployeeCode">
            <v-list-item-content>
              <v-list-item-title>{{ user.EmployeeName }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.EmployeeCode }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="onlineUsers.length === 0">
            <v-list-item-content>
              <v-list-item-title>No users online</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, computed } from 'vue';
import History from '../components/History.vue';
import { useTheme } from 'vuetify';
import { useMainStore } from '../store/mainStore';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

const theme = useTheme();
const router = useRouter();
const storedData = useMainStore();

const showHistory = ref(false);
const showAccountDialog = ref(false);
const showOnlineUsersDialog = ref(false);
const onlineUsers = ref([]);
const isMobile = ref(false);
const drawer = ref(true);

const socket = io('http://localhost:3000'); // Your backend URL

const toggleDrawer = inject('toggleDrawer');

const props = defineProps({
  color: { type: String, default: 'white' },
  flat: { type: Boolean, default: true },
  elevation: { type: [Number, String], default: 3 },
  hamburgerColor: { type: String, default: 'green' },
});

// Check screen size for mobile
const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 600;
  drawer.value = !isMobile.value;
};

onMounted(() => {
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);

  // Listen for online users updates
  socket.on('update-online-users', (users) => {
    onlineUsers.value = users;
  });

  // On socket reconnect, emit user-login if user info exists
  socket.on('connect', () => {
    if (storedData.$state.userInformation?.EmployeeCode) {
      socket.emit('user-login', {
        EmployeeCode: storedData.$state.userInformation.EmployeeCode,
        EmployeeName: storedData.$state.userInformation.EmployeeName,
      });
    }
  });
});


onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile);
  socket.off('update-online-users');
  socket.off('connect');
});

// Theme toggle
function changeTheme() {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('theme', newTheme);
}
function toggleHistory() {
  showHistory.value = !showHistory.value;
}


// Toolbar buttons
const toolbarButtons = computed(() => [
  {
    icon: theme.global.name.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night',
    color: 'primary',
    onClick: changeTheme,
  },
  {
    icon: 'mdi-history',
    color: 'primary',
    onClick: () => {
      toggleHistory()
    },
  },
  // {
  //   icon: 'mdi-information',
  //   color: 'primary',
  //   onClick: () => {
  //     alert('Info clicked!');
  //   },
  // },
  {
    icon: 'mdi-account',
    color: 'primary',
    onClick: () => {
      showAccountDialog.value = true;
    },
  },
  {
    icon: 'mdi-account-group',
    color: 'secondary',
    onClick: () => {
      showOnlineUsersDialog.value = !showOnlineUsersDialog.value;
    },
  },
  {
    icon: 'mdi-logout',
    color: 'red',
    onClick: () => {
      socket.emit('user-logout');
      storedData.$state.userInformation = {};
      router.push('/login');
    },
  },
]);
</script>

<style>
@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-out-right {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
@keyframes slide-in-left {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-out-left {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.slide-in-right-enter-active {
  animation: slide-in-right 0.3s ease-out forwards;
}
.slide-in-right-leave-active {
  animation: slide-out-right 0.3s ease-in forwards;
}
.slide-in-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-in-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-in-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-in-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-left-enter-active {
  animation: slide-in-left 0.3s ease-out forwards;
}
.slide-in-left-leave-active {
  animation: slide-out-left 0.3s ease-in forwards;
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
