"use client";

import { useState, FormEvent, ChangeEvent } from "react";

// 폼 데이터 타입 정의
interface FormData {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// 탭 타입 정의
type TabType = "login" | "register";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // 로그인 처리 로직
    console.log("로그인 시도:", {
      username: formData.username,
      password: formData.password,
    });

    try {
      // API 호출 예시 (실제 구현 시 적절한 엔드포인트로 변경 필요)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // 토큰 저장, 리다이렉트
        localStorage.setItem("token", data.token);
        window.location.href = "/couple";
      } else {
        // 로그인 실패 시 처리
        alert(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRegister = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 시도:", {
      name: formData.name,
      username: formData.username,
      password: formData.password,
    });

    try {
      // API 호출 예시 (실제 구현 시 적절한 엔드포인트로 변경 필요)
      const response = await fetch("http://localhost:5555/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공 시 처리
        alert(data.message || "회원가입이 완료되었습니다.");
        setActiveTab("login"); // 로그인 탭으로 전환
        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
        });
      } else {
        // 회원가입 실패 시 처리
        alert(data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full shadow-sm rounded-none p-8 max-w-[372px]">
        <div className="text-center border-b border-gray-100 pb-6 mb-8">
          <h1 className="text-3xl font-light tracking-wide mb-2">Lullaby</h1>
          <p className="text-gray-600 text-sm">
            소중한 결혼식 정보를 관리하세요
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-6">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${activeTab === "login" ? "border-b-2 border-gray-800 text-gray-900" : "text-gray-500 border-b-2 border-transparent"}`}
              onClick={() => handleTabChange("login")}
            >
              로그인
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${activeTab === "register" ? "border-b-2 border-gray-800 text-gray-900" : "text-gray-500 border-b-2 border-transparent"}`}
              onClick={() => handleTabChange("register")}
            >
              회원가입
            </button>
          </div>
        </div>

        {/* 로그인 폼 */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                아이디
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none mt-8"
              >
                로그인
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-5">
              계정이 없으신가요?{" "}
              <button
                type="button"
                className="text-gray-900 font-medium hover:underline"
                onClick={() => handleTabChange("register")}
              >
                회원가입하기
              </button>
            </div>
          </form>
        )}

        {/* 회원가입 폼 */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                아이디
              </label>
              <input
                id="reg-username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                비밀번호
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 focus:ring-gray-900 focus:border-gray-900 sm:text-sm outline-none"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none mt-8"
              >
                회원가입
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-5">
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                className="text-gray-900 font-medium hover:underline"
                onClick={() => handleTabChange("login")}
              >
                로그인하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
