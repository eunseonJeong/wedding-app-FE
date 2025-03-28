import React from "react";
import { BusData, BusType, formatBusByType } from "@/app/utils/enums";

interface BusInfoProps {
  busData?: BusData;
}

export const BusInfo: React.FC<BusInfoProps> = ({ busData }) => {
  // formatBusByType 함수를 사용하여 버스 데이터 변환
  const formattedBusData = formatBusByType(busData);

  // 버스 데이터가 없거나 모든 타입이 비어있는 경우
  const hasBusData = Object.values(formattedBusData).some(
    (busNumbers) => busNumbers && busNumbers.length > 0,
  );

  if (!hasBusData) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-800 mb-1">버스</h3>
      <div className="text-sm text-gray-600">
        {Object.entries(formattedBusData).map(([type, numbers]) => {
          // 해당 타입의 버스 번호가 있을 경우에만 렌더링
          if (numbers && numbers.length > 0) {
            return (
              <p key={type} className="mb-1">
                {type}: {numbers.join(", ")}
              </p>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// 더 발전된 버전 - 버스 정보를 카드 형태로 표시
export const BusInfoCard: React.FC<BusInfoProps> = ({ busData }) => {
  const formattedBusData = formatBusByType(busData);

  // 버스 데이터가 없거나 모든 타입이 비어있는 경우
  const hasBusData = Object.values(formattedBusData).some(
    (busNumbers) => busNumbers && busNumbers.length > 0,
  );

  if (!hasBusData) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-base font-medium text-gray-800 mb-3">버스 안내</h3>
      <div className="space-y-2">
        {Object.entries(formattedBusData).map(([type, numbers]) => {
          if (numbers && numbers.length > 0) {
            return (
              <div key={type} className="flex items-start">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">
                    {type}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-1">
                    {numbers.map((number) => (
                      <span
                        key={number}
                        className={`text-xs px-2 py-1 rounded-full ${
                          type === BusType.EXPRESS
                            ? "bg-blue-100 text-blue-700"
                            : type === BusType.BRANCH
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// 버스 데이터 추가 함수
export const addBusData = (
  busData: BusData | undefined,
  type: keyof BusData,
  numbers: string | string[],
): BusData => {
  // 기존 버스 데이터를 복사 (없으면 빈 객체)
  const newBusData: BusData = busData ? { ...busData } : {};

  // 새로운 타입의 버스 데이터 추가
  newBusData[type] = Array.isArray(numbers) ? numbers : [numbers];

  return newBusData;
};

// 사용 예시:
/*
// 마을버스 추가
import { addBusData, BusInfoCard } from '../components/BusInfo';

// 컴포넌트 내부에서
const [busData, setBusData] = useState(weddingData.bus);

// 마을버스 추가
const handleAddTownBus = () => {
  const updatedBusData = addBusData(busData, 'town', ['마을01', '마을02']);
  setBusData(updatedBusData);
};

// 공항버스 추가
const handleAddAirportBus = () => {
  const updatedBusData = addBusData(busData, 'airport', '6000');
  setBusData(updatedBusData);
};

// 렌더링 부분
<BusInfoCard busData={busData} />
<button onClick={handleAddTownBus}>마을버스 추가</button>
<button onClick={handleAddAirportBus}>공항버스 추가</button>
*/
