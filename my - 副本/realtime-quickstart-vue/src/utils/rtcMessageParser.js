const decoder = new TextDecoder();

const isPrintableAscii = (code) => code >= 32 && code <= 126;

export const getRTCMessageByteLength = (buffer) => {
  if (buffer instanceof ArrayBuffer) {
    return buffer.byteLength;
  }

  if (ArrayBuffer.isView(buffer)) {
    return buffer.byteLength;
  }

  return 0;
};

const toArrayBuffer = (buffer) => {
  if (buffer instanceof ArrayBuffer) {
    return buffer;
  }

  if (ArrayBuffer.isView(buffer)) {
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  }

  return null;
};

const decodeText = (buffer) => {
  const arrayBuffer = toArrayBuffer(buffer);
  return arrayBuffer ? decoder.decode(arrayBuffer) : '';
};

const tryParseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const withType = (data, type) => {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return {
      type,
      ...data,
    };
  }

  if (typeof data === 'string' && data.trim()) {
    return {
      type,
      text: data,
      definite: true,
      userId: 'AI',
    };
  }

  return null;
};

const withDebugMeta = (data, meta) => {
  if (data && typeof data === 'object') {
    Object.defineProperty(data, '__rtcMeta', {
      value: meta,
      enumerable: false,
      configurable: true,
    });
  }

  return data;
};

const parseTlvMessage = (buffer) => {
  const arrayBuffer = toArrayBuffer(buffer);
  if (!arrayBuffer || arrayBuffer.byteLength < 8) {
    return null;
  }

  const bytes = new Uint8Array(arrayBuffer);
  const typeBytes = bytes.subarray(0, 4);

  if (!Array.from(typeBytes).every(isPrintableAscii)) {
    return null;
  }

  const type = String.fromCharCode(...typeBytes).replace(/\0+$/g, '');
  const length =
    (bytes[4] << 24) |
    (bytes[5] << 16) |
    (bytes[6] << 8) |
    bytes[7];

  if (!type || length < 0 || length > bytes.byteLength - 8) {
    return null;
  }

  const value = decoder.decode(bytes.subarray(8, 8 + length));
  const parsed = tryParseJson(value);
  const data = withType(parsed || value, type);

  return withDebugMeta(data, {
    source: 'tlv',
    messageType: type,
    byteLength: bytes.byteLength,
    payloadLength: length,
  });
};

const parseTextMessage = (messageText, byteLength) => {
  const trimmed = messageText.trim();

  if (!trimmed) {
    return null;
  }

  const directJson = tryParseJson(trimmed);
  if (directJson) {
    return withDebugMeta(directJson, {
      source: 'json',
      messageType: directJson.type || 'json',
      byteLength,
      payloadLength: trimmed.length,
    });
  }

  const prefixedMatch = trimmed.match(/^([a-zA-Z]{3,4})\s*(\{[\s\S]*\})$/);
  if (prefixedMatch) {
    const [, type, jsonText] = prefixedMatch;
    const parsed = tryParseJson(jsonText);
    return withDebugMeta(withType(parsed, type), {
      source: 'prefixed-json',
      messageType: type,
      byteLength,
      payloadLength: jsonText.length,
    });
  }

  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = tryParseJson(jsonMatch[0]);
    if (parsed) {
      return withDebugMeta(parsed, {
        source: 'extracted-json',
        messageType: parsed.type || 'json',
        byteLength,
        payloadLength: jsonMatch[0].length,
      });
    }
  }

  if (
    trimmed.includes('"data"') ||
    trimmed.includes('"type"') ||
    trimmed.includes('"subtitle"') ||
    trimmed.startsWith('subv{')
  ) {
    return null;
  }

  return withDebugMeta({
    type: 'unknown',
    text: trimmed,
    definite: true,
    userId: 'AI',
  }, {
    source: 'plain-text',
    messageType: 'unknown',
    byteLength,
    payloadLength: trimmed.length,
  });
};

export const parseRTCMessageBuffer = (buffer) => {
  const tlvMessage = parseTlvMessage(buffer);
  if (tlvMessage) {
    return tlvMessage;
  }

  return parseTextMessage(decodeText(buffer), getRTCMessageByteLength(buffer));
};

export const getRTCMessageDebugMeta = (messageData) => {
  return messageData?.__rtcMeta || null;
};
