<template>
  <div class="game-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="image-container">
      <img :src="game.background_image" alt="Game Image" class="game-image" />
      <div class="like-animation" v-if="animateLike">
        ❤️
      </div>
    </div>
    <div class="game-details">
      <h2 class="game-title">{{ game.name }}</h2>
      <p>Rating: {{ game.rating }}</p>
      <p>Released: {{ game.released }}</p>
      <div class="buttons">
        <button @click="goToOpinions" class="btn-opinion">
          Opinar
        </button>
        <button @click="toggleLike" class="btn-like">
          <span v-if="isLiked">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLiked: false,
      hover: false,
      animateLike: false,
    };
  },
  methods: {
    goToOpinions() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Por favor, inicia sesión para opinar");
        this.$router.push('/login');
        return;
      }

      // Redirigir a la vista de opiniones específica del juego
      this.$router.push({ name: 'Opinions', params: { gameName: this.game.name } });
    },
    toggleLike() {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Por favor, inicia sesión para dar 'Me gusta'");
        this.$router.push('/login');
        return;
      }

      const likes = JSON.parse(localStorage.getItem("likes")) || [];
      const likeIndex = likes.findIndex(
        (like) =>
          like.game === this.game.name &&
          like.user.name === currentUser.name &&
          like.user.lastName === currentUser.lastName
      );

      if (likeIndex === -1) {
        likes.push({ game: this.game.name, user: currentUser });
        this.isLiked = true;
        this.triggerLikeAnimation();
      } else {
        likes.splice(likeIndex, 1);
        this.isLiked = false;
      }

      localStorage.setItem("likes", JSON.stringify(likes));
    },
    triggerLikeAnimation() {
      this.animateLike = true;
      setTimeout(() => {
        this.animateLike = false;
      }, 800); // Duración de la animación
    },
  },
  mounted() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const likes = JSON.parse(localStorage.getItem("likes")) || [];
      this.isLiked = likes.some(
        (like) =>
          like.game === this.game.name &&
          like.user.name === currentUser.name &&
          like.user.lastName === currentUser.lastName
      );
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.game-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: 100%;
  max-width: 300px;
  transition: transform 0.3s, box-shadow 0.3s;
  font-family: 'Roboto', sans-serif;
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
}

.image-container {
  position: relative;
  overflow: hidden;
}

.game-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.game-card:hover .game-image {
  transform: scale(1.05);
}

.like-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3em;
  color: #ff0000;
  animation: pop 0.8s ease-out;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

.game-details {
  padding: 15px;
  text-align: center;
  color: #ffffff;
}

.game-title {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ffeb3b;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
}

.game-details p {
  margin: 5px 0;
  font-size: 1em;
  color: #cccccc;
}

.buttons {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.btn-opinion {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s, transform 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-opinion:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.btn-like {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-like:hover {
  transform: scale(1.2);
}

.btn-like span {
  transition: color 0.3s;
}

.btn-like span:hover {
  color: #ff0000;
}

/* Responsividad */
@media (max-width: 600px) {
  .game-card {
    max-width: 100%;
  }

  .game-image {
    height: 180px;
  }

  .game-title {
    font-size: 1.3em;
  }

  .btn-opinion {
    padding: 6px 12px;
    font-size: 0.8em;
  }

  .btn-like {
    font-size: 1.2em;
  }
}
</style>
