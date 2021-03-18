(() => {

    // Aqui me conecto de maneira automagica com o servidor.
    var socket = io('http://localhost:3000');

    // Aqui fico ouvindo as mensagens que vem do backend, com isso atualizo a tela.
    socket.on('receivedMessage', mensagem => {
        _atualizarMensagens(mensagem);
    })

    // Aqui recebo a lista de mensagens do backend.
    socket.on('previousMessages', mensages => {
        // for(mensagem in mensages){
        //     _atualizarMensagens(mensagem);
        // }

        mensages.forEach(mensagem => {
            _atualizarMensagens(mensagem);
        })
        
    })

    // Capturando os elementos da tela.
    var form = {
        usuario: document.querySelector('#usuario'),
        listaMensagens: document.querySelector('#mensagens-gerais'),
        mensagem: document.querySelector('#mensagem-usuario'),
        btnEnviar: document.querySelector('#btn-enviar')
    }

    form.btnEnviar.addEventListener('click', (e) =>{
        e.preventDefault();
        _enviarMensagem();
   
    });

    function _enviarMensagem(){
             
        var messageObject = {
            usuario: form.usuario.value,
            mensagem: form.mensagem.value
        };

        if(!messageObject.usuario || !messageObject.mensagem){
            alert('Favor informar o usuário e a mensagem')
            return;
        }
        // Aqui atualizo a mensagem na tela.
        _atualizarMensagens(messageObject);

        // Aqui envio a mensagem por socket para o servidor.
        socket.emit('sendMessage', messageObject);

        _limparCampos();
    }

    form.mensagem.addEventListener('keypress', (e) => {

        if(e.keyCode == 13){
            _enviarMensagem();
        }
    })

    function _atualizarMensagens(mensagem){

        var div = document.createElement('div');
        var strong = document.createElement('strong');
        var span = document.createElement('span');

        div.classList.add('message-received');

        strong.textContent = mensagem.usuario + ": ";
        span.textContent = mensagem.mensagem;

        div.appendChild(strong);
        div.appendChild(span);

        form.listaMensagens.appendChild(div);

    }

    function _limparCampos(){
        form.mensagem.value = "";
    }
})()

