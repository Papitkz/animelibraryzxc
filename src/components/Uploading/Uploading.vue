<template>
    <v-container fluid>
      <DynamicToolbar  />
      <br />
      <v-card elevation="3" style="border-radius:0%" min-height="85vh">
        <v-card-text>
        </v-card-text>
      </v-card>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import DynamicToolbar from '../../components/Uploading/Uploading';

</script>
  