<template>
  <div class="opinions-container">
    <h1>Escribe tu opinión para el juego: {{ gameName }}</h1>
    <div class="opinion-form">
      <label for="name">Nombre:</label>
      <input v-model="newOpinion.name" type="text" id="name" placeholder="nombre" />

      <label for="content">Opinión:</label>
      <textarea v-model="newOpinion.content" id="content" placeholder="Tu opinión debe ir aquí..."></textarea>

      <button @click="addOrUpdateOpinion" class="btn-submit">
        {{ isEditing ? "Actualizar" : "Agregar" }}
      </button>
    </div>

    <h2>A continuación podrás ver tu opinión</h2>
    <div v-if="opinions.length === 0" class="no-opinions">
      No existen opiniones para mostrar.
    </div>
    <div v-else>
      <div
        v-for="(opinion, index) in opinions"
        :key="index"
        class="opinion-card"
      >
        <p>Opinión creada por: <strong>{{ opinion.name }}</strong></p>
        <p>Opinión: {{ opinion.content }}</p>
        <button @click="editOpinion(index)" class="btn-edit">Editar</button>
        <button @click="deleteOpinion(index)" class="btn-delete">Eliminar</button>
      </div>
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
        name: "",
        content: "",
      },
      isEditing: false,
      editingIndex: null,
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
      localStorage.setItem(`opinions_${this.gameName}`, JSON.stringify(this.opinions));
    },
    // Agregar o actualizar opinión
    addOrUpdateOpinion() {
      if (this.isEditing) {
        // Actualizar opinión existente
        this.opinions[this.editingIndex] = { ...this.newOpinion };
        this.isEditing = false;
        this.editingIndex = null;
      } else {
        // Agregar nueva opinión
        this.opinions.push({ ...this.newOpinion });
      }
      this.saveOpinions(); // Guardar cambios en localStorage

      // Limpiar el formulario
      this.newOpinion.name = "";
      this.newOpinion.content = "";
    },
    // Editar una opinión existente
    editOpinion(index) {
      this.newOpinion = { ...this.opinions[index] };
      this.isEditing = true;
      this.editingIndex = index;
    },
    // Eliminar una opinión
    deleteOpinion(index) {
      this.opinions.splice(index, 1);
      this.saveOpinions(); // Guardar cambios en localStorage
    },
  },
  mounted() {
    this.loadOpinions(); // Cargar opiniones al montar el componente
  },
};
</script>

<style scoped>
.opinions-container {
  padding: 20px;
}

.opinion-form {
  margin-bottom: 20px;
}

.opinion-form label {
  display: block;
  margin: 10px 0 5px;
}

.opinion-form input,
.opinion-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-submit {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.no-opinions {
  color: red;
  font-weight: bold;
}

.opinion-card {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 10px;
}

.btn-edit {
  background-color: #ffc107;
  border: none;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
  color: #000;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.btn-delete {
  background-color: #dc3545;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  color: white;
}

.btn-delete:hover {
  background-color: #bd2130;
}
</style>
