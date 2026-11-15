<template>
  <div class="clinical-grid-bg flex min-h-screen flex-col">
    <StudioHeader />
    <main class="flex-1">
      <slot />
    </main>
    <StudioFooter />
  </div>
</template>
