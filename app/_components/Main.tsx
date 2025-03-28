"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { BusType } from "@/app/utils/enums";
import { WeddingData } from "@/app/utils/type";
import { ThemeToggle, Header, Footer } from "@/app/_components/common";
import { BackgroundMusic, Navigation } from "@/app/_components/mainComponents";

export const Main = ({ data }: { data: WeddingData }) => {
  const weddingData = data[0];

  const [activeSection, setActiveSection] = useState("hero");
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 각 섹션에 대한 intersection observer hook 설정
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.5 });
  const { ref: coupleRef, inView: coupleInView } = useInView({
    threshold: 0.5,
  });
  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.5,
  });
  const { ref: locationRef, inView: locationInView } = useInView({
    threshold: 0.5,
  });
  const { ref: messageRef, inView: messageInView } = useInView({
    threshold: 0.5,
  });

  // 현재 보이는 섹션 업데이트
  useEffect(() => {
    if (heroInView) setActiveSection("hero");
    else if (coupleInView) setActiveSection("couple");
    else if (galleryInView) setActiveSection("gallery");
    else if (locationInView) setActiveSection("location");
    else if (messageInView) setActiveSection("message");
  }, [heroInView, coupleInView, galleryInView, locationInView, messageInView]);

  // 성을 제외한 이름 추출 함수
  const getFirstName = (fullName: string | undefined): string => {
    // fullName이 undefined나 빈 문자열인 경우 빈 문자열 반환
    if (!fullName) return "";

    // 한국 이름의 경우 성은 보통 첫 글자
    return fullName.slice(1);
  };

  // 페이지 타이틀과 설명에 사용할 정보
  const brideFirstName = getFirstName(weddingData.woman);
  const groomFirstName = getFirstName(weddingData.man);

  const pageTitle = `${brideFirstName || ""} & ${groomFirstName || ""}의 결혼식에 초대합니다`;
  const pageDescription = `${weddingData?.day || ""}, ${brideFirstName || ""}와 ${groomFirstName || ""}의 결혼식에 초대합니다`;

  // 카운트다운 타이머 업데이트
  useEffect(() => {
    const weddingDate = new Date("2025-06-13T14:00:00");

    const updateCountdown = () => {
      const now = new Date();

      const diff = weddingDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setDays(String(days).padStart(2, "0"));
        setHours(String(hours).padStart(2, "0"));
        setMinutes(String(minutes).padStart(2, "0"));
        setSeconds(String(seconds).padStart(2, "0"));
      }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  const busData = weddingData?.bus?.[0] || { express: [], branch: [] };

  useEffect(() => {
    const data = async () => {
      const response = await fetch("http://localhost:5555/api/couple");
      const resData = await response.json();
      console.log("resData", resData);
    };
    data();
  }, []);

  return (
    <div className="font-serif transition-colors duration-300">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 헤더 */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="pt-[56px] max-w-[372px] mx-auto">
        {/* 메인 섹션 */}
        <section
          id="hero"
          ref={heroRef}
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16"
        >
          <div className="w-full aspect-square relative mb-8 overflow-hidden">
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="text-sm leading-relaxed text-center mb-8 text-wedding-text dark:text-wedding-darkText">
            {weddingData.mainMent
              .split(". ")
              .map((sentence: string, index: number) => (
                <p key={index}>
                  {sentence}
                  {index < weddingData.detailMent.split(". ").length - 1
                    ? "."
                    : ""}
                  <br />
                </p>
              ))}
          </div>

          <p className="text-lg font-medium text-wedding-text dark:text-wedding-darkText mb-2">
            {weddingData.day}
          </p>
          <p className="text-sm text-wedding-muted dark:text-wedding-darkMuted mb-8">
            {weddingData.weddingPlace}
          </p>

          <div className="flex justify-center space-x-6 mb-8">
            <div className="text-center">
              <div className="text-xl font-medium text-wedding-text dark:text-wedding-darkText">
                {days}
              </div>
              <div className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                일
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-wedding-text dark:text-wedding-darkText">
                {hours}
              </div>
              <div className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                시간
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-wedding-text dark:text-wedding-darkText">
                {minutes}
              </div>
              <div className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                분
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium text-wedding-text dark:text-wedding-darkText">
                {seconds}
              </div>
              <div className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                초
              </div>
            </div>
          </div>
        </section>

        {/* 신랑 & 신부 섹션 */}
        <section
          id="couple"
          ref={coupleRef}
          className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
        >
          <h2 className="text-lg font-light text-wedding-text dark:text-wedding-darkText mb-12">
            신랑 & 신부
          </h2>

          <div className="flex justify-between w-full mb-12">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-medium mb-1 text-wedding-text dark:text-wedding-darkText">
                {weddingData.man}
              </p>
              <p className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                {weddingData.manFather} · {weddingData.manMother}의{" "}
                {weddingData.manRank}
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <p className="text-sm font-medium mb-1 text-wedding-text dark:text-wedding-darkText">
                {weddingData.woman}
              </p>
              <p className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
                {weddingData.womanFather} · {weddingData.womanMother}의{" "}
                {weddingData.womanRank}
              </p>
            </div>
          </div>

          <div className="text-sm leading-relaxed text-center text-wedding-text dark:text-wedding-darkText">
            {weddingData.detailMent
              .split(". ")
              .map((sentence: string, index: number) => (
                <p key={`${index}_detail`}>
                  {sentence}
                  {index < weddingData.detailMent.split(". ").length - 1
                    ? "."
                    : ""}
                  <br />
                </p>
              ))}
          </div>
        </section>

        {/* 갤러리 섹션 */}
        <section
          id="gallery"
          ref={galleryRef}
          className="min-h-screen flex flex-col justify-center px-4 py-16 bg-wedding-light dark:bg-wedding-dark transition-colors duration-300"
        >
          <h2 className="text-lg font-light text-wedding-text dark:text-wedding-darkText mb-8">
            갤러리
          </h2>

          <div className="mb-8">
            <div className="relative aspect-[4/5] w-full mb-2 overflow-hidden">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            </div>
            <p className="text-sm font-light text-wedding-text dark:text-wedding-darkText">
              Inspiration of Nature
            </p>
            <p className="text-xs text-wedding-muted dark:text-wedding-darkMuted">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* 갤러리 그리드 아이템들 */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center"
              >
                <svg
                  className="w-8 h-8 text-gray-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
            ))}
          </div>
        </section>

        {/* 오시는 길 섹션 */}
        <section
          id="location"
          ref={locationRef}
          className="min-h-screen flex flex-col justify-center px-4 py-16 bg-white transition-colors duration-300"
        >
          <h2 className="text-lg font-light text-wedding-text dark:text-wedding-darkText mb-8">
            오시는 길
          </h2>

          <div className="w-full h-60 bg-gray-100 dark:bg-gray-800 mb-6 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <h3 className="text-sm font-medium text-wedding-text dark:text-wedding-darkText mb-1">
                주소
              </h3>
              <p className="text-sm text-wedding-muted dark:text-wedding-darkMuted">
                {weddingData.detailPlace}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-wedding-text dark:text-wedding-darkText mb-1">
                지하철
              </h3>
              <p className="text-sm text-wedding-muted dark:text-wedding-darkMuted">
                {weddingData.subway}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-wedding-text dark:text-wedding-darkText mb-1">
                버스
              </h3>

              <div className="text-sm text-wedding-muted dark:text-wedding-darkMuted">
                {Object.entries(BusType).map(([key, label]) => {
                  // 소문자로 변환된 버스 타입 키 (EXPRESS -> express)
                  const typeKey = key.toLowerCase();

                  // busData에 해당 타입의 배열이 존재하고 비어있지 않은 경우에만 표시
                  if (
                    busData?.[typeKey] &&
                    Array.isArray(busData[typeKey]) &&
                    busData[typeKey].length > 0
                  ) {
                    return (
                      <p key={key} className="mb-1">
                        {label}: {busData[typeKey].join(", ")}
                      </p>
                    );
                  }
                  return null;
                })}

                {/* 만약 표시할 버스 정보가 없는 경우 */}
                {!Object.entries(BusType).some(([key]) => {
                  const typeKey = key.toLowerCase();
                  return (
                    busData?.[typeKey] &&
                    Array.isArray(busData[typeKey]) &&
                    busData[typeKey].length > 0
                  );
                }) && <p>버스 정보가 없습니다.</p>}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-wedding-text dark:text-wedding-darkText mb-1">
                주차
              </h3>
              <p className="text-sm text-wedding-muted dark:text-wedding-darkMuted">
                {weddingData.parking}
              </p>
            </div>
          </div>
        </section>

        {/* 축하 메시지 섹션 */}
        <section
          id="message"
          ref={messageRef}
          className="min-h-screen flex flex-col justify-center px-4 py-16 bg-wedding-light dark:bg-wedding-dark transition-colors duration-300"
        >
          <h2 className="text-lg font-light text-wedding-text dark:text-wedding-darkText mb-8">
            축하 메시지
          </h2>

          <form className="w-full space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-wedding-text dark:text-wedding-darkText mb-1"
              >
                이름
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md
                         bg-white dark:bg-gray-800 text-wedding-text dark:text-wedding-darkText
                         focus:outline-none focus:ring-1 focus:ring-wedding-accent dark:focus:ring-wedding-darkAccent"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-wedding-text dark:text-wedding-darkText mb-1"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md
                         bg-white dark:bg-gray-800 text-wedding-text dark:text-wedding-darkText
                         focus:outline-none focus:ring-1 focus:ring-wedding-accent dark:focus:ring-wedding-darkAccent"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm text-wedding-text dark:text-wedding-darkText mb-1"
              >
                메시지
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md
                         bg-white dark:bg-gray-800 text-wedding-text dark:text-wedding-darkText
                         focus:outline-none focus:ring-1 focus:ring-wedding-accent dark:focus:ring-wedding-darkAccent"
                placeholder="축하 메시지를 남겨주세요"
              ></textarea>
            </div>

            <button
              type="button"
              className="w-full py-2 bg-wedding-accent dark:bg-wedding-darkAccent text-white
                      rounded-md hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
            >
              메시지 등록
            </button>
          </form>
        </section>
      </main>

      {/* 푸터 */}
      <Footer />

      {/*네비게이션 도트*/}
      <Navigation activeSection={activeSection} />

      {/*음악 플레이어*/}
      <BackgroundMusic />
    </div>
  );
};
