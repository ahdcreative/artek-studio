<script setup lang="ts">
import type { Database, StudioProject } from '~/types/database.types';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const { t } = useLocale();

const { data: settings, refresh: refreshSettings } = useStudioSettings();

const activeTab = ref<'projects' | 'news' | 'settings'>('projects');
const allProjects = ref<StudioProject[]>([]);
const loadingProjects = ref(false);

const email = ref('');
const password = ref('');
const authLoading = ref(false);
const authError = ref('');

const initialEditSlug = computed(() =>
  typeof route.query.edit === 'string' ? route.query.edit : ''
);

async function loadAllProjects() {
  if (!user.value) return;
  loadingProjects.value = true;
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  loadingProjects.value = false;
  allProjects.value = data ?? [];
}

watch(
  user,
  (u) => {
    if (u) loadAllProjects();
  },
  { immediate: true }
);

async function handleSignIn() {
  authError.value = '';
  authLoading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value
  });
  authLoading.value = false;
  if (error) {
    authError.value = error.message;
    return;
  }
  await loadAllProjects();
}

async function handleSignOut() {
  await supabase.auth.signOut();
  allProjects.value = [];
}

async function refreshAll() {
  await Promise.all([loadAllProjects(), refreshSettings(), refreshNuxtData('studio-projects'), refreshNuxtData('studio-posts')]);
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Unauthenticated Login Gate -->
    <div
      v-if="!user"
      class="mx-auto max-w-md rounded-3xl border border-clinical-border bg-clinical-surface/95 p-8 shadow-[0_20px_50px_rgba(2,6,23,0.6)]"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/35 bg-cyan-500/15"
        >
          <ArtekIcons name="DoctorOutline" size="lg" color="cyan" />
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-white">ArtekMedical Admin</h1>
          <p class="text-xs text-slate-400">
            {{ t('Sign in with your Supabase studio account', 'Accedi con il tuo account Supabase Studio') }}
          </p>
        </div>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="handleSignIn">
        <label class="block space-y-1">
          <span class="text-xs font-semibold text-slate-300">Email</span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="luca@art3k.org"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <label class="block space-y-1">
          <span class="text-xs font-semibold text-slate-300">Password</span>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-clinical-border bg-clinical-canvas px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </label>

        <p v-if="authError" class="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
          {{ authError }}
        </p>

        <button
          type="submit"
          :disabled="authLoading"
          class="w-full rounded-xl bg-clinical-teal px-4 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] transition hover:bg-cyan-500 disabled:opacity-50"
        >
          {{ authLoading ? t('Signing in...', 'Accesso in corso...') : t('Sign In', 'Accedi') }}
        </button>
      </form>

      <div class="mt-6 border-t border-clinical-border/70 pt-4 text-center">
        <NuxtLink to="/" class="text-xs font-medium text-cyan-300 hover:text-cyan-200">
          ← {{ t('Back to Public Studio', 'Torna al Sito Pubblico') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Authenticated Console -->
    <div v-else class="space-y-8">
      <div
        class="flex flex-col justify-between gap-4 border-b border-clinical-border/80 pb-6 sm:flex-row sm:items-center"
      >
        <div>
          <div class="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
            <ArtekIcons name="DoctorOutline" size="sm" color="cyan" />
            <span>ArtekMedical Control Console</span>
          </div>
          <h1 class="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
            {{ t('Mini Studio Admin', 'Mini Interfaccia Admin') }}
          </h1>
          <p class="mt-1 text-xs text-slate-400">
            {{ t('Signed in as', 'Connesso come') }} <strong class="text-slate-200">{{ user?.email || 'Admin' }}</strong>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            class="rounded-xl border border-clinical-border bg-clinical-surface px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:text-cyan-200"
            @click="refreshAll"
          >
            {{ t('Refresh Data', 'Aggiorna Dati') }}
          </button>

          <button
            type="button"
            class="rounded-xl border border-rose-500/35 bg-rose-500/15 px-3.5 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/25"
            @click="handleSignOut"
          >
            {{ t('Sign Out', 'Esci') }}
          </button>
        </div>
      </div>

      <!-- Admin Tabs -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tab in [
            { id: 'projects', label: t('Mod Links & Status', 'Link Mod & Stato') },
            { id: 'news', label: t('Site News', 'News del Sito') },
            { id: 'settings', label: t('Studio Settings', 'Impostazioni Studio') }
          ]"
          :key="tab.id"
          type="button"
          class="rounded-xl px-4 py-2 text-xs font-bold transition"
          :class="
            activeTab === tab.id
              ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/40'
              : 'border border-clinical-border bg-clinical-surface text-slate-400 hover:text-white'
          "
          @click="activeTab = tab.id as any"
        >
          {{ tab.label }}
        </button>
      </div>

      <AdminProjectsTab
        v-if="activeTab === 'projects'"
        :projects="allProjects"
        :initial-search="initialEditSlug"
        @updated="refreshAll"
      />

      <AdminNewsTab
        v-else-if="activeTab === 'news'"
        :projects="allProjects"
        @updated="refreshAll"
      />

      <AdminSettingsTab
        v-else
        :settings="settings ?? null"
        @updated="refreshAll"
      />
    </div>
  </div>
</template>
