import Menu from "./components/Menu";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">SWIIGO</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-red-400">Home</a>
            <a href="#" className="hover:text-red-400">Pages</a>
            <a href="#" className="hover:text-red-400">Shop</a>
            <a href="#" className="hover:text-red-400">Blogs</a>
            <a href="#" className="hover:text-red-400">Contact us</a>
          </nav>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full bg-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-gray-800">
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

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
          <div>
            <h3 className="text-xl font-bold mb-4">CONTACT US</h3>
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
            <h3 className="text-xl font-bold mb-4">OUR LINKS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-400">About Us</a></li>
              <li><a href="#" className="hover:text-red-400">FAQ</a></li>
              <li><a href="#" className="hover:text-red-400">Team</a></li>
              <li><a href="#" className="hover:text-red-400">Team Details</a></li>
              <li><a href="#" className="hover:text-red-400">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">OUR SERVICES</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-400">Awesome Team</a></li>
              <li><a href="#" className="hover:text-red-400">Table Service</a></li>
              <li><a href="#" className="hover:text-red-400">Order Team</a></li>
              <li><a href="#" className="hover:text-red-400">Quick Delivery</a></li>
              <li><a href="#" className="hover:text-red-400">Fresh Healthy Food</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">HELP CENTER</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-400">Service</a></li>
              <li><a href="#" className="hover:text-red-400">Service Detail</a></li>
              <li><a href="#" className="hover:text-red-400">Coming Soon</a></li>
              <li><a href="#" className="hover:text-red-400">Order Maintenance</a></li>
              <li><a href="#" className="hover:text-red-400">Error 404</a></li>
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
