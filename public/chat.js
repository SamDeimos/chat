const socket = io();
var output = $('#output');
var conectados = $('#user-conectados');

$('#send-message').on('submit', function (e) {
    socket.emit('chat:message', {
        username: localStorage.getItem('username'),
        message: $('#send-message input[name=message]').val()
    });
    $('#send-message input[name=message]').val('')
    e.preventDefault();
});

socket.on('chat:message', function (data) {
    html = `<p><strong>${data.username}: </strong>${data.message}</p>`;

    output.append(html);
    output.scrollTop(output.height() + output.scrollTop());
});

socket.on('chat:conectados', function (data) {
    conectados.children().remove();
    html = '';
    $.each(data, function (ind, elem) {
        html += `<li>${elem}</li>`;
    })
    conectados.append(html);
});

//Historial de mensajes
socket.on('chat:messages', function (data) {
    let html = '';
    $.each(data, function (ind, elem) {
        html += `<p><strong>${elem.username}: </strong>${elem.message}</p>`;
    });

    output.append(html);
    output.scrollTop(output.height() + output.scrollTop());
});
