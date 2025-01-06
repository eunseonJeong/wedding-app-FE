"use client";

import { useEffect, useState } from "react";

type LocationType = {
  lat: number;
  lng: number;
  name: string;
  address: string;
  link: string;
  waytocome: {
    metro: string[];
    bus: string[];
  };
};

type WeddingDataType = {
  id: number;
  date: string;
  location: LocationType;
};

export const WeddingCard = () => {
  const [weddingData, setWeddingData] = useState<WeddingDataType | null>(null);
  console.log("wedding>", weddingData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/wedding");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWeddingData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!weddingData) {
    return <h1>Loading...</h1>; // 데이터가 로드되지 않았을 때
  }

  return (
    <>
      <h1>장소 : {weddingData.location.name}</h1>
      <h1>상세주소 : {weddingData.location.address} </h1>
    </>
  );
};
