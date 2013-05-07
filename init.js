const WIDTH  = window.innerWidth;
const HEIGHT = window.innerHeight;
var scene, camera, light, renderer;

var world, playerPhysicsMaterial, boxPhysicsMaterial, groundPhysicsMaterial;

app.onInit = function () {
    app.DeviceInput.disableMovementKey = false;
    app.DeviceInput.disableJumpKey = false;
    app.DeviceInput.disableMouse = false;
    app.DeviceInput.disableMouseScroll = false;

    initThreeScene();
    initCannonWorld();
    addGround( new THREE.Vector3( 0, 0, 0 ) );

    var name = $( 'input[name="nameInput"]' ).val();
    var texture = $( 'input[name="texture"]:checked' ).val();
    var playerAvator = new app.Avatar( texture, name, scene, world );
    app.player = new app.Player( playerAvator );
    var tpsCamera = new app.TPSCamera(
        app.player,
        camera,
        { rigidObjects : [] }
    );

    ( function anim () {
        requestAnimationFrame( anim );
        world.step(1.0 / 60.0);
        playerAvator.anim();
        app.player.update();
        tpsCamera.update();
        app.myData.update();
        app.playersData.update();
        renderer.render( scene, camera );
    } )();
}

function initThreeScene () {
    // scene
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 1000 );
    camera.position.set( 0, 30, 150 );
    camera.lookAt( scene.position );

    // light
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.set( 10, 50, 50 );
    scene.add( dirLight );

    // var dirLight2 = new THREE.DirectionalLight( 0xffffff, .5 );
    // dirLight2.position.set( -10, 50, -50 );
    // scene.add( dirLight2 );

    // var spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
    // spotLight.position.set( 50, 50, 50 );
    // spotLight.target.position.set( 0, 0, 0 );
    // scene.add( spotLight );

    var helper1 = new THREE.AxisHelper( 150 );
    scene.add( helper1 );

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( WIDTH, HEIGHT );
    document.body.appendChild( renderer.domElement );
};

function initCannonWorld () {
    world = new CANNON.World();
    world.broadphase = new CANNON.NaiveBroadphase();
    world.iterations = 10;
    // world.gravity.set( 0, 0, 0 );
    world.gravity.set( 0, -3000, 0 );
};


function addGround () {
    //three --
    // var material = new THREE.MeshLambertMaterial( {
    //     map: THREE.ImageUtils.loadTexture( './ground/bg.jpg' ),
    // } );
    // material.map.repeat.x = 10;
    // material.map.repeat.y = 10;
    // material.map.wrapS = THREE.RepeatWrapping;
    // material.map.wrapT = THREE.RepeatWrapping;
    var ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 1000,1000 ),
        new THREE.MeshNormalMaterial()
    );
    ground.rotation.x = Math.PI / -2;
    ground.castShadow = false;
    ground.receiveShadow  = true;

    // cannnon --
    var groundBody = new CANNON.RigidBody(
      0,
      new CANNON.Plane(),
      groundPhysicsMaterial
    );
    var axisX = new CANNON.Vec3( 1, 0, 0 );
    groundBody.quaternion.setFromAxisAngle( axisX, Math.PI / -2 );

    // add
    scene.add( ground );
    world.add( groundBody );

    // ----box
    //three
    var boxSize = [ 50, 20, 50 ];
    var boxPos = [ 0, 0, 0 ];
    var box = new THREE.Mesh(
        new THREE.CubeGeometry( boxSize[ 0 ], boxSize[ 1 ], boxSize[ 2 ] ),
        new THREE.MeshNormalMaterial()
    );
    box.position.set( boxPos[ 0 ], boxPos[ 1 ], boxPos[ 2 ] );

    //cannon
    var boxBody = new CANNON.RigidBody(
        0,
        new CANNON.Box( new CANNON.Vec3( boxSize[ 0 ] / 2, boxSize[ 1 ] / 2, boxSize[ 2 ] / 2 ) )
    );
    boxBody.position.set( boxPos[ 0 ], boxPos[ 1 ], boxPos[ 2 ] );

    // add
    scene.add( box );
    world.add( boxBody );
};