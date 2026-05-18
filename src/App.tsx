
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import HomePage from './pages/home/HomePage';
import FilmsPage from './pages/films/FilmsPage';
import FilmDetailPage from './pages/films/FilmDetailPage';
import PeoplePage from './pages/people/PeoplePage';
import PlanetsPage from './pages/planets/PlanetsPage';
import PeopleDetailPage from './pages/people/PeopleDetailPage';
import SpeciesDetailPage from './pages/species/SpeciesDetailPage';
import SpeciesPage from './pages/species/SpeciesPage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage';
import PlanetDetailPage from './pages/planets/PlanetDetailPage';
import StarshipsPage from './pages/starships/StarshipsPage';
import StarshipDetailPage from './pages/starships/StarshipDetailPage';



function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/films" element={<FilmsPage />} />
          <Route path="/films/:id" element={<FilmDetailPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:id" element={<PeopleDetailPage />} />
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="/planets/:id" element={<PlanetDetailPage />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/species/:id" element={<SpeciesDetailPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/starships" element={<StarshipsPage />} />
          <Route path="/starships/:id" element={<StarshipDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
