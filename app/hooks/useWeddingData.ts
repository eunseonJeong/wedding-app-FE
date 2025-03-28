import { WeddingData } from "@/app/utils/type";

export const useWeddingData = (data: WeddingData[]) => {
  const weddingData = data[0];

  // 버스 데이터 처리
  const busData = weddingData?.bus?.[0] || { express: [], branch: [] };

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

  return {
    weddingData,
    busData,
    brideFirstName,
    groomFirstName,
    pageTitle,
    pageDescription,
  };
};
