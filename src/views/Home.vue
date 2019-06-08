<template>
  <view-wrapper>
    <user-info v-if='$store.state.user.isAuthed' slot='left'/>
    <timeline/>
    <bitter-info slot='right'/>
  </view-wrapper>
</template>

<script>
import ViewWrapper from '@/components/Base/ViewWrapper'

import Timeline from '@/components/Timeline/'
import BitterInfo from '@/components/Profile/BitterInfo'
import UserInfo from '@/components/Profile/UserInfo'

export default {
  components: {
    Timeline, BitterInfo, UserInfo, ViewWrapper
  }
}
</script>