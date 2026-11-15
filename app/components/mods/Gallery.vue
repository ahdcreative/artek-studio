<script setup lang="ts">
const props = defineProps<{
  images: string[];
  alt: string;
}>();

const { t } = useLocale();

const activeImage = ref<string | null>(props.images[0] ?? null);

watch(
  () => props.images,
  (next) => {
    if (!activeImage.value || !next.includes(activeImage.value)) {
      activeImage.value = next[0] ?? null;
    }
  }
);
</script>

<template>
  <div class="space-y-4">
    <div class="overflow-hidden rounded-3xl border border-clinical-border bg-clinical-surface">
      <img
        v-if="activeImage"
        :src="activeImage"
        :alt="alt"
        class="aspect-16/10 w-full object-cover"
      />
      <div
        v-else
        class="flex aspect-16/10 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-clinical-elevated to-clinical-canvas"
      >
        <ArtekIcons name="StethoscopeOutline" size="xl" color="cyan" class="opacity-45" />
        <span class="font-mono text-xs text-slate-500">
          {{ t('Preview showcase coming soon', 'Immagine showcase in arrivo') }}
        </span>
      </div>
    </div>

    <div v-if="images.length > 1" class="grid grid-cols-4 gap-3">
      <button
        v-for="img in images"
        :key="img"
        type="button"
        class="overflow-hidden rounded-xl border transition"
        :class="
          activeImage === img
            ? 'border-cyan-400 ring-2 ring-cyan-500/35'
            : 'border-clinical-border opacity-70 hover:opacity-100'
        "
        @click="activeImage = img"
      >
        <img :src="img" :alt="alt" class="aspect-16/10 w-full object-cover" />
      </button>
    </div>
  </div>
</template>
