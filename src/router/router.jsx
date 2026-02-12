import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AdminLayout } from '../components/AdminLayout';

// Normal imports (no lazy)
import { Home } from '../pages/Home';
import { Movies } from '../pages/Movies';
import { TVSeries } from '../pages/TVSeries';
import { Actors } from '../pages/Actors';
import { MovieDetail } from '../pages/MovieDetail';
import { TVDetail } from '../pages/TVDetail';
import { ActorProfile } from '../pages/ActorProfile';
import { Search } from '../pages/Search';
import { Login } from '../pages/Login';
import { Profile } from '../pages/Profile';
import { Watchlist } from '../pages/Watchlist';

import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminMovies } from '../pages/admin/AdminMovies';
import { AdminTVSeries } from '../pages/admin/AdminTVseries';
import { AdminReviews } from '../pages/admin/AdminReviews';
import { AdminActors } from '../pages/admin/AdminActors';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/movies" element={<PublicLayout><Movies /></PublicLayout>} />
        <Route path="/tv" element={<PublicLayout><TVSeries /></PublicLayout>} />
        <Route path="/actors" element={<PublicLayout><Actors /></PublicLayout>} />
        <Route path="/movie/:id" element={<PublicLayout><MovieDetail /></PublicLayout>} />
        <Route path="/tv/:id" element={<PublicLayout><TVDetail /></PublicLayout>} />
        <Route path="/actor/:id" element={<PublicLayout><ActorProfile /></PublicLayout>} />
        <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
        <Route path="/watchlist" element={<PublicLayout><Watchlist /></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="tvseries" element={<AdminTVSeries />} />
          <Route path="actors" element={<AdminActors />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
