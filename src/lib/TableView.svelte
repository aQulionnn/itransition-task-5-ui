<script lang="ts">
    import {_, isLoading} from 'svelte-i18n';
    import {musicService, type Music} from '../services/musicService';

    export let seed: number;
    export let language: string;
    export let likes: number;

    let songs: Music[] = [];
    let loading = false;
    let currentPage = 1;
    let pageSize = 20;
    let expandedIndex: number | null = null;

    async function loadPage(page: number) {
        loading = true;
        currentPage = page;
        try {
            songs = await musicService.fetchSongs({
                seed,
                language,
                likes,
                offset: (page - 1) * pageSize,
                count: pageSize
            });
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

    function toggleExpand(index: number) {
        expandedIndex = expandedIndex === index ? null : index;
    }

    $: seed, language, likes, loadPage(1);
</script>

{#if !$isLoading}
    <div class="table-view">
        {#if loading}
            <p class="loading">Loading...</p>
        {:else}
            <table>
                <thead>
                <tr>
                    <th>{$_('table.index')}</th>
                    <th>{$_('table.title')}</th>
                    <th>{$_('table.composer')}</th>
                    <th>{$_('table.performer')}</th>
                    <th>{$_('table.likes')}</th>
                </tr>
                </thead>
                <tbody>
                {#each songs as song, i}
                    <tr on:click={() => toggleExpand(i)} class:expanded={expandedIndex === i}>
                        <td>{song.index}</td>
                        <td>{song.title}</td>
                        <td>{song.composer}</td>
                        <td>{song.performer}</td>
                        <td>❤️ {song.likes}</td>
                    </tr>
                    {#if expandedIndex === i}
                        <tr class="details-row">
                            <td colspan="6">
                                <div class="details">
                                    <div class="cover">
                                        <div class="cover-placeholder">
                                            <h3>{song.title}</h3>
                                            <p>{song.composer}</p>
                                        </div>
                                    </div>
                                    <div class="player">
                                        <audio controls src={musicService.createAudioUrl(song.audio)}>
                                            Your browser does not support audio.
                                        </audio>
                                    </div>
                                    <div class="review">
                                        <p>A magnificent performance showcasing technical brilliance and emotional
                                            depth.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    {/if}
                {/each}
                </tbody>
            </table>

            <div class="pagination">
                <button on:click={() => loadPage(currentPage - 1)} disabled={currentPage === 1}>
                    ← Previous
                </button>
                <span>Page {currentPage}</span>
                <button on:click={() => loadPage(currentPage + 1)}>
                    Next →
                </button>
            </div>
        {/if}
    </div>
{/if}

<style>
    .table-view {
        max-width: 1100px;
        margin: 20px auto;
        padding: 0 20px
    }

    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, .08);
        border-radius: 14px;
        overflow: hidden
    }

    thead th {
        text-align: left;
        font-size: 14px;
        letter-spacing: .02em;
        padding: 14px 16px;
        background: rgba(0, 0, 0, .03);
        border-bottom: 1px solid rgba(0, 0, 0, .06)
    }

    tbody td {
        padding: 14px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, .06)
    }

    tbody tr {
        cursor: pointer
    }

    tbody tr:hover {
        background: rgba(0, 0, 0, .02)
    }

    tbody tr.expanded {
        background: rgba(0, 0, 0, .015)
    }

    .details-row td {
        padding: 0;
        border-bottom: none
    }

    .details {
        display: grid;
        grid-template-columns:240px 1fr 1fr;
        gap: 16px;
        padding: 16px;
        border-top: 1px solid rgba(0, 0, 0, .06)
    }

    .cover-placeholder {
        height: 160px;
        border-radius: 14px;
        border: 1px dashed rgba(0, 0, 0, .2);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
        text-align: center;
        background: rgba(0, 0, 0, .02)
    }

    .player audio {
        width: 100%
    }

    .review {
        border-radius: 14px;
        border: 1px solid rgba(0, 0, 0, .08);
        padding: 12px;
        background: rgba(0, 0, 0, .02)
    }

    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 16px
    }

    .pagination button {
        height: 40px;
        padding: 0 14px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, .18);
        background: #fff;
        cursor: pointer
    }

    .pagination button:disabled {
        opacity: .5;
        cursor: not-allowed
    }

    .loading {
        padding: 16px;
        text-align: center
    }

    @media (max-width: 900px) {
        .details {
            grid-template-columns:1fr;
        }
    }
</style>
