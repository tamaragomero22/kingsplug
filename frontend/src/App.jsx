import { Routes, Route } from 'react-router-dom';
import { Home } from './Home.jsx';
import Register from './Register.jsx';

function App() {
    return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;