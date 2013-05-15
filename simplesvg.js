/* 
 * simpleSVG
 * Copyright (c) 2013 Alexander Ivanov
 * 
 * This code is distributed under the MIT License. For more info check:
 * http://opensource.org/licenses/mit-license.php
 */

(function(window,undefined) {
	var simpleSVG = function(object, width, height) {
		simpleSVGnode.prototype.that = this;
		
		if(t(object,'string')) object=document.getElementById(object);
		this.object = object;
		
		this.width = (t(width,'number')) ? width : this.object.clientWidth;
		this.height = (t(height,'number')) ? height : this.object.clientHeight;	
		
		this.ns = 'http://www.w3.org/2000/svg';
		
		this.createSurface();
		
		this.pool = {};
		this.poolIndex = 0;
	}
	var simpleSVGnode = function(node) {
		this[0] = t(node,'string') ? this.that.pool[node] : node ;
		return this;
	}
	
	var cc = function(str) {
		var index=0;		
		while((index=str.indexOf('-')) != -1 ) str = str.substr(0,index) + str.substr(index+1,1).toUpperCase() +str.substr(index+2);
		return str;
	}
	var t = function(variable, type) {
		if(typeof(type)=='undefined') type = 'undefined';
		return typeof(variable) == type;
	}
	var toPath = function(xyArr) {
		if(xyArr.length==0) return '';
		
		var i, path = '', test = t(xyArr[0],'number');
		
		for(i=0; i<xyArr.length; ++i) {
			path += (path==''?'M':'L') + (test?xyArr[i]:xyArr[i][0]) + ',' + (test?xyArr[++i]:xyArr[i][1]);
		}
		
		return path;
	}
	
	simpleSVG.prototype.createSurface = function() {
		this.surface = document.createElementNS(this.ns,'svg');
		this.surface.setAttribute('width', this.width);
		this.surface.setAttribute('height', this.height);
		
		this.object.appendChild(this.surface);
	}
	simpleSVG.prototype.destroy = function() {
		this.pool = {};
		this.poolIndex = 0;
		this.object.removeChild(this.surface);
	}
	simpleSVG.prototype.clear = function() {
		this.destroy();
		this.createSurface();
	}

	simpleSVG.prototype.node = function(node) {	return new simpleSVGnode(node);	}
	simpleSVGnode.prototype.set = function(attribute, value) {
		this[0].setAttribute(attribute, value);
		return this;
	}
	simpleSVGnode.prototype.stroke = function(color) { return this.set('stroke', color); }
	simpleSVGnode.prototype.fill = function(color) { return this.set('fill', color); }
	simpleSVGnode.prototype.css = function(options, value) {
		if(t(options,'string')) {
			options = cc(options);
			this[0].style[options] = value;
		} else {
			for(var opt in options) {
				this[0].style[cc(opt)] = options[opt];
			}
		}
		
		return this;
	}
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
	
	simpleSVG.prototype.del = function(name) {
		this.surface.removeChild(this.pool[name]);
		delete(this.pool[name]);
	}
	simpleSVG.prototype.add = function(obj, name) {
		if (!t(name,'string')) name = 'unnamedObject'+(++this.poolIndex);
		
		if(t(this.pool[name])) this.surface.appendChild(obj);
		else this.surface.replaceChild(obj, this.pool[name]);
		
		this.pool[name] = obj;
		
		return new simpleSVGnode(this.pool[name]);
	}

	simpleSVG.prototype.path = function(xyArr, name) {	
		var path = toPath(xyArr);
		
		var obj = document.createElementNS(this.ns,'path');
		obj.setAttribute('d',path);
		obj.setAttribute('fill','none');
		obj.setAttribute('stroke','#000000');
		
		return this.add(obj,name);
	}
	simpleSVG.prototype.text = function(x,y,text,name) {
		var obj = document.createElementNS(this.ns,'text');
		obj.setAttribute('x',x);
		obj.setAttribute('y',y);
		obj.appendChild( document.createTextNode(text));
		
		return this.add(obj,name);
	}
	simpleSVG.prototype.rect = function(x,y,w,h,name) {
		var obj = document.createElementNS(this.ns,'rect');
		obj.setAttribute('x',x);
		obj.setAttribute('y',y);
		obj.setAttribute('width',w);
		obj.setAttribute('height',h);
		
		return this.add(obj,name);
	}
	simpleSVG.prototype.ellipse = function(x,y,rx,ry,name) {
		var obj = document.createElementNS(this.ns,'ellipse');
		obj.setAttribute('cx',x);
		obj.setAttribute('cy',y);
		obj.setAttribute('rx',rx);
		obj.setAttribute('ry',ry);
		
		return this.add(obj,name);
	}
	simpleSVG.prototype.circle = function(x,y,r,name) {	return this.ellipse(x,y,r,r,name); }
	window.simpleSVG = simpleSVG;
})(window);