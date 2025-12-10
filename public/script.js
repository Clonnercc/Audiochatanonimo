const socket = io();
let localStream;

// Usuário entra no chat
document.getElementById('startBtn').onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    socket.emit('join');
    startStreaming();
};

// Transmite áudio para outros
function startStreaming() {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(localStream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = e => {
        const input = e.inputBuffer.getChannelData(0);
        socket.emit('audio', input);
    };
}

// Recebe áudio de outros
socket.on('audio', (data) => {
    const audioContext = new AudioContext();
    const buffer = audioContext.createBuffer(1, data.length, audioContext.sampleRate);
    buffer.copyToChannel(new Float32Array(data), 0);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
});
