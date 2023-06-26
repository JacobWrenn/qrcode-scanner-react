import { useState } from "react";
import Scanner from "./components/Scanner";

function App() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");

  function scanSuccess(result: string) {
    setScanning(false);
    setResult(result);
  }

  function startScan() {
    setResult("");
    setScanning(true);
  }

  return (
    <div>
      {scanning ? (
        <>
          <button onClick={() => setScanning(false)}>Stop Scanning</button>
          <Scanner scanning={scanning} scanSuccess={scanSuccess} />
        </>
      ) : (
        <button onClick={startScan}>Start Scanning</button>
      )}
      <p>Result: {result}</p>
    </div>
  );
}

export default App;
