import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import {create} from "zustand";

interface MusicStore {
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: null | string;
    currentAlbum: null | Album;
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    featuredSongs: Song[];

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (albumId: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    currentAlbum: null,
    isLoading: false,
    error: null,
    madeForYouSongs: [],
    trendingSongs: [],
    featuredSongs: [],

    fetchAlbums: async () => {
        set({isLoading: true})
        try {
            const response = await axiosInstance.get("/albums/all");
            set({albums: response.data.data})
        } catch (error: any) {
            set({error: error.response?.data?.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchAlbumById: async(albumId: string) => {
        set({isLoading: true})
        try {
            const response = await axiosInstance.get(`/albums/${albumId}`);
            set({currentAlbum: response.data.data})
        } catch (error: any) {
            set({error: error.response?.data?.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchFeaturedSongs: async() => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.get("/songs/featured");
            set({featuredSongs: response.data.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false, error: null})
        }
    },

    fetchMadeForYouSongs: async () => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.get("/songs/made-for-you");
            set({madeForYouSongs: response.data.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false, error: null})
        }
    },

    fetchTrendingSongs: async () => {
        set({isLoading: true});
        try {
            const response = await axiosInstance.get("/songs/trending");
            set({trendingSongs: response.data.data})
        } catch (error: any) {
            set({error: error.response.data.message})
        } finally {
            set({isLoading: false, error: null})
        }
    }
}))