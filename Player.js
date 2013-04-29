var app = app || {};

( function () {
    const PLAYER_HEIGHT = 5;
    const PLAYER_MOVEMENT_SPEED = 50;

    app.Player = function ( avatar ) {
        var that = this;
        this.avatar = avatar;

        this.holder = new THREE.Object3D();
        this.holder.autoUpdateMatrix = false;
        this.holder.useQuaternion = true;

        this.frontAngle = 0;
        this.velocity = new THREE.Vector3( 0, -100, 0 );

        this.lastKeyInputedTime;

        app.DeviceInput.addEventListener( 'withKeydown', onkeydown );
        app.DeviceInput.addEventListener( 'withKeyup',   onkeyup );
        app.DeviceInput.addEventListener( 'withJumpKeydown', onJumpKeyDown );

        function onkeydown ( e ) {
            that.lastInputedTime = app.clock.getElapsedTime();
            that.updateFrontAngle();
            that.walk();
        };

        function onkeyup ( e ) {
            const EXPIRE_TIME = 1.0;
            if ( !(
                !app.DeviceInput.keyInput.up &&
                !app.DeviceInput.keyInput.down &&
                !app.DeviceInput.keyInput.left &&
                !app.DeviceInput.keyInput.right
            ) ) {
                onkeydown();
            }
            setTimeout( function () {
                if ( that.lastInputedTime > app.clock.getElapsedTime() - EXPIRE_TIME ) {
                    return;
                }
                if (
                    !app.DeviceInput.keyInput.up &&
                    !app.DeviceInput.keyInput.down &&
                    !app.DeviceInput.keyInput.left &&
                    !app.DeviceInput.keyInput.right
                ) {
                    that.stand();
                }
            }, EXPIRE_TIME * 1000 );
        };

        function onJumpKeyDown () {
            that.jump();
        }
    };

    app.Player.prototype.updateFrontAngle = function () {
        var up = app.DeviceInput.keyInput.up;
        var left = app.DeviceInput.keyInput.left;
        var right = app.DeviceInput.keyInput.right;
        var down = app.DeviceInput.keyInput.down;
        var frontAngle = app.DeviceInput.mouseInput.current.x * Math.PI / 180;
        if( up && !left && !down && !right){ frontAngle +=   0 * Math.PI / 180 }
        if( up &&  left && !down && !right){ frontAngle +=  45 * Math.PI / 180 }
        if(!up &&  left && !down && !right){ frontAngle +=  90 * Math.PI / 180 }
        if(!up &&  left &&  down && !right){ frontAngle += 135 * Math.PI / 180 }
        if(!up && !left &&  down && !right){ frontAngle += 180 * Math.PI / 180 }
        if(!up && !left &&  down &&  right){ frontAngle += 225 * Math.PI / 180 }
        if(!up && !left && !down &&  right){ frontAngle += 270 * Math.PI / 180 }
        if( up && !left && !down &&  right){ frontAngle += 315 * Math.PI / 180 }
        this.frontAngle = frontAngle;
    };

    app.Player.prototype.update = function () {
        // this.motion = 
        this.avatar.visualBody.rotation.y = this.frontAngle;
        this.rotatePlayerObj();
        this.avatar.physicalBody.velocity.x = this.velocity.x;
        this.avatar.physicalBody.velocity.y = this.velocity.y;
        this.avatar.physicalBody.velocity.z = this.velocity.z;
        // this.holder.quaternion.copy( this.avatar.physicalBody.quaternion );
        this.holder.position.copy( this.avatar.physicalBody.position );
        this.avatar.visualBody.position.copy( this.avatar.physicalBody.position );
    };

    app.Player.prototype.rotatePlayerObj = function () {
        var x = app.DeviceInput.mouseInput.current.x * Math.PI / 180;
        var y = app.DeviceInput.mouseInput.current.y * Math.PI / 180;
        var qBase = new THREE.Quaternion();
        var qHorizontal = new THREE.Quaternion();
        var qVertical = new THREE.Quaternion();
        var axisX = new THREE.Vector3( 1, 0, 0 );
        var axisY = new THREE.Vector3( 0, 1, 0 );

        qHorizontal.setFromAxisAngle( axisY, x );
        qVertical.setFromAxisAngle( axisX, y );
        h = qHorizontal;
        qBase.multiplyQuaternions( qBase, qHorizontal );
        qBase.multiplyQuaternions( qBase, qVertical );
        this.holder.quaternion = qBase;
    };

    app.Player.prototype.walk = function () {
        if ( this.avatar.motion === 'jump' ) {
            return;
        };
        this.velocity.x = -Math.sin( this.frontAngle ) * PLAYER_MOVEMENT_SPEED;
        this.velocity.z = -Math.cos( this.frontAngle ) * PLAYER_MOVEMENT_SPEED;
        this.avatar.motion = 'walk';
    };

    app.Player.prototype.stand = function () {
        if ( this.avatar.motion === 'jump' ) {
            return;
        };
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.avatar.motion = 'stand';
    };

    app.Player.prototype.jump = function () {
        if ( this.avatar.motion === 'jump' ) {
            return;
        };
        const START_TIME = Date.now();
        const MAX_COUNT = 30;
        //rayで着地を判断する
        var that = this;
        var count = 0;
        var lastMotion = this.avatar.motion;
        this.avatar.motion = 'jump';
        app.DeviceInput.disableMovementKey = true;

        ( function loop () {
            var estimateTime = Date.now() - START_TIME;
            count++;
            that.velocity.y = 10 * ( ( MAX_COUNT / 2 ) - count );
            if ( count < MAX_COUNT ) {
                requestAnimationFrame( loop );
            } else {
                that.velocity.y = 0;
                that.avatar.motion = lastMotion;
                app.DeviceInput.disableMovementKey = false;
            }
        } )();
    };

} )();