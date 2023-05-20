import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Modeler from './Modeler';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Modeler />} />
      </Routes>
    </Router>
  );
}
