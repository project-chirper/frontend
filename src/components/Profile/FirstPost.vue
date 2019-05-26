<template>
  <div class='text-xs-center'>
    <h1 class='display-1 font-weight-thin mb-2'>New to Bitter?</h1>
    <p>Click below to make your first ever post!</p>
    <publisher/>
  </div>
</template>

<script>
import Publisher from '@/components/Post/Publisher'

export default {
  components: { Publisher }
}
</script>
