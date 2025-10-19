import { Routes, Route } from 'react-router-dom';
import { Home } from './Home.jsx';
import Register from './Register.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
    return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;