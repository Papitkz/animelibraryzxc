<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="login-box" elevation="4">
      <v-card-title class="headline justify-center">Sign In</v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            v-model="loginObj.EmployeeCode"
            label="Employee Code"
            prepend-inner-icon="mdi-account-box"
            @update:model-value="getEmployee()"
            @blur="getEmployee()"
          />

          <v-text-field
            class="mt-n3"
            readonly
            v-model="loginObj.EmployeeName"
            label="Employee Name"
            prepend-inner-icon="mdi-account"
          />

          <v-text-field
            class="mt-n3"
            v-model="loginObj.Password"
            label="Password"
            type="password"
            prepend-inner-icon="mdi-lock"
          />

          <v-btn
            color="primary"
            block
            large
            @click="login"
            :loading="loading"
            @mousedown="animateButton"
            :class="{ 'btn-press': pressed }"
          >
            Sign In
          </v-btn>

          <div class="forgot-container">
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useMainStore } from '../store/mainStore';
import { io } from 'socket.io-client';

const router = useRouter();
const storedData = useMainStore();

const socket = io('http://10.169.141.193:3000'); // Make sure this is the same socket instance you use elsewhere

const loginObj = ref({});
const loading = ref(false);
const pressed = ref(false);
const formRef = ref(null);

async function login() {
  if (formRef.value.validate()) {
    loading.value = true;
    setTimeout(async () => {
      loading.value = false;
      if (loginObj.value.EmployeeCode === loginObj.value.Password) {
        alert(`Welcome back, ${loginObj.value.EmployeeName}`);

        // Save user info to store
        storedData.$state.userInformation = { ...loginObj.value };

        // Emit login event to backend via socket
        socket.emit('user-login', {
          EmployeeCode: loginObj.value.EmployeeCode,
          EmployeeName: loginObj.value.EmployeeName,
          DepartmentName: loginObj.value.DepartmentName,
          SectionName: loginObj.value.SectionName,
          TeamName: loginObj.value.TeamName,
        });

        router.push('/');
      } else {
        alert('Invalid Detail/s');
      }
    }, 1500);
  }
}

function animateButton() {
  pressed.value = true;
  setTimeout(() => {
    pressed.value = false;
  }, 150);
}

async function getEmployee() {
  if (loginObj.value.EmployeeCode.length === 5) {
    try {
      const result = await axios.get(
        `http://hrdapps79:9826/sharedapi/getemployeecode/${loginObj.value.EmployeeCode}`
      );
      if (result.data && result.data.length > 0) {
        loginObj.value = result.data[0]
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  }
}
</script>
<style scoped>
.fill-height {
  height: 100vh;
  background: #eef2f3;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.login-box {
  width: 450px;
  padding: 30px;
  border-radius: 0px;
  background-color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.login-box:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.headline {
  font-weight: 600;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.v-text-field {
  margin-top: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.v-text-field input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

.v-btn {
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-press {
  transform: scale(0.98);
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
}

.forgot-container {
  margin-top: 15px;
  text-align: center;
}

.forgot-link {
  font-size: 0.9rem;
  color: #555;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #3b82f6;
}
</style>
