"use client";
import React, { useState, useEffect, useRef } from "react";

// 뮤직 플레이어 컴포넌트
export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 컴포넌트가 마운트된 후 실행
  useEffect(() => {
    // iOS 등 모바일 브라우저에서는 자동 재생 정책으로 인해
    // 사용자 인터랙션 없이 자동 재생이 불가능할 수 있음
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

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center bg-white bg-opacity-80 rounded-full px-3 py-2 shadow-md">
      <audio
        ref={audioRef}
        // src="/wedding-music.mp3" // 음악 파일 경로 (public 폴더 내 위치)
        loop // 반복 재생
        preload="auto"
      />
      <button
        onClick={togglePlay}
        className="flex items-center justify-center"
        aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
      >
        {isPlaying ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2 text-sm text-gray-600">일시정지</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2 text-sm text-gray-600">음악 재생</span>
          </>
        )}
      </button>
    </div>
  );
};
