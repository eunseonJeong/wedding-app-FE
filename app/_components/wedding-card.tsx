"use client";

import { useEffect, useState } from "react";
import { ScreenMessage } from "@/app/_components/screen-message";
import { Loader2 } from "lucide-react";

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
  const [error, setError] = useState<boolean>(false);

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
        setError(true);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <ScreenMessage type="error" />;
  }

  if (!weddingData) {
    return <ScreenMessage type="loading" />;
  }

  return (
    <div className={"bg-amber-600"}>
      <h1>장소 : {weddingData.location.name}</h1>
      <h1>상세주소 : {weddingData.location.address} </h1>
    </div>
  );
};
