
import './App.css'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <MemoryRouter>
        <Routes>
            <Route path='/' element={<Home />} />
        </Routes>
    </MemoryRouter>
);
}

export default App
