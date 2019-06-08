<template>
  <view-wrapper>

    <v-layout column wrap slot='left' :align-end='$vuetify.breakpoint.lgAndUp' class='pr-3 mr-3 mb-3' style='border-right:2px solid #FF2667'>
      <div v-for='nav in navList' :key='nav.route'>
        <v-flex>
          <v-btn router :to='nav.route' flat class='ma-0'>
            <v-icon left>{{ nav.icon }}</v-icon>
            {{ nav.name }}
          </v-btn>
        </v-flex>
        <v-divider></v-divider>
      </div>

    </v-layout>

    <v-fade-transition mode='out-in'>
      <router-view/>
    </v-fade-transition>
    
  </view-wrapper>
</template>

<script>
import ViewWrapper from '@/components/Base/ViewWrapper'

export default {
  components: { ViewWrapper },
  data() {
    return {
      navList: [
        { name: 'Details', icon: 'person', route: 'details' },
        { name: 'Display Info', icon: 'public', route: 'display-info' }
      ]
    }
  }
}
</script>