# To Run the demos

1. Clone the repo.

2. Install the demos

    Open a terminal on the demo folder and then:

    2.1 Run `npm run install-demo` to install all demos. It might take a while because of the Vue installation.

    2.2 Run `npm run install-three` to install just the three.js demo.
   
    2.3 Run `npm run install-vue` to install just the vue demo. It might take a while!

        To run the Vue demo open a terminal in the vue folder and run `npm run serve` and go to `localhost:8080`.
    
    2.4 Run `npm run install-arjs` to install just the AR.js demo.

#### All demos are standalone, so you can use them as templates!

## Some code snippets

#### Available types:

1. *dom* for DOM Element

```
    let el = document.getElementById("div");
    ui.createUIElement(el, "dom").then( uiEl => {
        ui.add(uiEl);
    });
```
        
2. *html-string* for a HTML string

```
    let el = "<div style='width:100px; height:100px; background-color: red;'><button>test</button></div>"
    ui.createUIElement(el, "html-string").then( uiEl => {
        ui.add(uiEl);
    });
```

3. *html-file* for a HTML File

```
    let el = "./path/to/file.html"
    ui.createUIElement(el, "html-file").then( uiEl => {
        ui.add(uiEl);
    });
```
4. *vue* for a Vue component

```
    import HtmlPanel from './panel.vue'

    ...

    ui.createUIElement(HtmlPanel, "vue").then( uiEl => {
        ui.add(uiEl);
    });
```