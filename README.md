# Interfaces

This is a library to create dynamic HTML interfaces for Three.js scenes. Also you can use it with Vue.js!

Based on trusktr example: https://jsfiddle.net/trusktr/jc6j1wmf/

## Usage

It depends on Three.js and CSS3DRenderer modules!

import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

If you are not using a node based application change the paths to relative ones. e.g, './node_modules/three/build/three.module.js'

### Install 

```
    npm install web-interfaces
```

### Code

I only tested with the following structure:

index.html <-- In your main app, where you have the three.js scene

    <body>
        <div id="webgl"></div> <-- Put your three.js scene inside here
        <div id="css3d"></div> <-- The element you will pass when instatiating the class. see section 2
    </body>

Both of these divs should overlap, so i use this css:

    #css, #webgl {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0; left: 0;
    }

This structure is shown in the three.js demo.

1. Import

```
    import UI from './UI.js';

    or

    import UI from './UIVue.js';
```

2. Instantiate

```
    let ui = new UI(scene, camera, renderer, parentElement);   
```
    - scene, camera, renderer 
            From your main scene
    - parentElement
            If you want to append the CSS3DRenderer into an element. Default = document.body.

3. Create an Ui element

```
    ui.createUIElement( element, type ).then( uiEl => {
        ui.add(uiEl);
    });
```
    - Element 
        It can be a DOM Element, a HTML string, a path for a HTML file or 
        a Vue component(Only if you are using the vue version)
    - Type
        Especifies the type of the Element variables:
            *dom* for DOM Element
            *html-string* for a HTML string
                let el = "<div style='width:100px; height:100px; background-color: red;'><button>sasas</button></div>"
            *html-file* path for a HTML File
                let path = "./index.html"
            *vue* for a Vue component
    
    The function returns a promise so you need to use ´then´ to add the element to the scene.

    The returned variable is an object:
        uiEl = {
            domObject: The converted HTML Element.(CSS3DObject)
            clippingMesh: This is a required mesh for interaction of the domObject with your objects on the main scene.(Mesh)
            position: The position vector to keep the clippingMesh with the domObject.(Vector3)
            rotation: The rotation vector to keep the clippingMesh with the domObject.(Three.Euler)
            scale: The scale vector to keep the clippingMesh with the domObject.(Vector3)
        }


    If you want to reposition the element you should do:
```
        ui.createUIElement( element, type ).then( uiEl => {
            uiEl.position.set(x,y,z);
            ui.add(uiEl);
        });
```
4. Update

```
    function animate(){

        ui.update(); <-- Always before the renderer

        renderer.render( scene, camera );
    }
    
```

### More things:

If you disable the pointer events of your main three.js scene, you can click click in html elements(Inputs, buttons and so on);

# For more detailed uses checkout the demo folder!
 
