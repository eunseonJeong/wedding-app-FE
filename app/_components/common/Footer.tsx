export const Footer = () => {
  return (
    <footer className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-[372px] mx-auto px-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-light mb-2">Lullaby</h2>
            <p className="text-xs text-gray-500">Help Center →</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1 mb-6">
          <p>Lullaby, CEO: Jasmin, Business License: 000-00-00000</p>
          <p>Communication Sales Business Report: 0000-Seoul-0000</p>
          <p>Address: Seoul, Korea</p>
          <p>
            Help Center: +82 (0)0-000-0000 (AM10 - PM5, Lunch PM1 - PM2, Weekend
            and Holiday Off)
          </p>
          <p>All Photo by © Jasmin Chew on Unsplash view</p>
        </div>

        <div className="flex space-x-4 text-sm text-gray-600 mb-4">
          <a href="#" className="hover:text-gray-900">
            Instagram
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Tumblr
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Facebook
          </a>
        </div>

        <div className="flex space-x-4 text-xs text-gray-500">
          <a href="#" className="hover:text-gray-700">
            Terms of Use
          </a>
          <a href="#" className="hover:text-gray-700">
            Privacy
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-4">Hosting by fmweb</p>
      </div>
    </footer>
  );
};
