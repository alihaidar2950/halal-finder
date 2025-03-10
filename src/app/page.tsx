import Menu from "./components/Menu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-black text-white p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">Halal Finder</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="hover:text-orange-400">Home</Link>
            <Link href="#" className="hover:text-orange-400">Pages</Link>
            <Link href="#" className="hover:text-orange-400">Shop</Link>
            <Link href="#" className="hover:text-orange-400">Blogs</Link>
            <Link href="#" className="hover:text-orange-400">Contact us</Link>
          </nav>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main>
        <Menu />
      </main>

      <footer className="bg-black text-gray-300 py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">CONTACT US</h3>
            <address className="not-italic">
              <p className="flex items-center mb-2">
                <span className="mr-2">📍</span> H-97, Plot No. 13A, Colony, Maharashtra, Hyderabad
              </p>
              <p className="flex items-center mb-2">
                <span className="mr-2">📞</span> +91 987-654-3210
              </p>
              <p className="flex items-center mb-2">
                <span className="mr-2">📞</span> +91 123-456-7890
              </p>
              <p className="flex items-center mb-2">
                <span className="mr-2">✉️</span> info@example.com
              </p>
            </address>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">OUR LINKS</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-400">About Us</Link></li>
              <li><Link href="#" className="hover:text-orange-400">FAQ</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Team</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Team Details</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Testimonials</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">OUR SERVICES</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-400">Awesome Team</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Table Service</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Order Team</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Quick Delivery</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Fresh Healthy Food</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">HELP CENTER</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-orange-400">Service</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Service Detail</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Coming Soon</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Order Maintenance</Link></li>
              <li><Link href="#" className="hover:text-orange-400">Error 404</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="container mx-auto mt-8 pt-8 border-t border-gray-800 px-4">
          <p className="text-center">© 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
