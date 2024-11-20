<template>
  <div>
    <!-- Contenedor Principal con v-if -->
    <div class="opinions-wrapper" v-if="currentUser">
      <div class="opinions-container">
        <h1>Escribe tu opinión para el juego: {{ gameName }}</h1>
        <div class="opinion-form">
          <label for="content">Opinión:</label>
          <textarea
            v-model="newOpinion.content"
            id="content"
            placeholder="Tu opinión debe ir aquí..."
          ></textarea>

          <button @click="addOrUpdateOpinion" class="btn-submit">
            {{ isEditing ? "Actualizar" : "Agregar" }}
          </button>
        </div>

        <h2>A continuación podrás ver las opiniones</h2>
        <div v-if="opinions.length === 0" class="no-opinions">
          No existen opiniones para mostrar.
        </div>
        <div v-else class="opinions-list">
          <div
            v-for="(opinion, index) in opinions"
            :key="index"
            class="opinion-card"
          >
            <p>
              Opinión creada por:
              <strong>{{ opinion.name }} {{ opinion.lastName }}</strong>
            </p>
            <p>Opinión: {{ opinion.content }}</p>
            <div
              v-if="
                opinion.name === currentUser.name &&
                opinion.lastName === currentUser.lastName
              "
              class="opinion-actions"
            >
              <button @click="editOpinion(index)" class="btn-edit">Editar</button>
              <button @click="deleteOpinion(index)" class="btn-delete">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenedor de Carga con v-else -->
    <div v-else class="loading-screen">
      <h1>Cargando...</h1>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gameName: this.$route.params.gameName, // Nombre del juego tomado de la ruta
      opinions: [], // Array para guardar las opiniones
      newOpinion: {
        content: "",
      },
      isEditing: false,
      editingIndex: null,
      currentUser: null,
    };
  },
  methods: {
    // Cargar opiniones desde localStorage al montar el componente
    loadOpinions() {
      const storedOpinions = localStorage.getItem(`opinions_${this.gameName}`);
      if (storedOpinions) {
        this.opinions = JSON.parse(storedOpinions);
      }
    },
    // Guardar opiniones en localStorage
    saveOpinions() {
      localStorage.setItem(
        `opinions_${this.gameName}`,
        JSON.stringify(this.opinions)
      );
    },
    // Agregar o actualizar opinión
    addOrUpdateOpinion() {
      if (!this.newOpinion.content.trim()) {
        alert("La opinión no puede estar vacía");
        return;
      }
      if (this.isEditing) {
        // Verificar si el usuario actual es el propietario de la opinión
        const opinion = this.opinions[this.editingIndex];
        if (
          opinion.name === this.currentUser.name &&
          opinion.lastName === this.currentUser.lastName
        ) {
          // Actualizar opinión existente
          this.opinions[this.editingIndex] = {
            ...opinion,
            content: this.newOpinion.content,
          };
          this.isEditing = false;
          this.editingIndex = null;
        } else {
          alert("No puedes editar opiniones de otros usuarios");
        }
      } else {
        // Agregar nueva opinión con el nombre y apellido del usuario actual
        this.opinions.push({
          name: this.currentUser.name,
          lastName: this.currentUser.lastName,
          content: this.newOpinion.content,
        });
      }
      this.saveOpinions(); // Guardar cambios en localStorage

      // Limpiar el formulario
      this.newOpinion.content = "";
    },
    // Editar una opinión existente
    editOpinion(index) {
      const opinion = this.opinions[index];
      if (
        opinion.name === this.currentUser.name &&
        opinion.lastName === this.currentUser.lastName
      ) {
        this.newOpinion = { content: opinion.content };
        this.isEditing = true;
        this.editingIndex = index;
      } else {
        alert("No puedes editar opiniones de otros usuarios");
      }
    },
    // Eliminar una opinión
    deleteOpinion(index) {
      const opinion = this.opinions[index];
      if (
        opinion.name === this.currentUser.name &&
        opinion.lastName === this.currentUser.lastName
      ) {
        if (confirm("¿Estás seguro de que deseas eliminar esta opinión?")) {
          this.opinions.splice(index, 1);
          this.saveOpinions(); // Guardar cambios en localStorage
        }
      } else {
        alert("No puedes eliminar opiniones de otros usuarios");
      }
    },
  },
  mounted() {
    this.loadOpinions(); // Cargar opiniones al montar el componente
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      this.currentUser = user;
    }
    // No es necesario redirigir aquí ya que la guarda de ruta ya lo hace
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.opinions-wrapper {
  background: url('@/assets/game-bg.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: backgroundFadeIn 1.5s ease-in-out;
}

@keyframes backgroundFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.opinions-container {
  background: rgba(0, 0, 0, 0.85);
  padding: 40px 60px;
  border-radius: 15px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  max-width: 800px;
  width: 100%;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  position: relative;
  overflow: hidden;
  animation: containerSlideIn 1s ease-out;
}

@keyframes containerSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.opinions-container h1 {
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #ffeb3b;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.opinions-container h2 {
  margin: 30px 0 20px;
  font-size: 1.8em;
  color: #ff9800;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
}

.opinion-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: background 0.3s, transform 0.3s;
}

.opinion-form:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.opinion-form label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.opinion-form textarea {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 2px solid #00e5ff;
  border-radius: 8px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;
  resize: vertical;
  transition: border-color 0.3s, background 0.3s;
}

.opinion-form textarea:focus {
  outline: none;
  border-color: #00bcd4;
  background: rgba(255, 255, 255, 0.15);
}

.btn-submit {
  padding: 12px 30px;
  background-color: #ff9800;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.btn-submit:hover {
  background-color: #fb8c00;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.no-opinions {
  color: #ff6b6b;
  font-weight: bold;
  margin-top: 20px;
  font-size: 1.2em;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.opinions-list {
  margin-top: 20px;
}

.opinion-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px 25px;
  margin-bottom: 15px;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.opinion-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.opinion-card p {
  margin: 10px 0;
  font-size: 1.1em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.opinion-actions {
  margin-top: 15px;
}

.btn-edit,
.btn-delete {
  padding: 8px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-edit {
  background-color: #ffc107;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-edit:hover {
  background-color: #e0a800;
  transform: scale(1.05);
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-delete:hover {
  background-color: #bd2130;
  transform: scale(1.05);
}

.loading-screen {
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 50px 100px;
  border-radius: 15px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  font-size: 2em;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 900px) {
  .opinions-container {
    padding: 30px 40px;
  }

  .opinions-container h1 {
    font-size: 2em;
  }

  .opinions-container h2 {
    font-size: 1.5em;
  }

  .btn-submit {
    width: 100%;
    padding: 12px 0;
  }

  .opinion-card {
    padding: 15px 20px;
  }
}

@media (max-width: 600px) {
  .opinions-container {
    padding: 20px 30px;
  }

  .opinions-container h1 {
    font-size: 1.8em;
  }

  .opinions-container h2 {
    font-size: 1.3em;
  }

  .btn-submit {
    width: 100%;
    padding: 10px 0;
  }

  .opinion-form textarea {
    height: 100px;
  }

  .opinion-card {
    padding: 10px 15px;
  }
}
</style>
