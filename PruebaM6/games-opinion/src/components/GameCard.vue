<template>
  <div class="game-card">
    <img :src="game.background_image" alt="Game Image" class="game-image" />
    <div class="game-details">
      <h2 class="game-title">{{ game.name }}</h2>
      <p>Rating: {{ game.rating }}</p>
      <p>Released: {{ game.released }}</p>
      <p>Update: {{ game.updated }}</p>
      <div class="game-actions">
        <button @click="goToOpinions" class="btn-opinion">Opinar</button>
        <button class="btn-like">❤️</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToOpinions() {
      this.$router.push(`/opinions/${this.game.name}`);
    }
  }
};
</script>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
}

.game-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-details {
  padding: 15px;
  text-align: center;
}

.game-title {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.game-actions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-opinion {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-opinion:hover {
  background-color: #0056b3;
}

.btn-like {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
