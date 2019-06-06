<template>
  <v-layout row wrap justify-center class='mt-5'>
    <v-flex xs12 md6 lg4 class='text-xs-center'>
      <h1 class='primary--text' :class='{ "display-4": $vuetify.breakpoint.mdAndUp, "display-2": $vuetify.breakpoint.smAndDown }'>
        404
        <v-icon left :x-large='$vuetify.breakpoint.mdAndUp' color='primary' :class='{ "mb-5": $vuetify.breakpoint.mdAndUp, "mb-3": $vuetify.breakpoint.smAndDown }'>thumb_down</v-icon>
      </h1>
      <p class='mt-2 font-weight-light' :class='{ "title": $vuetify.breakpoint.mdAndUp }'>Uh oh, we couldn't find the page you were looking for.</p>

      <v-alert type='warning' :value='true' color='primary' class='mt-5'>
        You may be seeing this page if we could not find the requested post or user, or if we have a screw loose on our website (we are still in development!).
      </v-alert>



    </v-flex>
  </v-layout>
</template>