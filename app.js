const express = require('express');
const path = require('path'); //Vamos utilizar para montar caminhos.

const app = express();

// Aqui to criando o protocolo de comunicação HTTP.
const server = require('http').createServer(app);

// Aqui crio o protocolo WS
const io  = require('socket.io')(server);

// Deixo publico ou statico a pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Aqui indico para o node que toda vez que algume pedir uma view como thml
// ele deve retornar a pasta public.
app.set('views', path.join(__dirname, 'public'));

// Aqui definimos como html o retorno.
// Isso é um processo muito comum no node quando precisamos trabalhar com html.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// Aqui retorno o HTML quando o usuário acessa a rota "/".
app.set('/', (requisicao, response) => {
    response.render('index.html');
})


let mensagens = [];

io.on('connection', socket => {
    console.log('Socket conectado ' + socket.id );

    socket.emit('previousMessages', mensagens);

    // Aqui eu recebo as mensagens do client
    socket.on('sendMessage', data =>{
        console.log(data);

        // Armazenando em memoria as mensagens que chegam no backend.
        mensagens.push(data);

        // Aqui envio para todos que esatão ouvindo esse envento.
        socket.broadcast.emit('receivedMessage', data);
    })
})


server.listen('3000', console.log('Api de chat rodando na porta 3000'));