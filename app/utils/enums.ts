// 자녀 순위에 대한 이넘 정의
export const ChildRank = {
  FIRST_SON: "장남",
  SECOND_SON: "차남",
  THIRD_SON: "삼남",
  FOURTH_SON: "사남",
  ONLY_SON: "외동아들",
  FIRST_DAUGHTER: "장녀",
  SECOND_DAUGHTER: "차녀",
  THIRD_DAUGHTER: "삼녀",
  FOURTH_DAUGHTER: "사녀",
  ONLY_DAUGHTER: "외동딸",
} as const;

// ChildRank의 값들의 타입
export type ChildRankValue = (typeof ChildRank)[keyof typeof ChildRank];

// ChildRank의 키들의 타입
export type ChildRankKey = keyof typeof ChildRank;

// 이넘 키를 찾는 함수
export function getChildRankKey(
  value: string | undefined | null,
): ChildRankKey | null {
  if (!value) return null;
  const key = Object.keys(ChildRank).find(
    (key) => ChildRank[key as ChildRankKey] === value,
  ) as ChildRankKey | undefined;
  return key || null;
}

// 버스 타입 이넘
export const BusType = {
  EXPRESS: "간선버스",
  BRANCH: "지선버스",
  CIRCULAR: "순환버스",
  AIRPORT: "공항버스",
  TOWN: "마을버스",
  NIGHT: "심야버스",
} as const;

// BusType의 값들의 타입
export type BusTypeValue = (typeof BusType)[keyof typeof BusType];

// BusType의 키들의 타입
export type BusTypeKey = keyof typeof BusType;

// 버스 데이터 인터페이스
export interface BusData {
  express?: string[];
  branch?: string[];
  circular?: string[];
  airport?: string[];
  town?: string[];
  night?: string[];
  [key: string]: string[] | undefined;
}

// 버스 타입 값으로부터 키를 찾는 함수
export function getBusTypeKey(
  value: string | undefined | null,
): BusTypeKey | null {
  if (!value) return null;
  const key = Object.keys(BusType).find(
    (key) => BusType[key as BusTypeKey] === value,
  ) as BusTypeKey | undefined;
  return key || null;
}

// 버스 타입으로 버스 번호를 그룹화하는 함수
export function formatBusByType(
  busData: BusData | undefined,
): Record<string, string[]> {
  if (!busData) return {};

  return {
    [BusType.EXPRESS]: busData.express || [],
    [BusType.BRANCH]: busData.branch || [],
    [BusType.CIRCULAR]: busData.circular || [],
    [BusType.AIRPORT]: busData.airport || [],
    [BusType.TOWN]: busData.town || [],
    [BusType.NIGHT]: busData.night || [],
  };
}
