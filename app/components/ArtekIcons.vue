<template>
  <div class="inline-flex items-center justify-center shrink-0" :class="[sizeClass, colorClass]">
    <component :is="iconComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  AlertTriangleFilled,
  AmbulanceFilled,
  BloodDropFilled,
  CalendarFilled,
  CalendarOutline,
  CardiogramFilled,
  CardiologyFilled,
  DoctorFemaleFilled,
  DoctorFilled,
  DoctorOutline,
  GlobeFilled,
  GlobeOutline,
  HeartCardiogramFilled,
  HeartCardiogramOutline,
  HeartFilled,
  HeartOrganFilled,
  HeartOrganOutline,
  HeartOutline,
  HospitalFilled,
  HospitalOutline,
  InfoFilled,
  InfoOutline,
  LabSearchFilled,
  LabSearchOutline,
  MedicalRecordsFilled,
  MedicalRecordsOutline,
  StethoscopeFilled,
  StethoscopeOutline,
  UiMenuFilled,
  UiMenuOutline
} from '@criven/cricons';

const iconsMap = {
  AlertTriangleFilled,
  AmbulanceFilled,
  BloodDropFilled,
  CalendarFilled,
  CalendarOutline,
  CardiogramFilled,
  CardiologyFilled,
  DoctorFemaleFilled,
  DoctorFilled,
  DoctorOutline,
  GlobeFilled,
  GlobeOutline,
  HeartCardiogramFilled,
  HeartCardiogramOutline,
  HeartFilled,
  HeartOrganFilled,
  HeartOrganOutline,
  HeartOutline,
  HospitalFilled,
  HospitalOutline,
  InfoFilled,
  InfoOutline,
  LabSearchFilled,
  LabSearchOutline,
  MedicalRecordsFilled,
  MedicalRecordsOutline,
  StethoscopeFilled,
  StethoscopeOutline,
  UiMenuFilled,
  UiMenuOutline
} as const;

export type ArtekIconName = keyof typeof iconsMap;

const props = defineProps<{
  name: ArtekIconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'cyan' | 'teal' | 'emerald' | 'amber' | 'rose' | 'slate' | 'white';
}>();

const iconComponent = computed(() => iconsMap[props.name]);

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-10 h-10'
  };
  return sizes[props.size || 'md'];
});

const colorClass = computed(() => {
  if (!props.color) return '';
  const colors = {
    cyan: 'text-cyan-300',
    teal: 'text-clinical-teal',
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
    rose: 'text-rose-400',
    slate: 'text-slate-400',
    white: 'text-white'
  };
  return colors[props.color];
});
</script>

<style scoped>
:deep(svg) {
  width: 100% !important;
  height: 100% !important;
  fill: currentColor;
}
</style>
