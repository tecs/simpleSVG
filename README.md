simpleSVG
=========

Copyright (c) 2013 Alexander Ivanov
 
This code is distributed under the MIT License. For more info check:  
http://opensource.org/licenses/mit-license.php

A simple library to create and manipulate SVG objects

## Usage

To initialize the simpleSVG object:  
`var svg = new simpleSVG('elementId',width,height);`  
Or using:  
`var svg = new simpleSVG(document.body,width,height);`

## Documentation

### constructor

**simpleSVG**( *string* **id**, *int* **width**, *int* **height** )  
**simpleSVG**( *object* **node**, *int* **width**, *int* **height** )  


### main methods

**.destroy**()  
>Destroys the SVG object and its child elements.

**.clear**()  
>Clears the rendering surface, destroying all child elements.

**.node**( *simpleSVGnode* **node** )  
**.node**( *string* **name** )  
>Selects a
* returns a *simpleSVGnode*


### drawing API

.path(xyArr, name)  
.text(x,y,text,name)
.rect(x,y,w,h,name)
.ellipse(x,y,rx,ry,name)
.circle(x,y,r,name)
.del(name)  

### simpleSVGnode setters

.set(attribute, value)  
.stroke(color)  
.fill(color)  
.css(options, value)  
.hover(fn,fn2)  
.click(fn,fn2)  