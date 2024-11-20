<template>
    <div>
      <button @click="addCoins" :disabled="coins >= 50">Add Coins</button>
      <div :style="{ background: barColor, width: `${coins * 2}px` }"></div>
      <p v-if="coins >= 50">Llegaste al máximo de tu crédito</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return { coins: 0 };
    },
    computed: {
      barColor() {
        if (this.coins <= 20) return 'green';
        if (this.coins <= 30) return 'yellow';
        return 'red';
      }
    },
    methods: {
      addCoins() {
        if (this.coins < 50) this.coins += 10;
      }
    }
  };
  </script>
  