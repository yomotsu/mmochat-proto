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
    var playerAvator = new app.Avatar( './fez1.png', 'player1', scene, world );
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

    var dirLight2 = new THREE.DirectionalLight( 0xffffff, .5 );
    dirLight2.position.set( -10, 50, -50 );
    scene.add( dirLight2 );

    var spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
    spotLight.position.set( 50, 50, 50 );
    spotLight.target.position.set( 0, 0, 0 );
    scene.add( spotLight );

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
    world.gravity.set( 0, -100, 0 );
};


function addGround ( offsetVec3 ) {
    var x = offsetVec3.x;
    var y = offsetVec3.y;
    var z = offsetVec3.z;

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
        new THREE.MeshNormalMaterial()// material
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
};