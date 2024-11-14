import { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?:number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex  === -1 ? 0 : get().currentIndex
        })
    },
    playAlbum: (songs: Song[], startIndex = 0) => {
        if(songs.length === 0) return;
        const song = songs[startIndex];
        const socket = useChatStore.getState().socket;
        if(socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })
        }
        set({queue: songs, currentSong: song, currentIndex: startIndex, isPlaying: true})
    },
    setCurrentSong: (song: Song | null) => {
        if(!song) return;
        const songIndex = get().queue.findIndex(item => item._id === song._id);
        const socket = useChatStore.getState().socket;
        if(socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${song.title} by ${song.artist}`
            })
        }
        set({currentSong: song, currentIndex: songIndex !== -1 ? songIndex : get().currentIndex, isPlaying: true})
    },
    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if(socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle"
            })
        }
        set({isPlaying: willStartPlaying});
    },
    playNext: () => {
        const {currentIndex, queue} = get();
        let nextIndex = currentIndex + 1;
        if(nextIndex === queue.length) {
            nextIndex = 0;
        }
        const nextSong = queue[nextIndex];
        const socket = useChatStore.getState().socket;
        if(socket.auth) {
            socket.emit("update_activity", {
                userId: socket.auth.userId,
                activity: `Playing ${nextSong.title} by ${nextSong.artist}`
            })
        }

        set({
            currentSong: nextSong,
            isPlaying: true,
            currentIndex: nextIndex
        })
    },
    playPrevious: ()=> {
        const {currentIndex, queue} = get();
        let nextIndex = currentIndex - 1;
         if(nextIndex < 0) {
            nextIndex = queue.length - 1;
         }
         const nextSong = queue[nextIndex];
         set({
            currentSong: nextSong,
            isPlaying: true,
            currentIndex: nextIndex
         })
    },
}))

