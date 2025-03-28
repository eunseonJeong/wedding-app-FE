import { useEffect, useRef, useState } from "react";

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 컴포넌트가 마운트된 후 실행
  useEffect(() => {
    // 오디오 초기화
    const initializeAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3; // 볼륨 설정 (0.0 ~ 1.0)
        setIsInitialized(true);
      }
    };

    initializeAudio();

    // 사용자 인터랙션 이벤트 감지
    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying && isInitialized) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("음악 자동 재생 실패:", error);
          });
      }
    };

    // 사용자 인터랙션 이벤트 리스너 등록
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      // 이벤트 리스너 정리
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [isInitialized, isPlaying]);

  // 재생/일시정지 토글 핸들러
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("음악 재생 실패:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return { audioRef, isPlaying, togglePlay };
};
