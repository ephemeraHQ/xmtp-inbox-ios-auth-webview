import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSigner } from 'wagmi'
import useInitXmtpClient from './useXMTPClient'
import background from './images/background.png'

function demoMode() {
  const global = (window as any)

  global.webkit.messageHandlers.signer.postMessage({
    demoMode: 'true',
  })
}

function App() {
  const { initClient } = useInitXmtpClient()
  const { data: signer } = useSigner()
  return (
    <div id="app" style={{ textAlign: 'center' }}>
      <img src={background} style={{ objectFit: 'fill', width: '100vw' }} />
      <h1 style={{ margin: '12px 24px' }}>Your interoperable web3 inbox</h1>
      <p style={{ margin: "12px 24px" }}>You’re just a few steps away from secure, wallet-to-wallet messaging.</p>
      <ConnectButton accountStatus={'address'} showBalance={false} chainStatus={'none'} />
      <button className="reset-button" onClick={demoMode}>Try demo mode</button>
    </div>
  );
}

export default App;
