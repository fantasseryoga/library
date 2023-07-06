import 'materialize-css'
import { useRoutes } from './router';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {
  const routes = useRoutes()
  
  return (
    <Router>
      {routes}
    </Router>
  );
}

export default App;
