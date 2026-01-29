import Link from 'next/link'

export default function BannedPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                    <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>
                <p className="text-gray-600 mb-6">
                    Your account has been deactivated due to a violation of our terms of service or community guidelines.
                </p>
                <div className="text-sm text-gray-500">
                    If you believe this is an error, please contact support.
                </div>
                 {/* Optional: Add a logout button if they are stuck in a session */}
                  <form action="/auth/signout" method="post" className="mt-6">
                     <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Sign out
                     </button>
                  </form>
            </div>
        </div>
    )
}
