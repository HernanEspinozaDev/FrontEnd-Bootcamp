<template>
  <div>
    <!-- Contenedor Principal con v-if -->
    <div class="admin-wrapper" v-if="currentUser">
      <div class="admin-container">
        <h1>Bienvenid@ {{ currentUser.name }} {{ currentUser.lastName }}</h1>
        <h2>Resumen de tu cuenta</h2>
        <div class="admin-content">
          <!-- Sección de Me Gusta -->
          <div class="likes-section">
            <h2>Tus Me Gusta</h2>
            <ul>
              <li
                v-for="game in userLikes"
                :key="game"
                @click="selectLikedGame(game)"
                :class="{ selected: selectedLikedGame === game }"
              >
                {{ game }}
              </li>
            </ul>
          </div>

          <!-- Sección de detalles del juego seleccionado -->
          <div class="game-details" v-if="selectedLikedGame">
            <h3>{{ selectedLikedGame }}</h3>

            <!-- Sección para agregar coins -->
            <div class="coin-container">
              <p>¿Deseas comprar coins para este juego?</p>
              <button
                @click="addCoins(selectedLikedGame)"
                :disabled="gameCoins[selectedLikedGame] >= 50"
                class="btn-add-coins"
              >
                Agregar coins
              </button>
              <div
                class="progress-bar"
                :style="{
                  backgroundColor: getBarColor(selectedLikedGame),
                  width: `${gameCoins[selectedLikedGame] * 2}%`,
                }"
              ></div>
              <p class="coin-count">
                $ {{ gameCoins[selectedLikedGame] || 0 }}
                <span
                  v-if="gameCoins[selectedLikedGame] >= 50"
                  class="max-credit"
                >
                  Llegaste al máximo de tu crédito
                </span>
              </p>
            </div>

            <!-- Mostrar estadísticas -->
            <div class="stats">
              <div class="stat">
                <h3>% de finalización de juego</h3>
                <p>{{ gameCompletion[selectedLikedGame] || 0 }}%</p>
              </div>
              <div class="stat">
                <h3>Logros en el juego</h3>
                <p>{{ gameAchievements[selectedLikedGame] || 0 }}</p>
              </div>
              <div class="stat">
                <h3>Recompensas</h3>
                <p>{{ gameRewards[selectedLikedGame] || 0 }} 🏅</p>
              </div>
            </div>

            <!-- Botón para editar estadísticas -->
            <button @click="editingStats = !editingStats" class="btn-edit-stats">
              {{ editingStats ? "Guardar Estadísticas" : "Editar Estadísticas" }}
            </button>

            <!-- Formularios para editar estadísticas -->
            <div v-if="editingStats" class="edit-stats">
              <div>
                <label>% de finalización de juego:</label>
                <input
                  type="number"
                  v-model.number="gameCompletion[selectedLikedGame]"
                />
              </div>
              <div>
                <label>Logros en el juego:</label>
                <input
                  type="number"
                  v-model.number="gameAchievements[selectedLikedGame]"
                />
              </div>
              <div>
                <label>Recompensas:</label>
                <input
                  type="number"
                  v-model.number="gameRewards[selectedLikedGame]"
                />
              </div>
            </div>
          </div>

          <!-- Sección de comentarios -->
          <div class="comments-section">
            <h2>Tus Comentarios</h2>
            <ul>
              <li
                v-for="game in userCommentedGames"
                :key="game"
                @click="selectCommentedGame(game)"
                :class="{ selected: selectedCommentedGame === game }"
              >
                {{ game }}
              </li>
            </ul>
            <div v-if="selectedCommentedGame" class="comments-details">
              <h3>Comentarios para {{ selectedCommentedGame }}</h3>
              <ul>
                <li
                  v-for="(comment, index) in userComments[selectedCommentedGame]"
                  :key="index"
                >
                  <p>{{ comment.content }}</p>
                  <div v-if="!isEditingComment">
                    <button @click="editComment(selectedCommentedGame, index)" class="btn-action">
                      Editar
                    </button>
                    <button @click="deleteComment(selectedCommentedGame, index)" class="btn-action btn-delete">
                      Eliminar
                    </button>
                  </div>
                </li>
              </ul>
              <!-- Formulario para editar comentario -->
              <div v-if="isEditingComment" class="edit-comment-form">
                <h4>Editando Comentario</h4>
                <textarea v-model="editedCommentContent"></textarea>
                <div class="comment-buttons">
                  <button @click="saveEditedComment" class="btn-save">Guardar</button>
                  <button @click="cancelEditComment" class="btn-cancel">Cancelar</button>
                </div>
              </div>
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
      currentUser: null,
      userLikes: [],
      userComments: {},
      userCommentedGames: [],
      selectedLikedGame: null,
      selectedCommentedGame: null,
      gameCoins: {},
      gameAchievements: {},
      gameCompletion: {},
      gameRewards: {},
      editingStats: false,
      isEditingComment: false,
      editedCommentContent: '',
      originalCommentContent: '',
      editingCommentGame: null,
      editingCommentIndex: null,
    };
  },
  methods: {
    loadUserData() {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) {
        this.currentUser = user;

        // Cargar Me Gusta
        const likes = JSON.parse(localStorage.getItem("likes")) || [];
        this.userLikes = likes
          .filter(
            (like) =>
              like.user.name === this.currentUser.name &&
              like.user.lastName === this.currentUser.lastName
          )
          .map((like) => like.game);

        // Cargar comentarios
        this.userComments = {};
        this.userCommentedGames = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("opinions_")) {
            const gameName = key.substring(9);
            const opinions = JSON.parse(localStorage.getItem(key));
            const userOpinions = opinions.filter(
              (opinion) =>
                opinion.name === this.currentUser.name &&
                opinion.lastName === this.currentUser.lastName &&
                opinion.content
            );
            if (userOpinions.length > 0) {
              this.userCommentedGames.push(gameName);
              this.userComments[gameName] = userOpinions;
            }
          }
        }

        // Cargar datos guardados de los juegos (coins, logros, etc.)
        this.userLikes.forEach((game) => {
          const key = `gameData_${game}_${this.currentUser.name}_${this.currentUser.lastName}`;
          const gameData = JSON.parse(localStorage.getItem(key)) || {};
          this.gameCoins[game] = gameData.coins || 0;
          this.gameAchievements[game] = gameData.achievements || 0;
          this.gameCompletion[game] = gameData.completion || 0;
          this.gameRewards[game] = gameData.rewards || 0;
        });
      } else {
        // No hay usuario logueado
        alert(
          "Por favor, inicia sesión para acceder a la página de administración"
        );
        this.$router.push("/login");
      }
    },
    selectLikedGame(game) {
      this.selectedLikedGame = game;
      this.editingStats = false; // Reiniciar estado de edición
    },
    selectCommentedGame(game) {
      this.selectedCommentedGame = game;
      // Reiniciar estado de edición al seleccionar un nuevo juego
      this.isEditingComment = false;
      this.editedCommentContent = '';
      this.originalCommentContent = '';
      this.editingCommentGame = null;
      this.editingCommentIndex = null;
    },
    addCoins(game) {
      if (this.gameCoins[game] < 50) {
        this.gameCoins[game] += 5;
        this.saveGameData(game);
      }
    },
    getBarColor(game) {
      const coins = this.gameCoins[game] || 0;
      if (coins <= 20) return "#4caf50"; // verde
      if (coins > 20 && coins <= 30) return "#ffeb3b"; // amarillo
      return "#f44336"; // rojo
    },
    saveGameData(game) {
      // Guardar los datos del juego en localStorage
      const gameData = {
        coins: this.gameCoins[game],
        achievements: this.gameAchievements[game],
        completion: this.gameCompletion[game],
        rewards: this.gameRewards[game],
      };
      const key = `gameData_${game}_${this.currentUser.name}_${this.currentUser.lastName}`;
      localStorage.setItem(key, JSON.stringify(gameData));
    },
    // Métodos para editar y eliminar comentarios
    editComment(gameName, index) {
      this.isEditingComment = true;
      this.editingCommentGame = gameName;
      this.editingCommentIndex = index;
      const comment = this.userComments[gameName][index];
      this.editedCommentContent = comment.content;
      this.originalCommentContent = comment.content;
    },
    saveEditedComment() {
      const gameName = this.editingCommentGame;
      const index = this.editingCommentIndex;
      const newContent = this.editedCommentContent;

      // Actualizar el comentario en userComments
      this.userComments[gameName][index].content = newContent;

      // Actualizar el comentario en localStorage
      const opinionsKey = `opinions_${gameName}`;
      const opinions = JSON.parse(localStorage.getItem(opinionsKey));

      const opinionIndex = opinions.findIndex(
        (opinion) =>
          opinion.name === this.currentUser.name &&
          opinion.lastName === this.currentUser.lastName &&
          opinion.content === this.originalCommentContent
      );

      if (opinionIndex !== -1) {
        opinions[opinionIndex].content = newContent;
        localStorage.setItem(opinionsKey, JSON.stringify(opinions));
      }

      // Reiniciar estado de edición
      this.isEditingComment = false;
      this.editingCommentGame = null;
      this.editingCommentIndex = null;
      this.editedCommentContent = '';
      this.originalCommentContent = '';
    },
    cancelEditComment() {
      this.isEditingComment = false;
      this.editingCommentGame = null;
      this.editingCommentIndex = null;
      this.editedCommentContent = '';
      this.originalCommentContent = '';
    },
    deleteComment(gameName, index) {
      const comment = this.userComments[gameName][index];

      // Eliminar el comentario de localStorage
      const opinionsKey = `opinions_${gameName}`;
      const opinions = JSON.parse(localStorage.getItem(opinionsKey));

      const opinionIndex = opinions.findIndex(
        (opinion) =>
          opinion.name === this.currentUser.name &&
          opinion.lastName === this.currentUser.lastName &&
          opinion.content === comment.content
      );

      if (opinionIndex !== -1) {
        opinions.splice(opinionIndex, 1);
        localStorage.setItem(opinionsKey, JSON.stringify(opinions));
      }

      // Eliminar el comentario de userComments
      this.userComments[gameName].splice(index, 1);

      // Si ya no hay comentarios para el juego, actualizar la lista
      if (this.userComments[gameName].length === 0) {
        delete this.userComments[gameName];
        const gameIndex = this.userCommentedGames.indexOf(gameName);
        if (gameIndex !== -1) {
          this.userCommentedGames.splice(gameIndex, 1);
        }
        this.selectedCommentedGame = null;
      }
    },
  },
  watch: {
    // Guardar automáticamente cuando se editan las estadísticas
    gameAchievements: {
      handler() {
        if (this.selectedLikedGame) {
          this.saveGameData(this.selectedLikedGame);
        }
      },
      deep: true,
    },
    gameCompletion: {
      handler() {
        if (this.selectedLikedGame) {
          this.saveGameData(this.selectedLikedGame);
        }
      },
      deep: true,
    },
    gameRewards: {
      handler() {
        if (this.selectedLikedGame) {
          this.saveGameData(this.selectedLikedGame);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.loadUserData();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.admin-wrapper {
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

.admin-container {
  background: rgba(0, 0, 0, 0.85);
  padding: 40px 60px;
  border-radius: 15px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  max-width: 1200px;
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

.admin-container h1 {
  margin-bottom: 10px;
  font-size: 2.5em;
  color: #ffeb3b;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.admin-container h2 {
  margin-bottom: 30px;
  font-size: 1.8em;
  color: #ff9800;
  text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
}

.admin-content {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
  justify-content: center;
}

.likes-section,
.comments-section {
  flex: 1 1 300px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, background 0.3s;
}

.likes-section:hover,
.comments-section:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.likes-section h2,
.comments-section h2 {
  margin-bottom: 20px;
  font-size: 1.5em;
  color: #00e676;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.likes-section ul,
.comments-section ul {
  list-style-type: none;
  padding: 0;
}

.likes-section li,
.comments-section li {
  cursor: pointer;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s, transform 0.3s;
}

.likes-section li:hover,
.comments-section li:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.likes-section li.selected,
.comments-section li.selected {
  background-color: #ff5722;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.game-details,
.comments-details {
  flex: 2 1 400px;
  background: rgba(0, 0, 0, 0.7);
  padding: 25px 35px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transition: background 0.3s;
}

.game-details:hover,
.comments-details:hover {
  background: rgba(0, 0, 0, 0.75);
}

.game-details h3,
.comments-details h3 {
  margin-bottom: 20px;
  font-size: 1.8em;
  color: #03a9f4;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.coin-container {
  margin: 25px 0;
  max-width: 500px;
  text-align: center;
  background: rgba(255, 152, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: background 0.3s;
}

.coin-container:hover {
  background: rgba(255, 152, 0, 0.25);
}

.btn-add-coins {
  padding: 12px 25px;
  background-color: #ff9800;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.btn-add-coins:hover {
  background-color: #fb8c00;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-add-coins:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.progress-bar {
  height: 25px;
  border-radius: 12.5px;
  margin: 15px 0;
  transition: width 0.4s ease-in-out, background-color 0.3s;
}

.coin-count {
  margin-top: 10px;
  font-size: 1.3em;
  font-weight: bold;
  color: #fff176;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.max-credit {
  color: #f44336;
  font-weight: bold;
  margin-left: 10px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 25px;
  flex-wrap: wrap;
  gap: 20px;
}

.stat {
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid #00bcd4;
  border-radius: 10px;
  padding: 15px 25px;
  text-align: center;
  width: 150px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s, background-color 0.3s;
}

.stat:hover {
  transform: scale(1.05);
  background-color: rgba(0, 188, 212, 0.15);
}

.stat h3 {
  margin-bottom: 10px;
  font-size: 1.1em;
  color: #b2ebf2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.btn-edit-stats {
  margin-top: 25px;
  padding: 12px 30px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

.btn-edit-stats:hover {
  background-color: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.btn-edit-stats:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.edit-stats {
  margin-top: 25px;
  text-align: left;
}

.edit-stats div {
  margin-bottom: 15px;
}

.edit-stats label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

.edit-stats input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #00e5ff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;
  transition: border-color 0.3s, background 0.3s;
}

.edit-stats input:focus {
  outline: none;
  border-color: #00bcd4;
  background: rgba(255, 255, 255, 0.15);
}

.comments-section h2 {
  color: #cddc39;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.comments-details p {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background 0.3s;
}

.comments-details p:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-action {
  padding: 6px 15px;
  margin-right: 10px;
  background-color: #03a9f4;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s, transform 0.2s;
}

.btn-action:hover {
  background-color: #039be5;
  transform: scale(1.05);
}

.btn-delete {
  background-color: #f44336;
}

.btn-delete:hover {
  background-color: #e53935;
}

.edit-comment-form {
  margin-top: 25px;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: background 0.3s;
}

.edit-comment-form h4 {
  margin-bottom: 15px;
  color: #ffeb3b;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.edit-comment-form textarea {
  width: 100%;
  height: 120px;
  padding: 10px 15px;
  border: 2px solid #00e5ff;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;
  resize: vertical;
  transition: border-color 0.3s, background 0.3s;
}

.edit-comment-form textarea:focus {
  outline: none;
  border-color: #00bcd4;
  background: rgba(255, 255, 255, 0.15);
}

.comment-buttons {
  margin-top: 15px;
  text-align: right;
}

.btn-save,
.btn-cancel {
  padding: 8px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-save {
  background-color: #4caf50;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-save:hover {
  background-color: #43a047;
  transform: scale(1.05);
}

.btn-cancel {
  background-color: #f44336;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.btn-cancel:hover {
  background-color: #e53935;
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
  .admin-content {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .admin-container {
    padding: 30px 40px;
  }

  .admin-container h1 {
    font-size: 2em;
  }

  .admin-container h2 {
    font-size: 1.3em;
  }

  .btn-add-coins,
  .btn-edit-stats {
    width: 100%;
    padding: 10px 0;
  }

  .stats {
    flex-direction: column;
    align-items: center;
  }

  .stat {
    width: 80%;
  }
}
</style>
