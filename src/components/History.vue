<template>
    <v-card flat class="pa-4" style="max-width: 600px; margin: auto;border-radius:0%">
     <v-card-text>
      <v-timeline dense class="mt-n3">
        <v-timeline-item style="font-family:Poppins"  v-for="(item, index) in historyItems" :key="index" :color="item.color"
          small >
          <template #opposite>
            <span style="font-family:Poppins"  class="text-caption grey--text">{{ item.date }}</span>
          </template>
          <v-card class="pa-3" outlined>
            <div style="font-family:Poppins" >{{ item.description }}</div>
          </v-card>
        </v-timeline-item>
      </v-timeline>
     </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

const historyItems = ref([
  { date: '2025-04-20', description: 'Initial release of the app.', color: 'green' },
  { date: '2025-05-10', description: 'Added new features to the dashboard.', color: 'blue' },
  { date: '2025-06-01', description: 'Improved performance and fixed bugs.', color: 'red' },
]);
</script>

<style lang="scss">
@import "../assets/fonts/fonts.css";

@font-face {
  font-family: "Poppins";
  src: url("../assets/font/poppins.medium.ttf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}
@font-face {
  font-family: "AeonikBold";
  src: url("../assets/font/AeonikFono-Bold.otf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}

@font-face {
  font-family: "ChaletBook";
  src: url("../assets/font/ChaletBookRegular.ttf") format("opentype");
  font-weight: 1000 !important;
  font-style: normal;
}

body {
  font-family: "Poppins";
}
</style>
