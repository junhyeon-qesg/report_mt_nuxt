<script setup lang="ts">
defineOptions({ name: 'NotFound' });
</script>

<template>
  <div class="not-found" style="padding: 48px; text-align: center;">
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지가 존재하지 않습니다.</p>
    <nuxt-link to="/dashboard">대시보드로 이동</nuxt-link>
  </div>
</template>
