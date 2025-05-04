import { BusData, ChildRankValue } from "@/app/utils/enums";

export interface PersonInfo {
  name: string;
  father?: string;
  mother?: string;
  rank?: ChildRankValue;
}

export interface WeddingData {
  woman: PersonInfo;
  man: PersonInfo;

  mainMent?: string;
  detailMent?: string;

  day?: string;
  weddingPlace?: string;
  detailPlace?: string;
  subway?: string;
  bus?: BusData;
  parking?: string;

  images?: string[];
}
