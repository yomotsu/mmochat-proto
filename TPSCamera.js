var app = app || {};

( function () {
    const MAX_CAMERA_DISTANCE = 100;
    const MIN_CAMERA_DISTANCE = 5;
    const CAMERA_HEIGHT = 5;

    app.TPSCamera = function ( player, camera, params ) {
        var that = this;
        this.player = player;
        this.camera = camera;
        this.cameraHolder = new THREE.Object3D();
        this.cameraDistance = MAX_CAMERA_DISTANCE;
        this.rigidObjects = params && params.rigidObjects ? params.rigidObjects : [];

        app.DeviceInput.addEventListener( 'withScroll', setDistance );

        function setDistance ( e ) {
            var distance = that.cameraDistance;
            distance += e.delta;
            if( distance < MIN_CAMERA_DISTANCE ) {
                that.cameraDistance = MIN_CAMERA_DISTANCE;
                return;
            }
            if( distance > MAX_CAMERA_DISTANCE ) {
                that.cameraDistance = MAX_CAMERA_DISTANCE;
                return;
            }
            that.cameraDistance = distance;
        }
    }

    app.TPSCamera.prototype.setRotation = function () {
        this.cameraHolder.rotation = new THREE.Vector3().setEulerFromQuaternion( this.player.holder.quaternion, 'XYZ' );
    }
    app.TPSCamera.prototype.setPosition = function () {
        var x = app.DeviceInput.mouseInput.current.x * Math.PI / 180;
        var y = app.DeviceInput.mouseInput.current.y * Math.PI / 180;

        var cameraPositionIdentity = new THREE.Vector3(
            Math.sin( x ) * Math.cos( y ),
            -Math.sin( y ),
            Math.cos( x ) * Math.cos( y )
        );

        var cameraOriginX = this.player.holder.position.x;
        var cameraOriginY = this.player.holder.position.y + CAMERA_HEIGHT;
        var cameraOriginZ = this.player.holder.position.z;

        var distanceToCollisionPoint = app.TPSCamera.collisionTest(
            { x : cameraOriginX, y : cameraOriginY, z : cameraOriginZ },
            cameraPositionIdentity,
            this.rigidObjects
        );

        var distance = this.cameraDistance;
        if ( distanceToCollisionPoint && distanceToCollisionPoint < this.cameraDistance ) {
            distance = distanceToCollisionPoint;
        }
        this.cameraHolder.position.set(
            cameraOriginX + distance * cameraPositionIdentity.x,
            cameraOriginY + distance * cameraPositionIdentity.y,
            cameraOriginZ + distance * cameraPositionIdentity.z
        );
    }

    app.TPSCamera.collisionTest = function ( origin, direction, rigidObjects ) {
        var raycaster = new THREE.Raycaster( origin, direction, 1, MAX_CAMERA_DISTANCE );
        var intersects = raycaster.intersectObjects( rigidObjects );
        if ( intersects.length >= 1 ){
            var x1 = origin.x;
            var y1 = origin.y;
            var z1 = origin.z;
            var x2 = intersects[ 0 ].point.x;
            var y2 = intersects[ 0 ].point.y;
            var z2 = intersects[ 0 ].point.z;
            var distance = Math.sqrt( Math.pow( x1 - x2, 2 ) + Math.pow( y1 - y2, 2 ) + Math.pow( z1 - z2, 2 ) );
            return distance - 5;
        } else {
            return false;
        }
    };

    app.TPSCamera.prototype.sync = function () {
        this.camera.position = this.cameraHolder.position;
        this.camera.rotation = this.cameraHolder.rotation;
    };

    app.TPSCamera.prototype.update = function () {
        this.setRotation();
        this.setPosition();
        this.sync();
    };

} )();