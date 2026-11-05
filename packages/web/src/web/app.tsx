import { Route, Switch } from "wouter";
import Index from "./pages/index";
import PromocionesPage from "./pages/promociones";
import GestionPromocionesPage from "./pages/gestion-promociones";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/promociones" component={PromocionesPage} />
        {/* Hidden admin page for promotions: not linked anywhere */}
        <Route path="/gestion-promociones" component={GestionPromocionesPage} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
