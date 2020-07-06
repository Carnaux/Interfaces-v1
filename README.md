# Interfaces

This is a library to create dynamic HTML interfaces for Three.js scenes. Also you can use it with Vue.js!

Based on trusktr example: https://jsfiddle.net/trusktr/jc6j1wmf/

## What it does

The library creates a scene and a renderer using the CSS3DRenderer, then it adds the CSS3DRenderer.domElement to the main HTML.

## Usage

### Install 

```
    npm install web-interfaces
```

### Code

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
        It can be a DOM Element, a HTML string, a path for a HTML file or a Vue component(Only if you are using the vue version)
    - Type
        Especifies the type of the Element variables:
            *dom* for DOM Element
            *html-string* for a HTML string
            *html-file* for a HTML File
            *vue* for a Vue component
    
    The function returns a promise so you need to use ´then´ to add the element to the scene.
    The returned variable is an object:
        uiEl = {
            domObject: The converted HTML Element.(CSS3DObject)
            clippingMesh: This is a required mesh for interaction of the domObject with your objects on the main scene.(Three.Mesh)
            position: The position vector to keep the clippingMesh with the domObject.(Three.Vector3)
            rotation: The rotation vector to keep the clippingMesh with the domObject.(Three.Euler)
            scale: The scale vector to keep the clippingMesh with the domObject.(Three.Vector3)
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

For more detailed use checkout the demos at: 
<!-- let el = "<div style='width:100px; height:100px; background-color: red;'><button>sasas</button></div>" -->
 