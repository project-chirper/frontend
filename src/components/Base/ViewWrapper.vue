<template>
  <v-container class="px-3 mt-1" :class='{ "mt-5": $vuetify.breakpoint.mdAndUp }' grid-list-xl>
    <v-layout row wrap justify-center>

      <v-flex xs12 md10 lg3>
        <slot name="left"></slot>
      </v-flex>

      <v-flex xs12 md10 lg6 xl4>
        <slot></slot>
      </v-flex>

      <v-flex xs12 md10 lg3>
        <slot name="right"></slot>
      </v-flex>

    </v-layout>
  </v-container>
</template>
