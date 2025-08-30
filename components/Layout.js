import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Layout({ children }) {
 const dispatch = useDispatch();

 return (
   <div className="min-h-screen bg-gray-100 flex">
     {/* Sidebar */}
     <aside className="w-64 bg-white shadow-md">
       <div className="p-4 text-2xl font-bold text-blue-600">💰 Expense Tracker</div>
       <nav className="mt-6">
         <Link href="/">
           <div className="px-6 py-3 hover:bg-blue-50 cursor-pointer">🏠 Dashboard</div>
         </Link>
         <Link href="/analytics">
           <div className="px-6 py-3 hover:bg-blue-50 cursor-pointer">📊 Analytics</div>
         </Link>
         <button
           onClick={() => dispatch(logout())}
           className="w-full text-left px-6 py-3 hover:bg-red-50 text-red-600"
         >
           🚪 Logout
         </button>
       </nav>
     </aside>

     {/* Main Content */}
     <main className="flex-1 p-6">{children}</main>
   </div>
 );
}