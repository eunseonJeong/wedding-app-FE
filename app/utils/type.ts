import { BusData, ChildRankValue } from "@/app/utils/enums";

export interface WeddingData {
  woman: string;
  womanFather?: string;
  womanMother?: string;
  womanRank?: ChildRankValue;

  man: string;
  manFather?: string;
  manMother?: string;
  manRank?: ChildRankValue;

  mainMent?: string;
  detailMent?: string;

  day?: string;
  weddingPlace?: string;
  detailPlace?: string;
  subway?: string;
  bus?: BusData;
  parking?: string;

  image?: string[];
}
