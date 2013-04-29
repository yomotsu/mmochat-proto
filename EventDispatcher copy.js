var app = app || {};

( function () {
    const MOUSE_ACCELERATION_X = 100;
    const MOUSE_ACCELERATION_Y = 20;

    app.DeviceInput = new EventDispatcher();
    var that = app.DeviceInput;

    that.disable = false;

    that.keyInput = {
        up : false,
        down : false,
        left : false,
        right : false
    };

    that.mouseInput = {
        current : new THREE.Vector2(),
        start : new THREE.Vector2(),
        last : new THREE.Vector2()
    };

    window.addEventListener( 'keydown', onkeydown, false );
    window.addEventListener( 'keyup',   onkeyup, false );

    window.addEventListener( 'mousedown', onmousedown, false );
    window.addEventListener( 'mouseup',   onmouseup, false );
    window.addEventListener( 'mousewheel' ,    onscroll, false);
    window.addEventListener( 'DOMMouseScroll', onscroll, false);

    function onkeydown ( e ) {
        //W || up arrow
        if ( e.keyCode === 87 || e.keyCode === 38 ) {
            that.keyInput.up = true;
            that.keyInput.down = false;
        }
        //S || down arrow
        if ( e.keyCode === 83 || e.keyCode === 40 ) {
            that.keyInput.down = true;
            that.keyInput.up = false;
        }
        //A || left arrow
        if ( e.keyCode === 65 || e.keyCode === 37 ) {
            that.keyInput.left = true;
            that.keyInput.right = false;
        }
        //D || right arrow
        if ( e.keyCode === 68 || e.keyCode === 39 ) {
            that.keyInput.right = true;
            that.keyInput.left = false;
        }
        that.dispatchEvent( { type: 'withKeydown' } );
    };

    function onkeyup ( e ) {
        if( e.keyCode === 87 || e.keyCode === 38 ){
            that.keyInput.up = false;
        } else if ( e.keyCode === 83 || e.keyCode === 40 ){
            that.keyInput.down = false;
        } else if ( e.keyCode === 65 || e.keyCode === 37 ){
            that.keyInput.left = false;
        } else if ( e.keyCode === 68 || e.keyCode === 39 ){
            that.keyInput.right = false;
        }
        that.dispatchEvent( { type: 'withKeyup' } );
    };

    function onmousedown ( e ) {
        that.mouseInput.start.x = e.clientX;
        that.mouseInput.start.y = e.clientY;
        that.mouseInput.last.x = that.mouseInput.current.x;
        that.mouseInput.last.y = that.mouseInput.current.y;
        window.addEventListener( 'mousemove', onmousedrag, false );
    };

    function onmouseup () {
        window.removeEventListener( 'mousemove', onmousedrag, false );
    };

    function onmousedrag ( e ) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var x = ( that.mouseInput.start.x - e.clientX ) / width * 2;
        var y = ( that.mouseInput.start.y - e.clientY ) / height * 2;
        that.mouseInput.current.x = that.mouseInput.last.x + x;
        that.mouseInput.current.y = that.mouseInput.last.y + y;
    };

} )();

// app.DeviceInput.addEventListener( 'withKeydown', function () {
//     console.log(2211)
// } )