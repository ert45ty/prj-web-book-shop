import AppProvider from "./context/AppProvider";
import RoutesApp from "./route/RoutesApp";

const App = () => {
  return (
    <AppProvider>
      <RoutesApp />
    </AppProvider>
  );
};

export default App;
