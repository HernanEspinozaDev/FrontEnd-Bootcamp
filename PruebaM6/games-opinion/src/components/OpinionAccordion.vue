<template>
    <div>
      <h3>{{ opinion.author }}</h3>
      <p>{{ opinion.content }}</p>
      <button @click="editOpinion">Edit</button>
      <button @click="deleteOpinion">Delete</button>
    </div>
  </template>
  
  <script>
  export default {
    props: ['opinion'],
    methods: {
      editOpinion() {
        // Edit logic
      },
      deleteOpinion() {
        // Delete logic
      }
    }
  };
  </script>
  