"use client";

import { useEffect, useState } from "react";
import CoupleInfoForm from "@/app/_components/couple/CoupleInfoForm";
import { useRouter } from "next/navigation";
import axios from "axios";

const CoupleInfoPage = () => {
  const [coupleInfo, setCoupleInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ 먼저 userId 설정
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      setUserId(tokenData.id);
    } catch (error) {
      console.error("토큰 디코딩 오류:", error);
    }
  }, [router]);

  // ✅ userId가 설정된 후에만 API 요청 실행
  useEffect(() => {
    if (!userId) return; // userId가 설정되지 않으면 실행 안 함

    const fetchCoupleInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/couple/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setCoupleInfo(response.data.couple);
      } catch (error) {
        console.error("커플 정보 조회 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupleInfo();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;

  return <CoupleInfoForm coupleInfo={coupleInfo} />;
};
export default CoupleInfoPage;
