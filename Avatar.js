var app = app || {};

( function () {

    const PHYSICAL_BODY_HEIGHT = 10;

    app.Avatar = function ( textureID, name, threeScene, cannonWorld ) {
        this.visualBody = new THREE.Object3D();
        threeScene.add( this.visualBody );

        if ( cannonWorld ) {
            this.physicalBody = new CANNON.RigidBody(
                100,
                new CANNON.Sphere( PHYSICAL_BODY_HEIGHT )
            );
            this.physicalBody.position.set( 0, 50, 0 );
            this.physicalBody.angularDamping = 1.0;
            cannonWorld.add( this.physicalBody );
        }
        this.name = name;
        this.texture = app.Avatar.textures[ textureID ];
        this.parts = {};
        this.motion = 'stand';

        this.createBody();
    };

    app.Avatar.prototype.createBody = function () {

        var arrow = new THREE.ArrowHelper(
            new THREE.Vector3( 0, 0, -1 ),
            new THREE.Vector3( 0, 0, 0 ),
            30
        );
        this.visualBody.add( arrow );

        var sphere = new THREE.Mesh(
          new THREE.SphereGeometry( 10, 8, 8 ),
          new THREE.MeshBasicMaterial( { color: 0xff0000,  wireframe: true} )
        );
        this.visualBody.add( sphere );

var canvas = document.createElement('canvas');
var size = 512; // CHANGED
canvas.width = size;
canvas.height = size;
var ctx = canvas.getContext('2d');
ctx.font = '24px Arial';
ctx.textAlign = 'center';
ctx.strokeStyle = "#000";
ctx.lineWidth = 3;
ctx.strokeText( this.name, size / 2, size / 2);
ctx.fillStyle = '#fff';
ctx.fillText( this.name, size / 2, size / 2);

var amap = new THREE.Texture(canvas);
amap.needsUpdate = true;

var mat = new THREE.SpriteMaterial({
    map: amap,
    transparent: false,
    useScreenCoordinates: false,
    color: 0xffffff // CHANGED
});

var sp = new THREE.Sprite(mat);
sp.scale.set( 100, 100, 1 );
sp.position.set( 0, 26, 0 );
this.visualBody.add(sp);



        texture = THREE.ImageUtils.loadTexture( this.texture );
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.magFilter = texture.minFilter = THREE.NearestFilter;
        material = new THREE.MeshBasicMaterial( {
            map: texture,
            alphaTest: 0.5,
            transparent: true
        } );

        // Left leg
        var leftleggeo = new THREE.CubeGeometry( 4, 12, 4 );
        for( var i = 0; i < 8; i += 1 ) {
            leftleggeo.vertices[i].y -= 6;
        };
        app.Avatar.uvmap( leftleggeo, 0, 12, 20, -4, 12 );
        app.Avatar.uvmap( leftleggeo, 1, 4, 20, -4, 12 );
        app.Avatar.uvmap( leftleggeo, 2, 4, 16, 4, 4, 3 );
        app.Avatar.uvmap( leftleggeo, 3, 8, 20, 4, -4, 1 );
        app.Avatar.uvmap( leftleggeo, 5, 16, 20, -4, 12 );
        app.Avatar.uvmap( leftleggeo, 4, 8, 20, -4, 12 );
        this.parts.leftleg = new THREE.Mesh( leftleggeo, material );
        this.parts.leftleg.position.x = -2;
        this.parts.leftleg.position.y = 12 - PHYSICAL_BODY_HEIGHT;
        this.parts.leftleg.rotation.y = 180 * Math.PI / 180;
        this.visualBody.add( this.parts.leftleg );

        // Right leg
        var rightleggeo = new THREE.CubeGeometry( 4, 12, 4 );
        for( var i = 0; i < 8; i += 1 ) {
            rightleggeo.vertices[i].y -= 6;
        };
        app.Avatar.uvmap( rightleggeo, 0, 0, 20, 4, 12 );
        app.Avatar.uvmap( rightleggeo, 1, 8, 20, 4, 12 );
        app.Avatar.uvmap( rightleggeo, 2, 8, 16, -4, 4, 3 );
        app.Avatar.uvmap( rightleggeo, 3, 12, 20, -4, -4, 1 );
        app.Avatar.uvmap( rightleggeo, 5, 12, 20, 4, 12 );
        app.Avatar.uvmap( rightleggeo, 4, 4, 20, 4, 12 );
        this.parts.rightleg = new THREE.Mesh( rightleggeo, material );
        this.parts.rightleg.position.x = 2;
        this.parts.rightleg.position.y = 12 - PHYSICAL_BODY_HEIGHT;
        this.parts.rightleg.rotation.y = 180 * Math.PI / 180;
        this.visualBody.add( this.parts.rightleg );

        // Body
        var bodygeo = new THREE.CubeGeometry( 8, 12, 4 );
        app.Avatar.uvmap( bodygeo, 0, 16, 20, 4, 12 );
        app.Avatar.uvmap( bodygeo, 1, 28, 20, 4, 12 );
        app.Avatar.uvmap( bodygeo, 2, 20, 16, 8, 4 );
        app.Avatar.uvmap( bodygeo, 3, 28, 16, 8, 4 );
        app.Avatar.uvmap( bodygeo, 4, 20, 20, 8, 12 );
        app.Avatar.uvmap( bodygeo, 5, 32, 20, 8, 12 );
        this.parts.body = new THREE.Mesh( bodygeo, material );
        this.parts.body.position.y = 18 - PHYSICAL_BODY_HEIGHT;
        this.parts.body.rotation.y = 180 * Math.PI / 180;
        this.visualBody.add( this.parts.body );

        // Left arm
        var leftarmgeo = new THREE.CubeGeometry( 4, 12, 4 );
        for( var i = 0; i < 8; i += 1 ) {
            leftarmgeo.vertices[i].y -= 4;
        };
        app.Avatar.uvmap( leftarmgeo, 0, 52, 20, -4, 12 );
        app.Avatar.uvmap( leftarmgeo, 1, 44, 20, -4, 12 );
        app.Avatar.uvmap( leftarmgeo, 2, 48, 16, -4, 4 );
        app.Avatar.uvmap( leftarmgeo, 3, 52, 16, -4, 4 );
        app.Avatar.uvmap( leftarmgeo, 4, 56, 20, -4, 12 );
        app.Avatar.uvmap( leftarmgeo, 5, 48, 20, -4, 12 );
        this.parts.leftarm = new THREE.Mesh( leftarmgeo, material );
        this.parts.leftarm.position.x = -6;
        this.parts.leftarm.position.y = 22 - PHYSICAL_BODY_HEIGHT;
        this.parts.leftarm.rotation.y = 180 * Math.PI / 180;
        this.parts.leftarm.rotation.z = Math.PI / 32;
        this.visualBody.add( this.parts.leftarm );

        // Right arm
        var rightarmgeo = new THREE.CubeGeometry( 4, 12, 4 );
        for( var i = 0; i < 8; i += 1 ) {
            rightarmgeo.vertices[i].y -= 4;
        };
        app.Avatar.uvmap( rightarmgeo, 0, 40, 20, 4, 12 );
        app.Avatar.uvmap( rightarmgeo, 1, 48, 20, 4, 12 );
        app.Avatar.uvmap( rightarmgeo, 2, 44, 16, 4, 4 );
        app.Avatar.uvmap( rightarmgeo, 3, 48, 16, 4, 4 );
        app.Avatar.uvmap( rightarmgeo, 4, 52, 20, 4, 12 );
        app.Avatar.uvmap( rightarmgeo, 5, 44, 20, 4, 12 );
        this.parts.rightarm = new THREE.Mesh( rightarmgeo, material );
        this.parts.rightarm.position.x = 6;
        this.parts.rightarm.position.y = 22 - PHYSICAL_BODY_HEIGHT;
        this.parts.rightarm.rotation.y = 180 * Math.PI / 180;
        this.parts.rightarm.rotation.z = -Math.PI / 32;
        this.visualBody.add( this.parts.rightarm );

        //Head
        var headgeo = new THREE.CubeGeometry( 8, 8, 8 );
        app.Avatar.uvmap( headgeo, 0, 16, 8, 8, 8 ); // +x
        app.Avatar.uvmap( headgeo, 1, 0, 8, 8, 8 ); // -x
        app.Avatar.uvmap( headgeo, 2, 8, 0, 8, 8 ); // +y
        app.Avatar.uvmap( headgeo, 3, 16, 0, 8, 8 ); // -y
        app.Avatar.uvmap( headgeo, 4, 8, 8, 8, 8 ); // +z
        app.Avatar.uvmap( headgeo, 5, 24, 8, 8, 8 ); // -z
        this.parts.head = new THREE.Mesh( headgeo, material );
        this.parts.head.position.y = 28 - PHYSICAL_BODY_HEIGHT;
        this.parts.head.rotation.y = 180 * Math.PI / 180;
        this.visualBody.add( this.parts.head );

        // Helmet
        var helmetgeo = new THREE.CubeGeometry( 9, 9, 9 );
        app.Avatar.uvmap( helmetgeo, 0, 32 + 16, 8, 8, 8 ); // +x
        app.Avatar.uvmap( helmetgeo, 1, 32 + 0, 8, 8, 8 ); // -x
        app.Avatar.uvmap( helmetgeo, 2, 32 + 8, 0, 8, 8 ); // +y
        app.Avatar.uvmap( helmetgeo, 3, 32 + 16, 0, 8, 8 ); // -y
        app.Avatar.uvmap( helmetgeo, 4, 32 + 8, 8, 8, 8 ); // +z
        app.Avatar.uvmap( helmetgeo, 5, 32 + 24, 8, 8, 8 ); // -z
        this.parts.helmet = new THREE.Mesh( helmetgeo, material );
        this.parts.helmet.doubleSided = true;
        this.parts.helmet.position.y = 28 - PHYSICAL_BODY_HEIGHT;
        this.parts.helmet.rotation.y = 180 * Math.PI / 180;
        this.visualBody.add( this.parts.helmet );
    };
    
    app.Avatar.prototype.anim = function () {
        if ( this.motion === 'stand' || this.motion === 'jump' ) {
            // this.visualBody.position.y = 0;
            this.parts.rightarm.rotation.x = 0;
            this.parts.leftarm.rotation.x = 0;
            this.parts.rightleg.rotation.x = 0;
            this.parts.leftleg.rotation.x = 0;
            return;
        };

        if ( this.motion === 'walk' ) {
            var theta = app.clock.getElapsedTime();
            // this.visualBody.position.y = 0;
            this.parts.rightarm.rotation.x = Math.cos( 0.6662 * theta * 10 + Math.PI );
            this.parts.leftarm.rotation.x = Math.cos( 0.6662 * theta * 10 );
            this.parts.rightleg.rotation.x = Math.cos( 0.6662 * theta * 10 );
            this.parts.leftleg.rotation.x = Math.cos( 0.6662 * theta * 10 + Math.PI );
            return;
        };

        if ( this.motion === 'crouch' ) {
            // this.visualBody.position.y = -10;
            this.parts.rightarm.rotation.x = 0;
            this.parts.leftarm.rotation.x = 0;
            this.parts.rightleg.rotation.x = -90 * Math.PI / 180;
            this.parts.leftleg.rotation.x = -90 * Math.PI / 180;
            return;
        };
    };

    app.Avatar.uvmap = function ( geometry, face, x, y, w, h ) {
        const tileUvWidth = 1 / 64;
        const tileUvHeight = 1 / 32;
        const tileU = x;
        const tileV = y;
        var uvs = geometry.faceVertexUvs[ 0 ][ face ];
        uvs[ 0 % 4 ].x = tileU * tileUvWidth;
        uvs[ 0 % 4 ].y = 1 - ( tileV * tileUvHeight );
        uvs[ 1 % 4 ].x = tileU * tileUvWidth;
        uvs[ 1 % 4 ].y = 1 - ( tileV * tileUvHeight + h * tileUvHeight );
        uvs[ 2 % 4 ].x = tileU * tileUvWidth + w * tileUvWidth;
        uvs[ 2 % 4 ].y = 1 - ( tileV * tileUvHeight + h * tileUvHeight );
        uvs[ 3 % 4 ].x = tileU * tileUvWidth + w * tileUvWidth;
        uvs[ 3 % 4 ].y = 1 - ( tileV * tileUvHeight );
    };

    app.Avatar.nameTexture = function ( text ) {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 512;
        canvas.height = 512;

        var ctx = canvas.getContext( '2d' );
        ctx.font = 'normal 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeText( text, canvas.width / 2, 24, canvas.width );
        ctx.fillStyle = '#fff';
        ctx.fillText( text, canvas.width / 2, 24, canvas.width );

        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
        return texture;
    };

    app.Avatar.textures = {
        a : 'avatar/fez_1_pelz.png',
        b : 'avatar/fez_1_milchica.png',
        c : 'avatar/fez_2_lumen.png',
        d : 'avatar/fez_2_atera.png',
        e : 'avatar/fez_3_eins.png',
        f : 'avatar/fez_3_zwei.png',
        g : 'avatar/fez_3_drei.png',
        h : 'avatar/fez_3_vier.png',
        i : 'avatar/fez_4_phantom.png',
        j : 'avatar/fez_4_cinnamon.png',
        k : 'avatar/fez_4_plum.png',
        l : 'avatar/fez_0_coward.png'
    };

} )();