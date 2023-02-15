import { BytesLike } from 'ethers';
import * as secp from '@noble/secp256k1'
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { utils } from 'ethers'

const bytesToHex = secp.utils.bytesToHex

function hexToBytes(s: string): Uint8Array {
  if (s.startsWith('0x')) {
    s = s.slice(2)
  }
  const bytes = new Uint8Array(s.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    const j = i * 2
    bytes[i] = Number.parseInt(s.slice(j, j + 2), 16)
  }
  return bytes
}

type SignerRequest = {
  nonce: string,
  content: string
}

const useInitXmtpClient = () => {
  const { data: signer } = useSigner();
  const [isRequestPending, setIsRequestPending] = useState(false);

  const initClient = async () => {
    if (signer) {
      try {
        const address = await signer.getAddress();

        const global = (window as any)
        global.signer = signer
        global.sign = function (request: SignerRequest) {
          const content = Buffer.from(request.content, 'base64')

          signer.signMessage(content).then(function (sigString) {
            const eSig = utils.splitSignature(sigString)
            const r = hexToBytes(eSig.r)
            const s = hexToBytes(eSig.s)
            let sigBytes = new Uint8Array(65)
            sigBytes.set(r)
            sigBytes.set(s, r.length)
            sigBytes[64] = eSig.recoveryParam

            global.webkit.messageHandlers.signer.postMessage({
              nonce: request.nonce,
              signature: Buffer.from(sigBytes).toString('base64')
            })
          })
        }

        global.webkit.messageHandlers.signer.postMessage({
          state: 'ready',
          address: address
        })
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (!isRequestPending) {
      signer && initClient();
    }
  }, [signer]);

  return {
    initClient
  };
};

export default useInitXmtpClient;
