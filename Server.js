const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// Memória temporária para usuários
let users = {};

io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Entra no chat
    socket.on('join', () => {
        users[socket.id] = {id: socket.id};
    });

    // Mensagem de áudio
    socket.on('audio', (data) => {
        // Envia para todos exceto o remetente
        socket.broadcast.emit('audio', data);
    });

    // Desconexão
    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('Usuário desconectado:', socket.id);
    });
});

http.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
