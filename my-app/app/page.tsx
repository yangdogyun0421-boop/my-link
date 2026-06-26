export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <main className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
        {/* Cover Image Area */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="relative px-6 pb-8">
          {/* Avatar Profile */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                YD
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className="mt-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">양도균</h1>
            
            <div className="mt-6 py-4 px-5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed shadow-inner">
              <p>안녕하세요 대학생 양도균입니다</p>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-3">
              <button className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
                연락하기
              </button>
              <button className="flex-1 py-2.5 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2">
                프로필 보기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
