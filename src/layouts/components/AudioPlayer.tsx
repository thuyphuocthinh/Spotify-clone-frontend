import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { playNext, currentSong, isPlaying } = usePlayerStore();

  // handle play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // handle song ends
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = (): void => {
      playNext();
    };
    audio?.addEventListener("ended", () => {
      handleEnded();
    });
    return () => {
      audio?.removeEventListener("ended", handleEnded);
    };
  }, [playNext]);

  // handle song changes
  useEffect(() => {
    if(!audioRef.current || !currentSong) return;
    const audio = audioRef.current;
    // check if this is actually a new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if(isSongChange) {
        audio.src = currentSong?.audioUrl;
        // reset the playback position
        audio.currentTime = 0;
        prevSongRef.current = currentSong?.audioUrl;
        if(isPlaying) audio.play();
    }
  }, [currentSong, isPlaying])

  return <audio ref={audioRef} />;
}
