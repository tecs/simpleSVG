simpleSVG
=========

*Copyright (c) 2013 Alexander Ivanov*
 
This code is distributed under the MIT License. For more info check:  
http://opensource.org/licenses/mit-license.php

A simple library to create and manipulate SVG objects

# Usage #

To initialize the simpleSVG object:  
`var svg = new simpleSVG('elementId',width,height);`  
Or using:  
`var svg = new simpleSVG(document.body,width,height);`

Create a 10x20 named rectangle at 30x40 and set some properties:  
`svg.rect(30,40,10,20,"myRectangle").stroke("red").fill("white");`  

Rotate the simpleSVGnode:  
`svg.node("myRectangle").set("transform","rotate(35,50,45)");`  

Delete the node:  
`svg.del("myRectangle");`  


# Documentation #

## constructor ##

**simpleSVG**( *string* **id** [ , *int* **width** = auto, *int* **height** = auto ] )  
**simpleSVG**( *object* **node** [ , *int* **width** = auto, *int* **height** = auto ] )  
*Initializes and returns a simpleSVG object.*   

*string* **id**
>the id of the parent HTML node in which the SVG node will be created  

*object* **node**   
>parent HTML node in which the SVG node will be created  

*int* **width**   
>the width of the SVG element to be created, default value is the width of the parent element  

*int* **height**   
>the height of the SVG element to be created, default value is the height of the parent element  

**returns** a *simpleSVG* object  


## main methods ##

**.destroy**()  
*Destroys the SVG object and its child elements.*  
____


**.clear**()  
*Clears the rendering surface, destroying all child elements.*  
____


**.node**( *object* **node** )  
**.node**( *string* **name** )  
*Selects and returns a simpleSVGnode*  

*string* **name**  
>the name of the node  

*object* **node**  
>SVG child node  

**returns** a *simpleSVGnode*   
____


**.del**( *string* **name** )  
*Destroys* a SVG child node*

*string* **name**  
>the name of the node  


## drawing API ##

Each of the following methods described below, supports giving a name to the created *simpleSVGnode* as the last argument. It is advised to set the names of the objects if you plan on using them later with the **.node** or **.del** methods. As an alternative, you can assign the return value of these methods and use them via a variable.

All *simpleSVGnodes* created without a name, are named with an automatically generated identifier using the following convention: unnamedObject1, unnamedObject2, unnamedObject3...

Creating a *simpleSVGnode* with a name that is already taken will replace the old object.

____

**.path**( *array* **path** [ , *string* **name** = "unnamedObject"+N ] )  
*Draws a simpleSVGnode path node*  

*array* **path**  
>an array containing a series of x,y coordinates either in [x1,y1,x2,y2,x3,y3...] or [[x1,y1],[x2,y2],[x3,y3]...] format  

*string* **name**  
>the name of the node  

**returns** a *simpleSVGnode*   
____


**.text**( *int* **x**, *int* **y**, *string* **text** [ , *string* **name** = "unnamedObject"+N ] )  
*Draws a simpleSVGnode text node*  

*int* **x**  
>X coordinate for top-left point  

*int* **y**  
>Y coordinate for top-left point  

*string* **text**  
>the text to draw  

*string* **name**  
>the name of the node  

**returns** a *simpleSVGnode*   
____


**.rect**( *int* **x**, *int* **y**, *int* **width**, *int* **height** [ , *string* **name** = "unnamedObject"+N ] )  
*Draws a simpleSVGnode rectangle node*  

*int* **x**  
>X coordinate for top-left point  

*int* **y**  
>Y coordinate for top-left point  

*int* **width**  
>width of the rectangle  

*int* **height**  
>height of the rectangle  

*string* **name**  
>the name of the node  

**returns** a *simpleSVGnode*   
____


**.circle**( *int* **x**, *int* **y**, *int* **r** [ , *string* **name** = "unnamedObject"+N ] )  
*Draws a simpleSVGnode circle node*  

*int* **x**  
>X coordinate for center point  

*int* **y**  
>Y coordinate for center point  

*int* **r**  
>radius of the circle  

*string* **name**  
>the name of the node  

**returns** a *simpleSVGnode*   
____


**.ellipse**( *int* **x**, *int* **y**, *int* **rx**, *int* **ry** [ , *string* **name** = "unnamedObject"+N ] )  
*Draws a simpleSVGnode ellipse node*  

*int* **x**  
>X coordinate for center point  

*int* **y**  
>Y coordinate for center point  

*int* **rx**  
>horizontal radius of the ellipse  

*int* **ry**  
>vertical radius of the ellipse  

*string* **name**  
>the name of the node  

**returns** a *simpleSVGnode*   


## simpleSVGnode setters ##

The following are methods of the *simpleSVGnode* objects. They can be used on the result of **.node** and all of the drawing API functions, and can be chained together in the following fashion: *simpleSVGnode*.**fill( color )**.**stroke( color )**.**hover( null , fn2 )** etc...

**.set**( *string* **property**, *string* **value** )  
*Sets arbitrary properties of the simpleSVGnode*  

*string* **property**  
>the name of the property  

*string* **value**  
>the desired value to be set  

**returns** a *simpleSVGnode*   
____


**.stroke**( *string* **color** )  
*Sets the stroke property of the simpleSVGnode*  

*string* **color**  
>the color in either hex, rgb or named color format (and their respective alpha-enabled versions)  

**returns** a *simpleSVGnode*   
____


**.fill**( *string* **color** )  
*Sets the fill property of the simpleSVGnode*  

*string* **color**  
>the color in either hex, rgb or named color format (and their respective alpha-enabled versions)  

**returns** a *simpleSVGnode*   
____


**.css**( *object* **options** )  
**.css**( *string* **property**, *string* **value** )  
*Sets CSS properties for simpleSVGnodes*  

*object* **options**  
>object containing pairs of CSS property names and values like {border: "1px solid black", marginRight: "1px"}  

*string* **property**  
>name of the CSS property in either "margin-right" of "marginRight" format  

*string* **value**  
>the desired value to be set  

**returns** a *simpleSVGnode*   
____


**.hover**( [ *function* **mouseover** = skip, *function* **mouseout** = skip ] )  
*Assigns hover events to a simpleSVGnode*  

*function* **mouseover**  
>event to fire when the mouse enters the object  

*function* **mouseout**  
>event to fire when the mouse leaves the object  

**returns** a *simpleSVGnode*   
____


**.click**( [ *function* **mousedown** = skip, *function* **mouseup** = skip ] )  
*Assigns click events to a simpleSVGnode*  

*function* **mousedown**  
>event to fire on mouse click  

*function* **mouseup**  
>event to fire on mouse release  

**returns** a *simpleSVGnode*   