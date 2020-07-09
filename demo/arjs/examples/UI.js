import * as THREE from "../node_modules/three/build/three.module.js"
import { CSS3DRenderer, CSS3DObject} from '../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';

// console.log(CSS3DRenderer)
// CSS3DRenderer.prototype.renderXR = function ( scene, camera, x, y, params) {
    
//     var fov = camera.projectionMatrix.elements[ 5 ] * params.heightHalf;

//     if ( params.cache.camera.fov !== fov ) {

//         if ( camera.isPerspectiveCamera ) {

//             params.domElement.style.WebkitPerspective = fov + 'px';
//             params.domElement.style.perspective = fov + 'px';

//         } else {

//             params.domElement.style.WebkitPerspective = '';
//             params.domElement.style.perspective = '';

//         }

//         params.cache.camera.fov = fov;

//     }

//     if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
//     if ( camera.parent === null ) camera.updateMatrixWorld();

//     if ( camera.isOrthographicCamera ) {

//         var tx = - ( camera.right + camera.left ) / 2;
//         var ty = ( camera.top + camera.bottom ) / 2;

//     }

//     var cameraCSSMatrix = camera.isOrthographicCamera ?
//         'scale(' + fov + ')' + 'translate(' + epsilon( x ) + 'px,' + epsilon( y ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse ) :
//         'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse );

//     var style = cameraCSSMatrix +
//         'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

//     if ( params.cache.camera.style !== style && ! isIE ) {

//         params.cameraElement.style.WebkitTransform = style;
//         params.cameraElement.style.transform = style;

//         params.cache.camera.style = style;

//     }
//     // console.log("a")
//     renderObject( scene, scene, camera, cameraCSSMatrix );

//     if ( isIE ) {

//         // IE10 and 11 does not support 'preserve-3d'.
//         // Thus, z-order in 3D will not work.
//         // We have to calc z-order manually and set CSS z-index for IE.
//         // FYI: z-index can't handle object intersection
//         zOrder( scene );

//     }

// };


export default class UI {
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

        console.log(THR)
        
        console.log(this.css3DRenderer);
    }

    update(){
        this.css3DRenderer.render( this.css3DScene, this.camera );
    }

    updateXR(){
        var width = window.innerWidth, height = window.innerHeight;
        var widthHalf = width / 2, heightHalf = height / 2;
        
        var pos = new THREE.Vector3();
		pos.project(this.camera);
		pos.x = ( pos.x * widthHalf ) + widthHalf;
        pos.y = - ( pos.y * heightHalf ) + heightHalf;
        
        // this.css3DRenderer.renderXR( this.css3DScene, this.camera, pos.x, pos.y );                   

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