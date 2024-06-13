import { useState } from "react";
import Controller from "./components/Controller";
import Joybot from "./components/joybot";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  const [count, setCount] = useState(0);
  const handle = useFullScreenHandle();

  return (
    <div style={{ backgroundColor: "white" }}>
      <button onClick={handle.enter}>
        Enter fullscreen
      </button>

      <FullScreen handle={handle}>
        <div>
          <Joybot />
        </div>
      </FullScreen>
    </div>
  );
}

export default App;
