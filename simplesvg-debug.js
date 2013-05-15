/* 
 * simpleSVG
 * Copyright (c) 2013 Alexander Ivanov
 * 
 * This code is distributed under the MIT License. For more info check:
 * http://opensource.org/licenses/mit-license.php
 */

// do not pollute the global scope
(function(window,undefined) {
	// the main constructor
	var simpleSVG = function(object, width, height) {
		// expose the whole simpleSVG instance to the simpleSVGnode object
		simpleSVGnode.prototype.that = this;
		
		// get parent by id or by node
		if(t(object,'string')) object=document.getElementById(object);
		this.object = object;
		
		// get width and height if passed as arguments, else get the parent's width and height
		this.width = (t(width,'number')) ? width : this.object.clientWidth;
		this.height = (t(height,'number')) ? height : this.object.clientHeight;	
		
		// SVG namespace
		this.ns = 'http://www.w3.org/2000/svg';
		
		// create and append the SVG object to the parent
		this.createSurface();
		
		// initialize the node pool
		this.pool = {};
		this.poolIndex = 0;
	}
	
	// simple wrapper for the SVG child nodes
	// we need another object because we want to limit the chaining API only to nodes and not pollute the main simpleSVG object
	var simpleSVGnode = function(node) {
		// get node by object or string (from the pool)
		this[0] = t(node,'string') ? this.that.pool[node] : node ;
		return this;
	}
	
	// convert dashed properties to camelCase, used in the .css method
	var cc = function(str) {
		var index=0;
		
		// while there are dashes left in the string, remove them and uppercase the following letter
		while((index=str.indexOf('-')) != -1 ) str = str.substr(0,index) + str.substr(index+1,1).toUpperCase() +str.substr(index+2);
		return str;
	}
	
	// wrapper for typeof, which matches a variable's type with a string argument and returns true or false
	// when the second argument is ommited, the variable is tested against the 'undefined' type
	var t = function(variable, type) {
		if(typeof(type)=='undefined') type = 'undefined';
		return typeof(variable) == type;
	}
	
	// converts an array in either [x1,y1,x2,y2,x3,y3...] or [[x1,y1],[x2,y2],[x3,y3]...] format to a "Mx1,y1Lx2,y2,Lx3,y3..." format suitable for SVG paths
	var toPath = function(xyArr) {
		if(xyArr.length==0) return '';
		
		// determine the format of our array
		var i, path = '', test = t(xyArr[0],'number');
		
		for(i=0; i<xyArr.length; ++i) {
			path += (path==''?'M':'L') + (test?xyArr[i]:xyArr[i][0]) + ',' + (test?xyArr[++i]:xyArr[i][1]);
		}
		
		return path;
	}
	
	// creates and appends the SVG object to the parent
	simpleSVG.prototype.createSurface = function() {
		// SVG objects should be created using a namespace via the .createElementNS method, otherwise they don't really work
		// also attributes should probably be set with the .setAttributeNS method, but meh...
		this.surface = document.createElementNS(this.ns,'svg');
		this.surface.setAttribute('width', this.width);
		this.surface.setAttribute('height', this.height);
		
		this.object.appendChild(this.surface);
	}
	
	// cleans up our simpleSVG object and removes the SVG HTML node
	// the object can be reinitialized again by calling the variable as a function which corresponds to its constructor - simpleSVG() 
	// to permanently destroy the instance, delete the variable and all referrences to it, which should make the garbage collector to free its memory
	simpleSVG.prototype.destroy = function() {
		this.pool = {};
		this.poolIndex = 0;
		this.object.removeChild(this.surface);
	}
	
	// cleans everything drawn on the SVG surface
	simpleSVG.prototype.clear = function() {
		this.destroy();
		this.createSurface();
	}

	// a wrapper for the simpleSVGnode object, used to allow its use without exposing it globally
	// also - a wrapper for a wrapper...
	simpleSVG.prototype.node = function(node) {
		/* WARNING
		 * after minifying replace the return statement with
		 * function simpleSVGnode(a) {return a};return new simpleSVGnode(...
		 * otherwise the name of simpleSVGnode object name will be minified and we dont want that...
		 * WARNING */
		return new simpleSVGnode(node);
	}
	
	// now it is very important to return this in all of the methods of the simpleSVGnode object that need to be chain-enabled
	// all of the following methods are prototypes of simpleSVGnode, so they are accessible via the this keyword
	// returning this in each of them, allows us to call another one directly from the previous one and so on
	
	// interface for setting attributes to the SVG child nodes
	simpleSVGnode.prototype.set = function(attribute, value) {
		this[0].setAttribute(attribute, value);
		return this;
	}
	
	// these are predefined aliases for the stroke and fill properties
	simpleSVGnode.prototype.stroke = function(color) { return this.set('stroke', color); }
	simpleSVGnode.prototype.fill = function(color) { return this.set('fill', color); }
	
	// CSS setter
	simpleSVGnode.prototype.css = function(options, value) {
		if(t(options,'string')) { // a property, value pair is given
			// camelCase for compatibility
			options = cc(options);
			this[0].style[options] = value;
		} else { // an option object is given
			// unlike php, javascript sets opt to the property name, not the value
			for(var opt in options) {
				this[0].style[cc(opt)] = options[opt];
			}
		}
		
		return this;
	}
	
	// handlers for the hover and click events
	simpleSVGnode.prototype.hover = function(fn,fn2) {
		if(fn) this[0].onmouseover = fn;
		if(fn2) this[0].onmouseout = fn2;
		return this;
	}
	simpleSVGnode.prototype.click = function(fn,fn2) {
		if(fn) this[0].onmousedown = fn;
		if(fn2) this[0].onmouseup = fn2;
		return this;
	}
	
	// deletes a SVG child node and removes it from the pool
	simpleSVG.prototype.del = function(name) {
		this.surface.removeChild(this.pool[name]);
		delete(this.pool[name]);
	}
	
	// wrapper for adding arbitrary nodes to the SVG object
	simpleSVG.prototype.add = function(obj, name) {
		// generate a name if not given
		if (!t(name,'string')) name = 'unnamedObject'+(++this.poolIndex);
		
		// append the node to the SVG object
		// if the name is taken, replace the existing object
		if(t(this.pool[name])) this.surface.appendChild(obj);
		else this.surface.replaceChild(obj, this.pool[name]);
		
		this.pool[name] = obj;
		
		/* WARNING
		 * after minifying replace the return statement with
		 * function simpleSVGnode(a) {return a};return new simpleSVGnode(...
		 * otherwise the name of simpleSVGnode object name will be minified and we dont want that...
		 * WARNING */
		return new simpleSVGnode(this.pool[name]);
	}

	// creates a path, can be also used as a line
	// creating lines with paths has a huge benefit - you can easily add more segments later or convert it to a closed shape
	// also bezier curves! (not implemented yet)
	simpleSVG.prototype.path = function(xyArr, name) {
		// normalize the array
		var path = toPath(xyArr);
		
		var obj = document.createElementNS(this.ns,'path');
		obj.setAttribute('d',path);
		
		// some sensible defaults?
		obj.setAttribute('fill','none');
		obj.setAttribute('stroke','#000000');
		
		// attach the node
		return this.add(obj,name);
	}
	
	// creates a text node
	simpleSVG.prototype.text = function(x,y,text,name) {
		var obj = document.createElementNS(this.ns,'text');
		obj.setAttribute('x',x);
		obj.setAttribute('y',y);
		
		// .createTextNode is the proper way to insert some text inside a tag, not .innerHTML
		// it is magical in its ability to properly escape HTML-breaking characters and sequences...
		obj.appendChild( document.createTextNode(text));
		
		return this.add(obj,name);
	}
	
	// creates a rectangle node
	simpleSVG.prototype.rect = function(x,y,w,h,name) {
		var obj = document.createElementNS(this.ns,'rect');
		obj.setAttribute('x',x);
		obj.setAttribute('y',y);
		obj.setAttribute('width',w);
		obj.setAttribute('height',h);
		
		return this.add(obj,name);
	}
	
	// creates an ellipse node
	simpleSVG.prototype.ellipse = function(x,y,rx,ry,name) {
		var obj = document.createElementNS(this.ns,'ellipse');
		obj.setAttribute('cx',x);
		obj.setAttribute('cy',y);
		obj.setAttribute('rx',rx);
		obj.setAttribute('ry',ry);
		
		return this.add(obj,name);
	}
	
	// creates a circle node, actually a wrapper for .ellipse for greater flexibility in the future
	simpleSVG.prototype.circle = function(x,y,r,name) {	return this.ellipse(x,y,r,r,name); }
	window.simpleSVG = simpleSVG;
})(window);