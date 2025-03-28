import { Dispatch, SetStateAction } from "react";
import { ThemeToggle } from "@/app/_components/common/ThemeToggle";

interface Props {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ isMenuOpen, setIsMenuOpen }: Props) => {
  return (
    <header className="fixed top-0 w-full bg-white z-50">
      <div className="max-w-[372px] mx-auto flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h1 className="text-xl font-light">Lullaby</h1>
        <div className="flex items-center space-x-2">
          {/* 테마 토글 버튼 */}
          {/*<ThemeToggle />*/}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600"
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 메뉴 */}
      {isMenuOpen && (
        <div className="absolute top-[56px] left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
          <div className="max-w-[372px] mx-auto py-4 px-4">
            <nav>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#hero"
                    className="block py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    홈
                  </a>
                </li>
                <li>
                  <a
                    href="#couple"
                    className="block py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    신랑 & 신부
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="block py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    갤러리
                  </a>
                </li>
                <li>
                  <a
                    href="#location"
                    className="block py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    오시는 길
                  </a>
                </li>
                <li>
                  <a
                    href="#message"
                    className="block py-2 text-gray-700 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    축하 메시지
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
