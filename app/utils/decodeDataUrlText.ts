export async function decodeDataUrlText(dataUrl: string): Promise<string> {
  if (!/^data:/i.test(dataUrl)) {
    throw new TypeError('Expected a data URL');
  }

  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Unable to decode data URL (HTTP ${response.status})`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const charsetMatch = /(?:^|;)\s*charset\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i.exec(
    contentType
  );
  const charset = charsetMatch?.[1] ?? charsetMatch?.[2] ?? charsetMatch?.[3] ?? 'utf-8';

  return new TextDecoder(charset).decode(await response.arrayBuffer());
}
