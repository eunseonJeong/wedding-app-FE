"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ChildRank,
  ChildRankValue,
  BusType,
  BusData,
  BusTypeKey,
} from "@/app/utils/enums";
import { Header } from "@/app/_components/common";
import axios from "axios";
import { router } from "next/client";
import { useRouter } from "next/navigation";

interface Person {
  name: string;
  father: string;
  mother: string;
  rank: ChildRankValue;
}

interface FormImage {
  file: File | null;
  preview: string;
  isMain: boolean;
}

interface CoupleFormData {
  man: Person;
  woman: Person;
  mainMent: string;
  detailMent: string;
  day: string;
  weddingPlace: string;
  detailPlace: string;
  subway: string;
  bus: BusData;
  parking: string;
  images: FormImage[];
}

const defaultValues = {
  man: {
    name: "",
    father: "",
    mother: "",
    rank: ChildRank.FIRST_SON,
  },
  woman: {
    name: "",
    father: "",
    mother: "",
    rank: ChildRank.FIRST_DAUGHTER,
  },
  mainMent: "",
  detailMent: "",
  day: "",
  weddingPlace: "",
  detailPlace: "",
  subway: "",
  bus: {
    express: [],
    branch: [],
    circular: [],
    airport: [],
    town: [],
    night: [],
  },
  parking: "",
  images: [],
};
const CoupleInfoForm = ({ coupleInfo }: any) => {
  const router = useRouter();
  const [formData, setFormData] = useState(defaultValues);

  // coupleInfo가 변경될 때 formData 업데이트
  useEffect(() => {
    if (coupleInfo) {
      setFormData(coupleInfo); // coupleInfo 값으로 formData 업데이트
    }
  }, [coupleInfo]); // coupleInfo가 변경될 때마다 실행

  const [loading, setLoading] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 사용자 ID 가져오기
  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");

    if (!token) {
      return router.push("/auth");
    } else {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        setUserId(tokenData.id);
      } catch (error) {
        console.error("토큰 디코딩 오류:", error);
      }
    }
  }, []);

  // 입력 필드 변경 처리
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section: keyof CoupleFormData | null,
    field: string,
  ) => {
    const { value } = e.target;

    if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof CoupleFormData],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  // 버스 정보 변경 처리
  const handleBusChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    type: keyof BusData,
  ) => {
    const { value } = e.target;
    const busNumbers = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);

    setFormData({
      ...formData,
      bus: {
        ...formData.bus,
        [type]: busNumbers,
      },
    });
  };

  // 이미지 업로드 처리
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // 현재 이미지 수 + 새로 추가될 이미지 수가 20을 초과하는지 확인
    const totalImagesCount = formData.images.length + files.length;
    if (totalImagesCount > 20) {
      toast.error("이미지는 최대 20장까지만 업로드 가능합니다.");
      return;
    }

    const newImages: FormImage[] = [...formData.images];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push({
            file,
            preview: event.target.result as string,
            isMain: newImages.length === 0, // 첫 번째 이미지를 메인으로 설정
          });

          setFormData({
            ...formData,
            images: newImages,
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 메인 이미지 설정
  const setMainImage = (index: number) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));

    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    const filteredImages = formData.images.filter((_, i) => i !== index);
    // 메인 이미지가 삭제되었다면 첫 번째 이미지를 메인으로 설정
    if (formData.images[index].isMain && filteredImages.length > 0) {
      filteredImages[0].isMain = true;
    }

    setFormData({
      ...formData,
      images: filteredImages,
    });
  };

  // 폼 제출 처리 함수
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // 사용자 ID가 없는 경우
    if (!userId) {
      toast.error("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    // 필수 필드 검증
    if (
      !formData.man.name ||
      !formData.woman.name ||
      !formData.day ||
      !formData.weddingPlace ||
      !formData.detailPlace
    ) {
      toast.error("필수 항목을 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      // 이미지를 FormData로 변환하여 전송
      const formDataToSend = new FormData();

      // JSON 데이터 추가 - 서버 코드와 일치하도록 'data' 필드에 JSON 문자열로 추가
      const jsonData = { ...formData };
      delete jsonData.images; // 이미지는 별도 처리
      formDataToSend.append("data", JSON.stringify(jsonData));

      // 이미지 파일 추가
      formData.images.forEach((img, index) => {
        if (img.file) {
          formDataToSend.append("images", img.file);

          // 메인 이미지 여부 설정
          formDataToSend.append(`image-${index}-isMain`, img.isMain.toString());
        }
      });

      // 인증 토큰 가져오기
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/couple/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast.success("신랑신부 정보가 성공적으로 등록되었습니다.");
      }
    } catch (error) {
      console.error("등록 오류:", error);
      toast.error("서버 연결 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-serif transition-colors duration-300">
      {/* 헤더 */}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <div className="max-w-[372px] mx-auto p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          신랑신부 정보 등록
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 신랑 정보 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              신랑 정보
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.man.name}
                  onChange={(e) => handleChange(e, "man", "name")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  자녀 순위
                </label>
                <select
                  value={formData.man.rank}
                  onChange={(e) => handleChange(e, "man", "rank")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.entries(ChildRank)
                    .filter(([key]) => key.includes("SON"))
                    .map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  아버지 이름
                </label>
                <input
                  type="text"
                  value={formData.man.father}
                  onChange={(e) => handleChange(e, "man", "father")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  어머니 이름
                </label>
                <input
                  type="text"
                  value={formData.man.mother}
                  onChange={(e) => handleChange(e, "man", "mother")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 신부 정보 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              신부 정보
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.woman.name}
                  onChange={(e) => handleChange(e, "woman", "name")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  자녀 순위
                </label>
                <select
                  value={formData.woman.rank}
                  onChange={(e) => handleChange(e, "woman", "rank")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                >
                  {Object.entries(ChildRank)
                    .filter(([key]) => key.includes("DAUGHTER"))
                    .map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  아버지 이름
                </label>
                <input
                  type="text"
                  value={formData.woman.father}
                  onChange={(e) => handleChange(e, "woman", "father")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  어머니 이름
                </label>
                <input
                  type="text"
                  value={formData.woman.mother}
                  onChange={(e) => handleChange(e, "woman", "mother")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 갤러리 이미지 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              갤러리 이미지
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  이미지 업로드 (최대 20장, 남은 수:{" "}
                  {20 - formData.images.length}장)
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md"
                  disabled={formData.images.length >= 20}
                />
                {formData.images.length >= 20 && (
                  <p className="mt-1 text-xs text-red-500">
                    이미지 최대 개수(20장)에 도달했습니다.
                  </p>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    업로드된 이미지
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className={`relative rounded-md overflow-hidden border-2 ${img.isMain ? "border-indigo-500" : "border-gray-200 dark:border-gray-700"}`}
                      >
                        <img
                          src={img.preview}
                          alt={`업로드 이미지 ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-white space-y-1">
                          <button
                            type="button"
                            onClick={() => setMainImage(index)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded w-full"
                            disabled={img.isMain}
                          >
                            {img.isMain ? "메인 이미지" : "메인으로 설정"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded w-full"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 결혼식 정보 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              결혼식 정보
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  날짜 및 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.day}
                  onChange={(e) => handleChange(e, null, "day")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  결혼식장 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.weddingPlace}
                    onChange={(e) => handleChange(e, null, "weddingPlace")}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder="장소 입력"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPlaceSearch(!showPlaceSearch)}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    검색
                  </button>
                </div>

                {showPlaceSearch && (
                  <div className="mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md">
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                        placeholder="장소 검색..."
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                      >
                        찾기
                      </button>
                    </div>
                    <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                      지도 API가 여기에 표시됩니다
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  상세 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.detailPlace}
                  onChange={(e) => handleChange(e, null, "detailPlace")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="상세 주소 입력"
                  required
                />
              </div>
            </div>
          </div>

          {/* 오시는 길 정보 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              오시는 길
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  지하철
                </label>
                <textarea
                  value={formData.subway}
                  onChange={(e) => handleChange(e, null, "subway")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="지하철 노선 및 출구 입력"
                  rows={2}
                />
              </div>

              {/* 모든 버스 타입에 대한 입력 필드 */}
              {Object.entries(BusType).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} (쉼표로 구분)
                  </label>
                  <textarea
                    value={
                      formData.bus[key.toLowerCase() as keyof BusData]?.join(
                        ", ",
                      ) || ""
                    }
                    onChange={(e) =>
                      handleBusChange(e, key.toLowerCase() as keyof BusData)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    placeholder={`버스 번호 입력`}
                    rows={2}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  주차
                </label>
                <textarea
                  value={formData.parking}
                  onChange={(e) => handleChange(e, null, "parking")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="예: 호텔 내 지하주차장 이용 가능 (3시간 무료)"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 초대글 */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-4">
              초대글
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  메인 문구
                </label>
                <textarea
                  value={formData.mainMent}
                  onChange={(e) => handleChange(e, null, "mainMent")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="메인 문구 입력"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  부가 문구
                </label>
                <textarea
                  value={formData.detailMent}
                  onChange={(e) => handleChange(e, null, "detailMent")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  placeholder="부가 문구 입력"
                />
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-slate-800 hover:bg-slate-800/80 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "등록 중..." : "정보 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoupleInfoForm;
