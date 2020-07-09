/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 * @author yomotsu / https://yomotsu.net/
 */

import {
	Matrix4,
	Object3D,
	Vector3
} from "../node_modules/three/build/three.module.js";

var CSS3DObject = function ( element ) {

	Object3D.call( this );

	this.element = element || document.createElement( 'div' );
	this.element.style.position = 'absolute';
	this.element.style.pointerEvents = 'auto';

	this.addEventListener( 'removed', function () {

		this.traverse( function ( object ) {

			if ( object.element instanceof Element && object.element.parentNode !== null ) {

				object.element.parentNode.removeChild( object.element );

			}

		} );

	} );

};

CSS3DObject.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: CSS3DObject,

	copy: function ( source, recursive ) {

		Object3D.prototype.copy.call( this, source, recursive );

		this.element = source.element.cloneNode( true );

		return this;

	}

} );

var CSS3DSprite = function ( element ) {

	CSS3DObject.call( this, element );

};

CSS3DSprite.prototype = Object.create( CSS3DObject.prototype );
CSS3DSprite.prototype.constructor = CSS3DSprite;

//

var CSS3DRenderer = function () {

	var _this = this;

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new Matrix4();

	var cache = {
		camera: { fov: 0, style: '' },
		objects: new WeakMap()
	};

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';
	cameraElement.style.pointerEvents = 'none';
	cameraElement.id="cameraElement";
	domElement.appendChild( cameraElement );

	var isIE = /Trident/i.test( navigator.userAgent );

	this.getSize = function () {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;
		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	function epsilon( value ) {

		return Math.abs( value ) < 1e-10 ? 0 : value;

	}

	function getCameraCSSMatrix( matrix) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	}

	function getCameraTranslation(matrix) {

		var elements = matrix.elements;

		return  {
			x: elements[ 3 ],
			y: elements[ 7 ],
			z: elements[ 11 ]
		}
	}

	function getObjectCSSMatrix( matrix, cameraCSSMatrix) {

		var elements = matrix.elements;
		var matrix3d = 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' + //1
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' + //2
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' + // 3
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) + //4
		')';

		if ( isIE ) {

			return 'translate(-50%,-50%)' +
				'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)' +
				cameraCSSMatrix +
				matrix3d;

		}

		return 'translate(-50%,-50%)' + matrix3d;

	}

	function renderObject( object, scene, camera, cameraCSSMatrix) {

		if ( object instanceof CSS3DObject ) {

			object.onBeforeRender( _this, scene, camera );

			var style;

			if ( object instanceof CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix, cameraCSSMatrix);

			} else {

				style = getObjectCSSMatrix( object.matrixWorld, cameraCSSMatrix);

			}

			var element = object.element;
			var cachedObject = cache.objects.get( object );

			if ( cachedObject === undefined || cachedObject.style !== style ) {

				element.style.WebkitTransform = style;
				element.style.transform = style;

				var objectData = { style: style };

				if ( isIE ) {

					objectData.distanceToCameraSquared = getDistanceToSquared( camera, object );

				}

				cache.objects.set( object, objectData );

			}

			element.style.display = object.visible ? '' : 'none';

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

			object.onAfterRender( _this, scene, camera );

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], scene, camera, cameraCSSMatrix);

		}

	}

	var getDistanceToSquared = function () {

		var a = new Vector3();
		var b = new Vector3();

		return function ( object1, object2 ) {

			a.setFromMatrixPosition( object1.matrixWorld );
			b.setFromMatrixPosition( object2.matrixWorld );

			return a.distanceToSquared( b );

		};

	}();

	function filterAndFlatten( scene ) {

		var result = [];

		scene.traverse( function ( object ) {

			if ( object instanceof CSS3DObject ) result.push( object );

		} );

		return result;

	}

	function zOrder( scene ) {

		var sorted = filterAndFlatten( scene ).sort( function ( a, b ) {

			var distanceA = cache.objects.get( a ).distanceToCameraSquared;
			var distanceB = cache.objects.get( b ).distanceToCameraSquared;

			return distanceA - distanceB;

		} );

		var zMax = sorted.length;

		for ( var i = 0, l = sorted.length; i < l; i ++ ) {

			sorted[ i ].element.style.zIndex = zMax - i;

		}

	}

	this.render = function ( scene, camera ) {

		var fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

		if ( cache.camera.fov !== fov ) {

			if ( camera.isPerspectiveCamera ) {

				domElement.style.WebkitPerspective = fov + 'px';
				domElement.style.perspective = fov + 'px';

			} else {

				domElement.style.WebkitPerspective = '';
				domElement.style.perspective = '';

			}

			cache.camera.fov = fov;

		}

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		if ( camera.isOrthographicCamera ) {

			var tx = - ( camera.right + camera.left ) / 2;
			var ty = ( camera.top + camera.bottom ) / 2;

		}

		var cameraCSSMatrix = camera.isOrthographicCamera ?
			'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse ) :
			'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse );

		var style = cameraCSSMatrix +
			'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

		if ( cache.camera.style !== style && ! isIE ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.transform = style;

			cache.camera.style = style;

		}

		renderObject( scene, scene, camera, cameraCSSMatrix );

		if ( isIE ) {

			// IE10 and 11 does not support 'preserve-3d'.
			// Thus, z-order in 3D will not work.
			// We have to calc z-order manually and set CSS z-index for IE.
			// FYI: z-index can't handle object intersection
			zOrder( scene );

		}

	};

	this.renderXR = function ( scene, camera, pos) {

		var fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

		if ( cache.camera.fov !== fov ) {

			if ( camera.isPerspectiveCamera ) {

				domElement.style.WebkitPerspective = fov + 'px';
				domElement.style.perspective = fov + 'px';

			} else {

				domElement.style.WebkitPerspective = '';
				domElement.style.perspective = '';

			}

			cache.camera.fov = fov;

		}

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		if ( camera.isOrthographicCamera ) {

			var tx = - ( camera.right + camera.left ) / 2;
			var ty = ( camera.top + camera.bottom ) / 2;

		}

		var translation = getCameraTranslation( camera.matrixWorld );

		var x_pos = translation.x + pos.x;
		var y_pos = translation.y + pos.y;
		var z_pos = -translation.z;
		// console.log(pos)

		var cameraCSSMatrix = camera.isOrthographicCamera ?
			'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse) :
			'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse);

			var style = cameraCSSMatrix +
			'translate(' + pos.x + 'px,' + pos.y + 'px)';

		if ( cache.camera.style !== style && ! isIE ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.transform = style;

			cache.camera.style = style;

		}

		renderObject( scene, scene, camera, cameraCSSMatrix);

		if ( isIE ) {

			// IE10 and 11 does not support 'preserve-3d'.
			// Thus, z-order in 3D will not work.
			// We have to calc z-order manually and set CSS z-index for IE.
			// FYI: z-index can't handle object intersection
			zOrder( scene );

		}

	};

};

class UI {
    constructor(scene, camera, renderer, parentDom = document.body){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;   
        this.parentDom = parentDom;
        this.css3DRenderer = null;
        this.css3DScene = null;
        this.css3DStyle = null;
        this.cache = null;
        this.createRenderer(parentDom);
    }

    createRenderer(el){
        this.css3DScene = new THREE.Scene();

        this.css3DRenderer = new CSS3DRenderer();
        this.css3DRenderer.setSize( window.innerWidth, window.innerHeight );
        this.css3DRenderer.domElement.style.position = 'absolute';
        this.css3DRenderer.domElement.style.top = 0;
        this.css3DRenderer.domElement.id="CSS3Ddom";
        el.appendChild( this.css3DRenderer.domElement );

        var cameraElement = document.createElement( 'div' );

        cameraElement.style.WebkitTransformStyle = 'preserve-3d';
        cameraElement.style.transformStyle = 'preserve-3d';
        cameraElement.style.pointerEvents = 'none';

        this.css3DRenderer.domElement.appendChild( cameraElement );

     
        
        console.log(this.renderer);
    }

    update(){
        this.css3DRenderer.render( this.css3DScene, this.camera );
    }

    updateXR(){

        // var width = window.innerWidth, height = window.innerHeight;
        // var widthHalf = width / 2, heightHalf = height / 2;
        
		let pos = new THREE.Vector3();
		pos = pos.setFromMatrixPosition(this.scene.matrixWorld);
		this.camera.updateMatrixWorld();
		pos.project(this.camera);
		
		let widthHalf = this.renderer.domElement.offsetWidth / 2;
		let heightHalf = this.renderer.domElement.offsetHeight / 2;

		pos.x = ( pos.x + 1) * widthHalf;
		pos.y = - ( pos.y - 1) * heightHalf;
		// pos.x = (pos.x * widthHalf) + widthHalf;
		// pos.y = - (pos.y * heightHalf) + heightHalf;
		pos.z = new THREE.Vector3().distanceTo(this.camera.position);
		// console.log(pos)
		// console.log(this.camera.quaternion);
        this.css3DRenderer.renderXR( this.css3DScene, this.camera, pos);                  
		// this.css3DRenderer.render( this.css3DScene, this.camera);  
        // if(pos.x != NaN){
        //     // this.css3DStyle.transformOrigin = pos.x + "px " + pos.y + "py";
        //     this.css3DRenderer.domElement.children[0].style.translateX = pos.x + "px "; 
        //     // pos.y + "py";
        // }
    }

    
    async createUIElement(el, type = "dom"){

        var domObject;

        if(type == "dom"){
            domObject = new CSS3DObject( el );
        }else if(type == "html-string"){
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(el, 'text/html');
            domObject = new CSS3DObject( htmlDoc.body );
        }else if(type == "html-file"){
            try{
                let text = await this.requestFile(el);
                let parser = new DOMParser();
                let htmlDoc = parser.parseFromString(text, 'text/html');
                domObject = new CSS3DObject( htmlDoc.body );
                console.log(domObject);
            }catch(error){
                console.log("Error fetching remote HTML: ", error);
            }
        }

		// domObject.position.set(0,0,20);
        // var material = new THREE.MeshPhongMaterial({
        //     opacity: 1,
        //     // opacity	: 0,
        //     color	: new THREE.Color('black'),
        //     blending: THREE.NoBlending,
        //     side	: THREE.DoubleSide,
        // });
        // var geometry = new THREE.PlaneGeometry( 100, 100 );
        // var mesh = new THREE.Mesh( geometry, material );
        // mesh.position.copy( domObject.position );
        // mesh.rotation.copy( domObject.rotation );
        // mesh.castShadow = false;
        // mesh.receiveShadow = true;

        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new THREE.Mesh( geometry, material );
        // scene.add( cube );

        return {
            domObject: domObject,
            clippingMesh: mesh,
            position: new THREE.Vector3().copy(domObject.position),
            rotation: new THREE.Euler().copy(domObject.rotation),
            scale: new THREE.Vector3().copy(domObject.scale)
        } 
    }

    requestFile(el){
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', el);
            xhr.onload = function () {
                var status = xhr.status;
                if (status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(status);
                }
            };
            xhr.send();
        });
    }
    
    add(obj){
        obj.clippingMesh.position.copy(obj.position);
        obj.clippingMesh.rotation.copy(obj.rotation);
        obj.clippingMesh.scale.copy(obj.scale);

        obj.domObject.position.copy(obj.position);
        obj.domObject.rotation.copy(obj.rotation);
        obj.domObject.scale.copy(obj.scale);

        // this.scene.add(obj.clippingMesh);
        this.css3DScene.add(obj.domObject);
    }

}

export default { CSS3DObject, CSS3DSprite, CSS3DRenderer, UI };