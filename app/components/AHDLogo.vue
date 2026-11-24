<script setup lang="ts">
import { AGENCY_LINK_REL, buildReferralUrl } from '~/utils/referral';

const { t } = useLocale();

const agencyUrl = buildReferralUrl(
    'https://ahd-creative.agency',
    'footer_agency',
    'ahd-logo'
);
</script>

<template>
  <a
      :href="agencyUrl"
      target="_blank"
      :rel="AGENCY_LINK_REL"
      class="group inline-flex items-center gap-3 rounded-2xl border border-[#84cc16]/30 bg-clinical-canvas/75 px-4 py-2.5 transition-colors hover:border-[#84cc16]/65 hover:bg-clinical-canvas"
  >
    <div
        class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#84cc16]/25 bg-[#84cc16]/10 shadow-lg transition-transform duration-200 group-hover:scale-105"
    >
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="h-6 w-6 text-[#84cc16] drop-shadow-sm"
      >
        <path
            d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z"
        />
      </svg>
    </div>

    <div class="flex flex-col justify-center text-left">
      <span class="mb-1 block text-base font-bold leading-none tracking-tight text-white">
        AHD<span class="text-[#84cc16]">.</span>Creative
      </span>
      <span
          class="block text-[10px] font-semibold uppercase leading-none tracking-widest text-white/60"
      >
        {{ t('Web, Design & AI since 2005', 'Web, Design & AI dal 2005') }}
      </span>
    </div>
  </a>
</template>