import { useState } from "react";
import Controller from "./components/Controller";
import Joybot from "./components/joybot";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <>
        <Joybot />
      </>
    </div>
  );
}

export default App;
