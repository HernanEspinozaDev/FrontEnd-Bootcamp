<template>
  <nav class="navbar">
    <button @click="$router.push('/')">Opiniones de juegos</button>
    <div class="navbar-right">
      <!-- Mostrar el nombre si el usuario está logueado -->
      <span v-if="currentUser">Bienvenid@ {{ currentUser.name }} {{ currentUser.lastName }}</span>
      <button @click="navigateToAdmin">Administración</button>
      <button v-if="currentUser" @click="logout">Cerrar Sesión</button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentUser: null, // Estado del usuario logueado
    };
  },
  methods: {
    // Redirige según el estado del usuario
    navigateToAdmin() {
      if (this.currentUser) {
        this.$router.push('/admin'); // Redirige a la administración si está logueado
      } else {
        this.$router.push('/login'); // Redirige al login si no está logueado
      }
    },
    // Cierra la sesión y limpia los datos
    logout() {
      localStorage.removeItem("currentUser");
      this.currentUser = null;
      this.$router.push('/login'); // Redirige al login tras cerrar sesión
    },
    // Sincroniza el estado del usuario con localStorage
    updateUser() {
      const user = localStorage.getItem("currentUser");
      if (user) {
        this.currentUser = JSON.parse(user);
      } else {
        this.currentUser = null;
      }
    },
  },
  mounted() {
    this.updateUser(); // Carga el usuario al montar el componente
    // Escucha los cambios en localStorage
    window.addEventListener("storage", this.updateUser);
  },
  beforeUnmount() {
    // Limpia el evento cuando se desmonta el componente
    window.removeEventListener("storage", this.updateUser);
  },
  watch: {
    // Watcher para detectar cambios en la ruta y actualizar el usuario
    $route() {
      this.updateUser();
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  text-decoration: underline;
}
</style>
