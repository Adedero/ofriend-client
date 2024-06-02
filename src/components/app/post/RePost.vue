<script setup>

</script>

<template>
  <div>
    <Panel toggleable>
      <template #header>
        <div class="flex align-items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" size="large" shape="circle" />
          <span class="font-bold">Amy Elsner</span>
        </div>
      </template>

      <template #footer>
        <div class="text-xs cs:text-sm">
          <div class="flex items-center gap-2 cs:justify-end">
            <p>2.5k Likes</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>1.2k Comments</p>
            <span class="pi pi-circle-fill" style="font-size: 0.25rem"></span>
            <p>10 Reposts</p>
          </div>
        </div>
      </template>

      <template #icons>
        <Button size="small" label="View post" icon="pi pi-eye" severity="secondary" class="hidden mr-3 cs:inline-flex" />
      </template>

      <p class="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </Panel>
  </div>
</template>