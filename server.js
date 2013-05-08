//  $ node server.js で起動
var io = require( 'socket.io' ).listen(8080);

var players = {};
// クライアントからの接続毎にconnectionが発火
io.sockets.on( 'connection', function ( socket ) {


  //delete obj.y;
  socket.on( 'client_comeNewAvatar', function ( arraivalAvatarData ) {
    players[ socket.id ] = {
      name     : arraivalAvatarData.name,
      texture  : arraivalAvatarData.texture,
      position : arraivalAvatarData.position,
      velocity : arraivalAvatarData.velocity,
      angle    : arraivalAvatarData.angle,
      motion   : arraivalAvatarData.motion,
      inputTimeout : arraivalAvatarData.inputTimeout
    };
    io.sockets.socket( socket.id ).emit( 'server_myId', {
      myID : socket.id,
      players : players
    } );
    socket.broadcast.emit( 'server_newComersId', { id : socket.id, data : players[ socket.id ] } );
  });

  socket.on( 'client_sync', function ( playerData ) {
    players[ socket.id ].position     = playerData.position;
    players[ socket.id ].velocity     = playerData.velocity;
    players[ socket.id ].angle        = playerData.angle;
    players[ socket.id ].motion       = playerData.motion;
    players[ socket.id ].inputTimeout = playerData.inputTimeout;
  } );

  socket.on( 'disconnect', function () {
    delete players[ socket.id ];
    socket.broadcast.emit( 'disconnectOthrePlayer', socket.id );
  } );
});

( function loop () {
    setTimeout( loop, 50 );
    io.sockets.emit( 'server_sync', players );
} )();