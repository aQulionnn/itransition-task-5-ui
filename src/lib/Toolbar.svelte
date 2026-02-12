<script lang="ts">
    import {_, isLoading, locale } from 'svelte-i18n'
    import {onDestroy} from "svelte";
    import { get } from 'svelte/store'

    export let language = 'en-US';
    export let seed = 12345;
    export let likes = 3.5;
    export let viewMode = 'table';

    // const url = new URL(window.location.href)
    // const isRu = url.hostname.startsWith('ru.')
    //
    // url.hostname = isRu
    //     ? url.hostname.replace(/^ru\./, 'en.')
    //     : url.hostname.replace(/^en\./, 'ru.')

    function toggleLang() {
        const next = get(locale) === 'ru-RU' ? 'en-US' : 'ru-RU'
        localStorage.setItem('lang', next)
        locale.set(next)
    }

    function generateRandomSeed() {
        seed = Math.floor(Math.random() * 1_000_000_000);
    }

    let likesInput = likes
    let t: ReturnType<typeof setTimeout>

    $: {
        clearTimeout(t)
        t = setTimeout(() => likes = likesInput, 1000)
    }

    onDestroy(() => clearTimeout(t))
</script>

{#if !$isLoading}
    <header class="toolbar">
        <button on:click={toggleLang} class="toggle-btn">
            { $locale === 'ru-RU' ? 'English' : 'Русский' }
        </button>

        <div class="seed-group">
            <button on:click={generateRandomSeed} class="random-state-btn" title={$_('toolbar.randomSeed')}>
                🎲
            </button>
            <input
                type="number"
                bind:value={seed}
                placeholder={$_('toolbar.seed')}
                class="random-state"
                min="0"
                max="999999999"
            />
        </div>

        <div class="likes-group">
            <label for="likes">{$_('toolbar.likes')}: {likes.toFixed(1)}</label>
            <input
                id="likes"
                type="range"
                bind:value={likesInput}
                class="likes"
                min="0"
                max="1000"
                step="0.1"
            />
        </div>

        <div class="view-toggle">
            <button
                class:active={viewMode === 'table'}
                on:click={() => viewMode = 'table'}
            >
                📋 {$_('viewMode.table')}
            </button>
            <button
                class:active={viewMode === 'gallery'}
                on:click={() => viewMode = 'gallery'}
            >
                🎴 {$_('viewMode.gallery')}
            </button>
        </div>
    </header>
{/if}


<style>
    .toolbar {
        position: sticky;
        top: 0;
        z-index: 10;
        height: 72px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 20px;
        background: rgba(255, 255, 255, .9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, .08);
    }

    .toggle-btn {
        text-decoration: none;
        color: #111;
        font-size: 18px;
        background: none;
        border: none;

        cursor: pointer;
    }

    .seed-group, .likes-group, .view-toggle {
        display: flex;
        align-items: center;
        gap: 12px
    }

    .random-state-btn, .view-toggle button {
        height: 40px;
        padding: 0 14px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, .18);
        background: #fff;
        cursor: pointer
    }

    .view-toggle button.active {
        border-color: #111;
        box-shadow: 0 1px 0 rgba(0, 0, 0, .12)
    }

    .random-state {
        width: 240px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, .18);
        padding: 0 12px;
        font-size: 16px;
        outline: none
    }

    .likes {
        width: 220px
    }

    .likes-group label {
        min-width: 160px;
        white-space: nowrap;
        font-size: 16px
    }

    @media (max-width: 900px) {
        .toolbar {
            height: auto;
            flex-wrap: wrap;
            justify-content: center;
            padding: 12px
        }

        .likes-group label {
            min-width: auto
        }

        .random-state {
            width: 200px
        }
    }
</style>
