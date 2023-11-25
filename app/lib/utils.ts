export function formatRoute(route: string) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000/${route}`;
  }

  return `https://cryp-text.vercel.app/${route}`;
}

export function arrayBufferToString(arrayBuffer: ArrayBuffer) {
  let binary: string = "";

  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  const base64String = window.btoa(binary);

  return base64String;
}

export function arrayBufferFromString(message: string) {
  const binaryString = window.atob(message);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}
