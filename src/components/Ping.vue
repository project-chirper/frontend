<template>
  <v-snackbar bottom
    v-model='$store.state.ping.show'
    :color='$store.state.ping.color'>

    {{ $store.state.ping.message }}

    <v-btn color='white' flat @click='$store.state.ping.show = false'>
      Close
    </v-btn>

  </v-snackbar>
</template>