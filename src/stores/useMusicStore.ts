import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import {create} from "zustand";

interface MusicStore {
    songs: Song[];
    albums: Album[];
    isLoading: boolean;
    error: null | string;

    fetchAlbums: () => Promise<void>
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isLoading: false,
    error: null,

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
    }
}))