import { useState } from "react";
import Scanner from "./components/Scanner";

function App() {
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      {scanning ? (
        <>
          <button onClick={() => setScanning(false)}>Stop Scanning</button>
          <Scanner scanning={scanning} />
        </>
      ) : (
        <button onClick={() => setScanning(true)}>Start Scanning</button>
      )}
    </div>
  );
}

export default App;
