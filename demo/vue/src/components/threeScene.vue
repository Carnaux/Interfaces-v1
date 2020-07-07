<template>
    <div id="renderElement">
        <div id="css"></div>
        <div id="webgl"></div>
    </div>
</template>

<script>
// THREE Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import UI from '../UIVue.js';
import htmlPanel from './htmlPanel.vue';


export default {
    name: 'ThreeScene',
    components: {},
    data() {
        return {
            camera: null,
            scene: null,
            renderer: null,
            controls: null,
            ui: null
        }
    },
    methods: {
        initThree(){
            this.camera = new THREE.PerspectiveCamera(
                45, window.innerWidth / window.innerHeight, 1, 2000
            );
            this.camera.position.set( 0, 0, 500 );

            this.scene = new THREE.Scene();
            
            var material = new THREE.MeshPhongMaterial({
                color: 0x156289,
                emissive: 0x000000,
                specular: 0x111111,
                side: THREE.DoubleSide,
                flatShading: false,
                shininess: 30,
                
            })
            var geometry = new THREE.SphereGeometry( 70, 32, 32 );
            var sphere = new THREE.Mesh( geometry, material );
            sphere.position.z = 100;
            sphere.castShadow = true;
            sphere.receiveShadow = false;
            this.scene.add( sphere );
        
            // light
            
            var ambientLight = new THREE.AmbientLight( 0x000000 );
            this.scene.add( ambientLight );

            var lights = new THREE.PointLight( 0xffffff, 1, 0 );
            lights.castShadow = true;
            lights.position.z = 300;
            lights.shadow.mapSize.width = 256;  // default
            lights.shadow.mapSize.height = 256; // default
            lights.shadow.camera.near = 1;       // default
            lights.shadow.camera.far = 2000;      // default
            this.scene.add( lights );
            //

            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setClearColor( 0x000000, 0 );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
            document.getElementById('webgl').appendChild( this.renderer.domElement );

            let appEl = document.getElementById("app");

            this.controls = new OrbitControls( this.camera, appEl);

            this.ui = new UI(this.scene, this.camera, this.renderer, document.getElementById("css"));

            this.ui.createUIElement(htmlPanel, "vue").then( uiel => {
                this.ui.add(uiel);
            });

        },
        animate() {
            this.scene.updateMatrixWorld()

            this.controls.update();

            this.ui.update();

            this.renderer.render( this.scene, this.camera );

            requestAnimationFrame( this.animate );
        },
    },
    
    mounted(){
        this.initThree();
        this.animate();
    }

}
</script>


<style scoped>
#css, #webgl {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; 
    left: 0;
}
</style>