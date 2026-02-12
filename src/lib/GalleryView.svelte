<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {musicService, type Music} from '../services/musicService';

    export let seed: number;
    export let language: string;
    export let likes: number;

    let songs: Music[] = [];
    let loading = false;
    let offset = 0;
    let hasMore = true;
    let containerElement: HTMLElement;

    async function loadInitial() {
        loading = true;
        offset = 0;
        songs = [];
        hasMore = true;

        try {
            const newSongs = await musicService.fetchSongs({
                seed,
                language,
                likes,
                offset: 0,
                count: 20
            });
            songs = newSongs;
            offset = 20;
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

    async function loadMore() {
        if (loading || !hasMore) return;

        loading = true;
        try {
            const newSongs = await musicService.fetchSongs({
                seed,
                language,
                likes,
                offset,
                count: 20
            });

            if (newSongs.length > 0) {
                songs = [...songs, ...newSongs];
                offset += 20;
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

    function handleScroll() {
        if (!containerElement) return;

        const {scrollTop, scrollHeight, clientHeight} = containerElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMore();
        }
    }

    $: seed, language, likes, loadInitial();

    onMount(() => {
        loadInitial();
    });
</script>

<div class="gallery-view" bind:this={containerElement} on:scroll={handleScroll}>
    <div class="gallery-grid">
        {#each songs as song}
            <div class="song-card">
                <div class="card-content">
                    <h3 class="card-title">{song.title}</h3>
                    <p class="card-composer">{song.composer}</p>
                    <p class="card-performer">{song.performer}</p>
                    <p class="card-likes">❤️ {song.likes}</p>
                </div>
                <audio controls src={musicService.createAudioUrl(song.audio)}>
                    Your browser does not support audio.
                </audio>
            </div>
        {/each}
    </div>

    {#if loading}
        <div class="loading-more">
            <p>Loading more...</p>
        </div>
    {/if}

    {#if !hasMore && songs.length > 0}
        <div class="end-message">
            <p>No more songs to load</p>
        </div>
    {/if}
</div>

<style>
    .gallery-view {
        height: calc(100vh - 72px);
        overflow: auto;
    }

    .gallery-grid {
        max-width: 1100px;
        margin: 20px auto;
        padding: 0 20px;
        display: grid;
        grid-template-columns:repeat(3, minmax(0, 1fr));
        gap: 16px
    }

    .song-card {
        border-radius: 14px;
        border: 1px solid rgba(0, 0, 0, .08);
        background: #fff;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px
    }

    .card-title {
        font-size: 18px;
        line-height: 1.1
    }

    .card-composer, .card-performer, .card-likes {
        font-size: 14px;
        opacity: .9
    }

    audio {
        width: 100%
    }

    .loading-more, .end-message {
        text-align: center;
        padding: 16px;
        opacity: .8
    }

    @media (max-width: 1000px) {
        .gallery-grid {
            grid-template-columns:repeat(2, minmax(0, 1fr))
        }
    }

    @media (max-width: 650px) {
        .gallery-grid {
            grid-template-columns:1fr
        }
    }
</style>
