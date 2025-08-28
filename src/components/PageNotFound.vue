<template>
    <v-container fluid class="d-flex align-center justify-center fade-in" style="min-height: 90vh">
      <v-card elevation="3" class="pa-6 animated-card" max-width="500" style="border-radius: 8px;" >
        <v-card-text class="text-center">
          <v-icon size="64" color="grey darken-1" class="icon-shake">mdi-alert-circle-outline</v-icon>
          <h1 class="mt-4 mb-2">Page Not Found</h1>
          <p class="mb-4">Oops! The page you're looking for doesn't exist or has been moved.</p>
          <v-btn color="primary" rounded @click="$router.push('/')">Go to Home</v-btn>
        </v-card-text>
      </v-card>
    </v-container>
</template>

<script setup>
</script>

<style scoped>
/* Fade-in effect for container */
.fade-in {
  opacity: 0;
  animation: fadeIn 1s forwards;
}

/* Card entrance animation */
.animated-card {
  transform: translateY(-20px);
  opacity: 0;
  animation: slideUpFade 1s forwards;
  animation-delay: 0.3s;
}

/* Icon shake animation for a subtle attention effect */
.icon-shake {
  display: inline-block;
  animation: shake 1s infinite alternate;
}

/* Keyframes for fade-in */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Keyframes for slide up and fade in card */
@keyframes slideUpFade {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Shake animation for icon */
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(2px);
  }
}
</style>