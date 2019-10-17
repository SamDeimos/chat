$(document).ready(() => {
    if (localStorage.getItem('username') == undefined) {
        $('#loginModal').modal('show');
    }

    $('#save-username').on('submit', function(e){
        username = $('#save-username input[name=username]').val()

        localStorage.setItem('username', username);

        socket.emit('chat:login', username)

        $('#loginModal').modal('hide');
        $('#username').text(username);
        e.preventDefault();
    });
});