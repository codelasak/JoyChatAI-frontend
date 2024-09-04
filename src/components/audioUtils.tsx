export const createWavBlob = async (audio: Float32Array): Promise<Blob> => {
    const int16Array = new Int16Array(audio.length);
    for (let i = 0; i < audio.length; i++) {
      const s = Math.max(-1, Math.min(1, audio[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
  
    const wavHeader = createWavHeader(int16Array.length, 1, 16000, 16);
    return new Blob([wavHeader, int16Array], { type: 'audio/wav' });
  };
  
  export const createWavHeader = (dataLength: number, numChannels: number, sampleRate: number, bitsPerSample: number): ArrayBuffer => {
    const buffer = new ArrayBuffer(44);
    const view = new DataView(buffer);
  
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength * 2, true);
  
    return buffer;
  };
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  export const sendAudioToServer = async (audioBlob: Blob): Promise<string> => {
    if (audioBlob.size <= 44) {
      console.log('Audio blob is empty or too small, not sending to server');
      throw new Error('Audio blob is too small');
    }
  
    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.wav');
  
    const response = await fetch('http://127.0.0.1:8000/api/post-audio/', {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', response.status, errorText);
      throw new Error(`Server response was not ok: ${response.status} ${errorText}`);
    }
  
    const responseBlob = await response.blob();
    return URL.createObjectURL(responseBlob);
  };