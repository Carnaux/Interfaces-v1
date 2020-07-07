//  based on trusktr https://jsfiddle.net/trusktr/jc6j1wmf/
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import UI from './UI.js';

let ui;

var camera, scene, renderer;

var windowHalfX, windowHalfY;

var controls;

var sphere;

var lights = [];

init();
animate(performance.now());

function init() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 1, 2000
    );
    camera.position.set( 0, 0, 500 );

    scene = new THREE.Scene();

    var material = new THREE.MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x000000,
        specular: 0x111111,
        side: THREE.DoubleSide,
        flatShading: false,
        shininess: 30,
    });
    var geometry = new THREE.SphereGeometry( 70, 32, 32 );
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = 100;
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    scene.add( sphere );
    
    var ambientLight = new THREE.AmbientLight( 0x000000 );
    scene.add( ambientLight );

    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 0 ].castShadow = true;
    lights[ 0 ].position.z = 300;
    lights[ 0 ].shadow.mapSize.width = 256;  // default
    lights[ 0 ].shadow.mapSize.height = 256; // default
    lights[ 0 ].shadow.camera.near = 1;       // default
    lights[ 0 ].shadow.camera.far = 2000;      // default
    scene.add( lights[ 0 ] );

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.getElementById("webgl").appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );

    ui = new UI(scene, camera, renderer, document.getElementById("css"));

    let el = "<div style='width:100px; height:100px; background-color: red;'><button>sasas</button></div>"

    ui.createUIElement(el, "html-string").then( uiel => {
        ui.add(uiel);
    });

}

function animate(time) {
    
    lights[ 0 ].position.x = 200 * Math.sin(time * 0.003);
    lights[ 0 ].position.y = 200 * Math.cos(time * 0.002);

    scene.updateMatrixWorld()

    controls.update();

    ui.update();

    renderer.render( scene, camera );

    requestAnimationFrame( animate );
}

