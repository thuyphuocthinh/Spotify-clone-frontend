import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
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
    stats: Stats;

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (albumId: string) => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (songId: string) => Promise<void>;
    deleteAlbum: (albumId: string) => Promise<void>;
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
    stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

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

    fetchSongs: async () => {
        set({isLoading: true, error: null})
        try {
            const response = await axiosInstance.get("/songs");
            set({songs: response.data.data})
        } catch (error: any) {
            set({error: error.response?.data?.message})
        } finally {
            set({isLoading: false})
        }
    },

    fetchStats: async () => {
        set({isLoading: true, error: null})
        try {
            const response = await axiosInstance.get("/stats");
            set({stats: response.data.data})
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
    },

    deleteSong: async (songId: string) => {
        try {
            set({isLoading: true, error: null})
            const response = await axiosInstance.delete(`/admin/songs/${songId}`)
            set(state => ({
                songs: state.songs.filter(song => song._id !== songId)
            }))
            toast.success(response.data.message);
        } catch (error: any) {
            set({error: error.response.data.message});
            toast.error(error.response.data.message);
        } finally {
            set({isLoading: false})
        }
    },

    deleteAlbum: async (albumId: string) => {
        try {
            set({isLoading: true, error: null})
            const response = await axiosInstance.delete(`/admin/albums/${albumId}`)
            set(state => ({
                albums: state.albums.filter(album => album._id !== albumId),
                songs: state.songs.map(song => (
                    song.albumId === state.albums.find(item => item._id === albumId)?.title ? {...song, albumId: null} : song
                ))
            }))
            toast.success(response.data.message);
        } catch (error: any) {
            set({error: error.response.data.message});
            toast.error(error.response.data.message);
        } finally {
            set({isLoading: false})
        }
    }
}))