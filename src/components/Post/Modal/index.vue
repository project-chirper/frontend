<template>
	<div>
		<Base :post='post'/>
	</div>
</template>

<script>
import Base from './Base'

export default {
	props: {
		post: Object,
		replies: Array
	},
	components: {
		Base
	}
}
</script>
