# 🍽️ Halal Finder

A modern web application built with Next.js that helps users discover and explore halal restaurants in their area.

![image](https://github.com/user-attachments/assets/d007ab2c-fcef-4ad7-a97a-1b38fa6af069)



## ✨ Features

- **Nearby Halal Restaurants**: Find halal dining options close to your location
- **Custom Halal Classification System**: Restaurants are classified into different halal status categories:
  - **Fully Halal**: Restaurants that are completely halal, typically with halal certification
  - **Halal Options**: Restaurants that offer some halal dishes but may also serve non-halal items
  - **Halal Ingredients**: Establishments that use halal ingredients or can accommodate halal requirements
- **Restaurant Details**: View comprehensive information about each restaurant including:
  - Photos, reviews, and ratings
  - Contact information and opening hours
  - Detailed halal status with confidence rating
- **Search & Filtering**: Search for restaurants by name, filter by cuisine type, and sort by distance
- **Location-Based Results**: View restaurants within customizable distance radius
- **Interactive Maps**: Visualize restaurant locations on an integrated Google Map
- **Cuisine Categories**: Browse restaurants by cuisine type
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**:
  - [Next.js 14](https://nextjs.org/) with App Router
  - [React 18](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Shadcn UI](https://ui.shadcn.com/) for UI components
  - [Lucide React](https://lucide.dev/) for icons

- **APIs & Services**:
  - [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) for restaurant data
  - [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) for maps integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Google Maps API Key

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/halal-finder.git
   cd halal-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Google Maps API key:
   ```
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌟 Custom Halal Classification System

Our application features a sophisticated algorithm that analyzes restaurant data to determine halal status:

1. **Text Analysis**: Examines restaurant names, descriptions, reviews, and cuisine types
2. **Keyword Matching**: Searches for halal-related keywords and phrases
3. **Confidence Scoring**: Provides a confidence rating for each classification
4. **Visual Indicators**: Color-coded badges make it easy to identify halal status at a glance

## 📱 Application Structure

- **Homepage**: Features hero section, search bar, and curated cuisine categories
- **Nearby Page**: Shows halal restaurants near the user's location with distance filtering
- **Restaurant Detail Page**: Comprehensive view of restaurant information and halal status
- **Cuisine Pages**: Browse restaurants by specific cuisine types
- **Search Page**: Search for restaurants with advanced filtering options

## 🔄 API Routes

- `/api/restaurants`: Fetch nearby halal restaurants with location parameters
- `/api/restaurants/[id]`: Get detailed information about a specific restaurant

## 🔜 Future Enhancements

- User authentication and personalized experiences
- Restaurant owner verification and halal certification uploads
- User reviews and community verification of halal status
- Advanced filtering (price range, rating, etc.)
- Online reservation system
- Mobile app version

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Google Maps Platform for location and restaurant data
- Next.js team for the amazing framework
- All contributors to the open-source libraries used in this project
