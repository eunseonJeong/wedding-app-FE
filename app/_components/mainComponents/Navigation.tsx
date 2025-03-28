interface Props {
  activeSection: string;
}

export const Navigation = ({ activeSection }: Props) => {
  return (
    <div className="fixed right-4 bottom-8 z-40">
      <div className="flex flex-col space-y-2">
        <a
          href="#hero"
          className={`w-2 h-2 rounded-full ${activeSection === "hero" ? "bg-gray-600" : "bg-gray-300"}`}
          aria-label="메인 섹션으로 이동"
        ></a>
        <a
          href="#couple"
          className={`w-2 h-2 rounded-full ${activeSection === "couple" ? "bg-gray-600" : "bg-gray-300"}`}
          aria-label="신랑 & 신부 섹션으로 이동"
        ></a>
        <a
          href="#gallery"
          className={`w-2 h-2 rounded-full ${activeSection === "gallery" ? "bg-gray-600" : "bg-gray-300"}`}
          aria-label="갤러리 섹션으로 이동"
        ></a>
        <a
          href="#location"
          className={`w-2 h-2 rounded-full ${activeSection === "location" ? "bg-gray-600" : "bg-gray-300"}`}
          aria-label="오시는 길 섹션으로 이동"
        ></a>
        <a
          href="#message"
          className={`w-2 h-2 rounded-full ${activeSection === "message" ? "bg-gray-600" : "bg-gray-300"}`}
          aria-label="축하 메시지 섹션으로 이동"
        ></a>
      </div>
    </div>
  );
};
