app.playersData = {
    data : {},
    avatarList : {
        // ID : Avatar
    },
    watchAndSync  : function () {
        var data, avatar;
        for ( var i in app.playersData.data ) {
            data = app.playersData.data[ i ];
            avatar = app.playersData.avatarList[ i ];
            if ( i !== app.myData.id && avatar && data ) {
                // avatar.visualBody.position.x = data.position[ 0 ];
                // avatar.visualBody.position.y = data.position[ 1 ];
                // avatar.visualBody.position.z = data.position[ 2 ];

                avatar.physicalBody.position.x = data.position[ 0 ];
                avatar.physicalBody.position.y = data.position[ 1 ];
                avatar.physicalBody.position.z = data.position[ 2 ];

                avatar.physicalBody.velocity.x = data.velocity[ 0 ];
                avatar.physicalBody.velocity.y = data.velocity[ 1 ];
                avatar.physicalBody.velocity.z = data.velocity[ 2 ];
            };
        };
    },
    update : function () {
        var data, avatar;
        for ( var i in app.playersData.avatarList ) {
            data = app.playersData.data[ i ];
            avatar = app.playersData.avatarList[ i ];
            if ( i !== app.myData.id && avatar && data ) {
                avatar.physicalBody.velocity.x = data.velocity[ 0 ];
                avatar.physicalBody.velocity.y = data.velocity[ 1 ];
                avatar.physicalBody.velocity.z = data.velocity[ 2 ];
                avatar.visualBody.position.x = avatar.physicalBody.position.x|0;
                avatar.visualBody.position.y = avatar.physicalBody.position.y|0;
                avatar.visualBody.position.z = avatar.physicalBody.position.z|0;

                avatar.visualBody.rotation.y = data.angle;
                avatar.motion = data.motion;
                avatar.anim();
            };
        };
    },
    add : function ( id ) {
        console.log(app.playersData.data)
        app.playersData.avatarList[ id ] = new app.Avatar(
            'fez1.png',
            'hello',
            scene,
            world
        );
    },
    remove : function ( id ) {
        scene.remove( app.playersData.avatarList[ id ].visualBody );
        world.remove( app.playersData.avatarList[ id ].physicalBody );
        delete app.playersData.avatarList[ id ];
    }
}