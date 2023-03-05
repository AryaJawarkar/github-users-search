import React from 'react';
import { Dashboard,Error } from './pages';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
<Routes>
   <Route path='/github-users-search' element={<Dashboard />} />
   <Route path='*'  element={<Error />} />
</Routes>
    </Router>
  );
}

export default App;
