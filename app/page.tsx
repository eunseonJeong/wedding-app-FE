"use client";
import Head from "next/head";
import { Header } from "@/app/_components/common";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="font-serif transition-colors duration-300">
      <Head>
        <title>WeddingMoment</title>
        <meta
          name="description"
          content={"WeddingMoment는 모바일 청첩장입니다."}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 헤더 */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* 소개 문구 및 안내 */}
      <section className="text-sm text-gray-600 leading-relaxed px-2 mt-20 max-w-[372px] mx-auto">
        <p className="mb-2">
          <strong>WeddingMoment</strong>는 모바일로 나만의 청첩장을 만들고
          공유할 수 있는 서비스입니다.
        </p>
        <p className="mb-2">
          특별한 순간을 담은 사진, 따뜻한 문구, 오시는 길과 방명록까지 직접
          구성해보세요.
        </p>
        <p className="mb-4">
          링크 하나로 소중한 사람들과 간편하게 공유할 수 있어요.
        </p>

        <button className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
          지금 청첩장 만들기
        </button>
      </section>
    </div>
  );
}
