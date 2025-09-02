import Header from "./components/header/Header";
import Generator from "./components/generator/Generator.jsx";
import Directives from "./components/directives/Directives.jsx";
import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <main>
      <Header />
      <Generator />
      <Directives />
      <Footer />
    </main>
  );
};

export default App;
