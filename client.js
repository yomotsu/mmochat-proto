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

    socket.on( 'server_myId', function ( params ) {
        app.myData.id = params.myID;
        app.playersData.avatarList = params.players;
        for ( var i in app.playersData.avatarList ) {
            if( i !== params.myID ) {
                app.playersData.add( i );
            }
        }
        console.log( 'my ID is ' + params.myID );
        // console.log( params.players )
    } );

    socket.on( 'server_newComersId', function ( newComersId ) {
        console.log( newComersId + ' has come' );
        app.playersData.add( newComersId );
    } );

    socket.on('syncPush', function ( allUsersData ) {
        // console.log( allUsersData ); // kokoko
        app.playersData.data = allUsersData;
        app.playersData.watchAndSync();

        var myData = {
            position : [
                app.myData.position[ 0 ]|0,
                app.myData.position[ 1 ]|0,
                app.myData.position[ 2 ]|0
            ],
            velocity : [
                app.myData.velocity[ 0 ]|0,
                app.myData.velocity[ 1 ]|0,
                app.myData.velocity[ 2 ]|0
            ],
            angle    : app.myData.angle,
            motion   : app.myData.motion
        };
        socket.emit( "syncSend", myData );
    });

    socket.on('disconnectOthrePlayer', function ( id ) {
        console.log( id );
        app.playersData.remove( id );
    });
};