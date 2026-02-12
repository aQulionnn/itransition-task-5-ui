import axios from 'axios';
import { get } from 'svelte/store';
import { locale } from 'svelte-i18n'

export type Music = {
    index: number;
    title: string;
    composer: string;
    performer: string;
    likes: number;
    audio: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const musicService = {
    async fetchSongs(params: {
        seed: number;
        language: string;
        likes: number;
        offset?: number;
        count?: number;
    }): Promise<Music[]> {
        try {
            const response = await axios.get<Music[]>(`${API_BASE_URL}/generate`, {
                params: {
                    seed: params.seed,
                    offset: params.offset ?? 0,
                    count: params.count ?? 20,
                    likesAvg: params.likes
                },
                headers: {
                    'Accept-Language': get(locale),
                },
            });

            return response.data;
        } catch (error) {
            console.error('Failed to fetch songs:', error);
            throw error;
        }
    },

    base64ToBlob(base64: string): Blob {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return new Blob([bytes], { type: 'audio/mpeg' });
    },

    createAudioUrl(base64Audio: string): string {
        const blob = this.base64ToBlob(base64Audio);
        return URL.createObjectURL(blob);
    },

    revokeAudioUrl(url: string): void {
        URL.revokeObjectURL(url);
    }
};