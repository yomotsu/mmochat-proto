app.connect = function () {
    var socket = io.connect('http://localhost:8080');//サーバに繋ぐ

    //connectイベントは最初からある。つながった時に発火
    socket.on('connect', function() {
        console.log(socket)

        socket.emit( 'comeNewAvatar', {
            name     : app.myData.name,
            position : app.myData.position,
            velocity : app.myData.velocity,
            angle    : app.myData.angle,
            motion   : app.myData.motion
        } );
    });

    socket.on( 'server_myId', function ( myId ) {
        console.log( myId );
        app.myData.id = myId;
    } );

    socket.on( 'server_newComersId', function ( newComersId ) {
        console.log( newComersId + 'comes' );
    } );

    socket.on('syncPush', function ( allUsersData ) {
        console.log( allUsersData );
        var myData = {
            position : app.myData.position,
            velocity : app.myData.velocity,
            angle    : app.myData.angle,
            motion   : app.myData.motion
        };
        socket.emit( "syncSend", myData );
    });

    socket.on('disconnectOthrePlayer', function ( id ) {
        console.log( id );
    });
};