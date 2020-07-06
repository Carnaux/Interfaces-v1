import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

export default class UI {
    constructor(scene, camera, renderer, parentDom = document.body){
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;   
        this.parentDom = parentDom;
        this.css3DRenderer = null;
        this.css3DScene = null;
        this.createRenderer(parentDom);
    }

    createRenderer(el){
        this.css3DScene = new THREE.Scene();

        this.css3DRenderer = new CSS3DRenderer();
        this.css3DRenderer.setSize( window.innerWidth, window.innerHeight );
        this.css3DRenderer.domElement.style.position = 'absolute';
        this.css3DRenderer.domElement.style.top = 0;
        el.appendChild( this.css3DRenderer.domElement );
    }

    update(){
        this.css3DRenderer.render( this.css3DScene, this.camera );
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

        var material = new THREE.MeshPhongMaterial({
            opacity: 0.2,
            // opacity	: 0,
            color	: new THREE.Color('black'),
            blending: THREE.NoBlending,
            side	: THREE.DoubleSide,
        });
        var geometry = new THREE.PlaneGeometry( 100, 100 );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.copy( domObject.position );
        mesh.rotation.copy( domObject.rotation );
        mesh.castShadow = false;
        mesh.receiveShadow = true;

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

        this.scene.add(obj.clippingMesh);
        this.css3DScene.add(obj.domObject);
    }

}