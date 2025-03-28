// "use client";
//
// import { use, useEffect, useState } from "react";
// import axios from "axios";
//
// export default function Home({
//   params,
// }: {
//   params: Promise<{ userId: string }>;
// }) {
//   const unwrappedParams = use(params);
//   const userId = unwrappedParams.userId;
//
//   const [coupleData, setCoupleData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get(
//           `http://localhost:5555/api/couple/${userId}`,
//         );
//         setCoupleData(response.data.couple);
//       } catch (error) {
//         console.error("데이터 조회 오류:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//
//     fetchData();
//   }, [userId]);
//
//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>에러: {error}</div>;
//   if (!coupleData) return <div>데이터가 없습니다</div>;
//
//   return <div>커플 정보: {JSON.stringify(coupleData)}</div>;
// }
