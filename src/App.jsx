import Navbar from "./Navbar";
import Popular from "./Popular";
import Story from "./Story";
import "./App.css";

const App = () => {
  return (
    <div className="header">
      <Navbar />
      {/* <Popular /> */}
      <Story />
    </div>
  );
};

export default App;
