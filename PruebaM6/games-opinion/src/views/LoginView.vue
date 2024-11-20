<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1>Inicia Sesión</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="name">Nombre:</label>
          <input
            v-model="name"
            type="text"
            id="name"
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div class="input-group">
          <label for="lastName">Apellido:</label>
          <input
            v-model="lastName"
            type="text"
            id="lastName"
            placeholder="Ingresa tu apellido"
            required
          />
        </div>
        <div v-if="error" class="error-message">
          Por favor, ingresa nombre y apellido
        </div>
        <button type="submit" class="btn-login">
          <span class="btn-text">Ingresar</span>
          <span class="btn-icon">🎮</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      lastName: "",
      error: false,
    };
  },
  methods: {
    login() {
      if (this.name && this.lastName) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name: this.name, lastName: this.lastName })
        );
        this.$router.push("/admin"); // Redirige a la ruta correcta
      } else {
        this.error = true;
        // Ocultar el error después de 3 segundos
        setTimeout(() => {
          this.error = false;
        }, 3000);
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.login-wrapper {
  background: url('@/assets/game-bg.png') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background: rgba(0, 0, 0, 0.75);
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  color: #fff;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.login-container h1 {
  margin-bottom: 30px;
  font-family: "Roboto", sans-serif;
  font-size: 2em;
  letter-spacing: 2px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  box-shadow: 0 0 5px #ff9800;
}

.error-message {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-weight: bold;
  animation: fadeInError 0.5s ease-in-out;
}

.btn-login {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #ff9800;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  overflow: hidden;
}

.btn-login:hover {
  background-color: #e68900;
  transform: translateY(-2px);
}

.btn-login:active {
  transform: translateY(0);
}

.btn-login .btn-icon {
  margin-left: 10px;
  transition: transform 0.3s;
}

.btn-login:hover .btn-icon {
  transform: rotate(20deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInError {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 500px) {
  .login-container {
    padding: 30px 40px;
  }

  .login-container h1 {
    font-size: 1.5em;
  }

  .btn-login {
    width: 100%;
    padding: 12px;
  }
}
</style>
