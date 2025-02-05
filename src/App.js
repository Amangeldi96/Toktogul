import Menu from './components/Menu';
import Regstr from './components/Regstr';
import Home from './components/Home';
import Album from './components/Album';
import Genre from './components/Genre';

import Mirbek from './components/artist/mirbek';
import Freeman from './components/artist/freeman';
import Jax from './components/artist/jax';
import Aftok from './components/artist/aftok';
import Ulukmanapo from './components/artist/ulukmanapo';
import Nurlan from './components/artist/nurlan';
import Nurila from './components/artist/nurila';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Album" element={<Album />} />
        <Route path="/Genre" element={<Genre />} />
        <Route path="/Regstr" element={<Regstr />} />
				<Route path="/Mirbek" element={<Mirbek />} />
				<Route path="/Freeman" element={<Freeman />} />
				<Route path="/Jax" element={<Jax />} />
				<Route path="/Aftok" element={<Aftok />} />
				<Route path="/Ulukmanapo" element={<Ulukmanapo />} />
				<Route path="/Nurlan" element={<Nurlan />} />
				<Route path="/Nurila" element={<Nurila />} />
      </Routes>
			<Footer/>
    </div>

  );
}

export default App;