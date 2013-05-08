app.connect = function () {
    var socket = io.connect('http://localhost:8080');//サーバに繋ぐ

    //connectイベントは最初からある。つながった時に発火
    socket.on('connect', function() {
        // console.log(socket)
        socket.emit( 'client_comeNewAvatar', {
            name     : app.myData.name,
            texture  : app.myData.texture,
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
                console.log( app.playersData.avatarList[ i ].texture + 'old' )
                app.playersData.add( i, app.playersData.avatarList[ i ].texture, app.playersData.avatarList[ i ].name );
            }
        }
        console.log( 'my ID is ' + params.myID );
        // console.log( params.players )
    } );

    socket.on( 'server_newComersId', function ( newComer ) {
        // console.log( newComer.id + ' has come' );
        app.playersData.add( newComer.id, newComer.data.texture, newComer.data.name );
    } );

    socket.on('server_sync', function ( allUsersData ) {
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
        socket.emit( "client_sync", myData );
    });

    socket.on('disconnectOthrePlayer', function ( id ) {
        console.log( id );
        app.playersData.remove( id );
    });
};