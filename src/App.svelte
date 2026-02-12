<script lang="ts">
    import Toolbar from './lib/Toolbar.svelte';
    import TableView from './lib/TableView.svelte';
    import GalleryView from './lib/GalleryView.svelte';

    let viewMode = 'table';
    let seed = 42;
    let likes = 500;
    let language = 'en-US';
</script>

<Toolbar bind:viewMode bind:seed bind:likes bind:language />

{#if viewMode === 'table'}
    <TableView {seed} {language} {likes} />
{:else}
    <GalleryView {seed} {language} {likes} />
{/if}