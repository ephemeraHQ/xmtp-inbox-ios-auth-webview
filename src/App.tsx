import { ConnectButton } from '@rainbow-me/rainbowkit';

function demoMode() {
  window.location.href = "demo"
}

function App() {
  return (
    <div>
      <h1>Your interoperable web3 inbox</h1>
      <p>You’re just a few steps away from secure, wallet-to-wallet messaging.</p>
      <ConnectButton />
      <button onClick={demoMode}>Try demo mode</button>
    </div>
  );
}

export default App;
