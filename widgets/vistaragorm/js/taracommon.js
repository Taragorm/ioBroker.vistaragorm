/**
 * Common colour handling
 */


var taragorm_common = {
//var taragorm_common = taragorm_common || {
        version : 7,

    NANColor : { b: "gray", f:"black"},

    $error: [
    	{ t:1e32, b: 0xff00ff }
    ],

    /**
     * Indoor temperature standard vector
     */
    $indoor: [
    	{ t:13, b: 0x1E90FF, f:0x0000 },
    	{ t:17, b: 0x00e000, f:0x0000 },
    	{ t:21, b: 0xdddd00, f:0x0000 },
    	{ t:25, b: 0xff0000, f:0x0000 }
    ],    
    
    $outbuilding: [
    	{ t:10, b: 0x1E90FF, f:0x0000 },
    	{ t:14, b: 0x00e000, f:0x0000 },
    	{ t:18, b: 0xdddd00, f:0x0000 },
    	{ t:26, b: 0xff0000, f:0x0000 }
    ],    
    
    /**
     * Outdoor temperature standard vector
     */
    $outdoor: [
    	{ t:8,  b: 0x1E90FF, f:0x0000 },
    	{ t:12, b: 0x00e000, f:0x0000 },
    	{ t:18, b: 0xdddd00, f:0x0000 },
    	{ t:22, b: 0xff0000, f:0x0000 }
    ],    

    /**
     * Laser coolant temperature standard vector
     */
    $laser: [
    	{ t:12, b: 0x1E90FF, f:0x0000 },
    	{ t:24, b: 0x00e000, f:0x0000 },
    	{ t:26, b: 0xdddd00, f:0x0000 },
    	{ t:30, b: 0xff0000, f:0x0000 }
    ],    
    
    /**
     * Return highest version object of this and the other one.
     * @param {tara_common} other 
     */
    resolve: function(other) {
        return (!other || this.version > other.version) ? this : other;
    },

    colourNameToRGBHex : function (colour)
    {
        var colours = {
            "aliceblue":0xf0f8ff,"antiquewhite":0xfaebd7,"aqua":0x00ffff,"aquamarine":0x7fffd4,"azure":0xf0ffff,
            "beige":0xf5f5dc,"bisque":0xffe4c4,"black":0x000000,"blanchedalmond":0xffebcd,"blue":0x0000ff,"blueviolet":0x8a2be2,"brown":0xa52a2a,"burlywood":0xdeb887,
            "cadetblue":0x5f9ea0,"chartreuse":0x7fff00,"chocolate":0xd2691e,"coral":0xff7f50,"cornflowerblue":0x6495ed,"cornsilk":0xfff8dc,"crimson":0xdc143c,"cyan":0x00ffff,
            "darkblue":0x00008b,"darkcyan":0x008b8b,"darkgoldenrod":0xb8860b,"darkgray":0xa9a9a9,"darkgreen":0x006400,"darkkhaki":0xbdb76b,"darkmagenta":0x8b008b,"darkolivegreen":0x556b2f,
            "darkorange":0xff8c00,"darkorchid":0x9932cc,"darkred":0x8b0000,"darksalmon":0xe9967a,"darkseagreen":0x8fbc8f,"darkslateblue":0x483d8b,"darkslategray":0x2f4f4f,"darkturquoise":0x00ced1,
            "darkviolet":0x9400d3,"deeppink":0xff1493,"deepskyblue":0x00bfff,"dimgray":0x696969,"dodgerblue":0x1e90ff,
            "firebrick":0xb22222,"floralwhite":0xfffaf0,"forestgreen":0x228b22,"fuchsia":0xff00ff,
            "gainsboro":0xdcdcdc,"ghostwhite":0xf8f8ff,"gold":0xffd700,"goldenrod":0xdaa520,"gray":0x808080,"green":0x008000,"greenyellow":0xadff2f,
            "honeydew":0xf0fff0,"hotpink":0xff69b4,
            "indianred ":0xcd5c5c,"indigo":0x4b0082,"ivory":0xfffff0,"khaki":0xf0e68c,
            "lavender":0xe6e6fa,"lavenderblush":0xfff0f5,"lawngreen":0x7cfc00,"lemonchiffon":0xfffacd,"lightblue":0xadd8e6,"lightcoral":0xf08080,"lightcyan":0xe0ffff,"lightgoldenrodyellow":0xfafad2,
            "lightgrey":0xd3d3d3,"lightgreen":0x90ee90,"lightpink":0xffb6c1,"lightsalmon":0xffa07a,"lightseagreen":0x20b2aa,"lightskyblue":0x87cefa,"lightslategray":0x778899,"lightsteelblue":0xb0c4de,
            "lightyellow":0xffffe0,"lime":0x00ff00,"limegreen":0x32cd32,"linen":0xfaf0e6,
            "magenta":0xff00ff,"maroon":0x800000,"mediumaquamarine":0x66cdaa,"mediumblue":0x0000cd,"mediumorchid":0xba55d3,"mediumpurple":0x9370d8,"mediumseagreen":0x3cb371,"mediumslateblue":0x7b68ee,
            "mediumspringgreen":0x00fa9a,"mediumturquoise":0x48d1cc,"mediumvioletred":0xc71585,"midnightblue":0x191970,"mintcream":0xf5fffa,"mistyrose":0xffe4e1,"moccasin":0xffe4b5,
            "navajowhite":0xffdead,"navy":0x000080,
            "oldlace":0xfdf5e6,"olive":0x808000,"olivedrab":0x6b8e23,"orange":0xffa500,"orangered":0xff4500,"orchid":0xda70d6,
            "palegoldenrod":0xeee8aa,"palegreen":0x98fb98,"paleturquoise":0xafeeee,"palevioletred":0xd87093,"papayawhip":0xffefd5,"peachpuff":0xffdab9,"peru":0xcd853f,"pink":0xffc0cb,"plum":0xdda0dd,"powderblue":0xb0e0e6,"purple":0x800080,
            "rebeccapurple":0x663399,"red":0xff0000,"rosybrown":0xbc8f8f,"royalblue":0x4169e1,
            "saddlebrown":0x8b4513,"salmon":0xfa8072,"sandybrown":0xf4a460,"seagreen":0x2e8b57,"seashell":0xfff5ee,"sienna":0xa0522d,"silver":0xc0c0c0,"skyblue":0x87ceeb,"slateblue":0x6a5acd,"slategray":0x708090,"snow":0xfffafa,"springgreen":0x00ff7f,"steelblue":0x4682b4,
            "tan":0xd2b48c,"teal":0x008080,"thistle":0xd8bfd8,"tomato":0xff6347,"turquoise":0x40e0d0,
            "violet":0xee82ee,
            "wheat":0xf5deb3,"white":0xffffff,"whitesmoke":0xf5f5f5,
            "yellow":0xffff00,"yellowgreen":0x9acd32
        };
    
        return colours[colour.toLowerCase()];
    
    },

    /**
     Find index of first entry &gt; \a t 
     Otherwise return last entry
     */
    findindex: function(vect, t) {
    	for(var i=0; i<vect.length; ++i) {
    		let vv = vect[i];
	    	if( vv.t >= t )
    			return i;
    	}    
    	return vect.length-1;
    },
    
    lookup: function(vect, t, key) {
    	return  sprintf("#%06x", vect[ this.findindex(vect,t) ][key]);
    },

    intercolour : function(cl, ch, m, f) {
    	var cd = (ch&m)-(cl&m);
    	var cch = (f*cd) & m;
    	return (cl + cch) & m;
    },
    
    
    makeColour: function(n) {
    	return sprintf("#%06x", n);
    },
    
    interpol: function(vect, t, key) {
    	if(t <= vect[0].t)
    		return this.makeColour(vect[0][key]);
    		
    	var vv = vect[vect.length-1];
    	if( t >= vv.t )
		return this.makeColour(vv[key]);
    		
    	// otherwise, inside range
    	var ih = this.findindex(vect,t);
    	var vh = vect[ih];
    	if(vh.t == t)
    		return this.makeColour(vh[key]); // exact
    		
    	// must be somewhere between ih and ih-1
    	var vl = vect[ih-1];
    	var f = (t - vl.t) / (vh.t - vl.t); // amount of diff
    	
    	// interpolate...
    	cl = vl[key];
    	ch = vh[key];
    	return this.makeColour( 
    				this.intercolour(  cl, ch.b, 0x0000ff, f)
    				+ this.intercolour(cl, ch, 0x00ff00, f)
    				+ this.intercolour(cl, ch, 0xff0000, f)
    				);
    },

    getBackground : function(t, vect, interp) {
        if( isNaN(t)) return this.NANColor.b;

        vect = vect || this.$indoor;
        
        if(interp) {
            return this.interpol(vect,t,'b');
        } else {
            return this.lookup(vect,t,'b');
        }
    },
    
    getForeground : function(t, vect, interp) {
        if( isNaN(t)) return this.NANColor.f;

        vect = vect || this.$indoor;
        
        if(interp) {
            return this.interpol(vect,t,'f');
        } else {
            return this.lookup(vect,t,'f');
        }
    },
    
    getColours : function(t, vect, interp) {
        if( isNaN(t)) return this.NANColor;

        vect = vect || this.$indoor;
        
        if(interp) {
            return { f: this.interpol(vect,t,'f'), b: this.interpol(vect,t,'b') };
        } else {
            return { f: this.lookup(vect,t,'f'), b: this.lookup(vect,t,'b') };
        }
    },
    
    getColoursCSS : function(t, vect, interp) {
        let c = this.getColours(t,vect, interp);
        return { "color": c.f, "background": c.b };
    },

    //------------------------------------------------------------------------------
    decodeColor : function(ec, def)
    {
        console.log("decoding ", ec);
        var c;
        if(ec==undefined || ec==null || ec==="") {
            return def;
        }

        if(typeof ec === "int")
            return ec;

        ec = String(ec);

        if(ec.charAt(0)=="#") {
                    // hex enc
            c = parseInt(ec.substring(1), 16);
            if(!isNaN(c))
                return c;
        } 

        try {
            c = parseInt(ec);
            if(!isNaN(c))
                return c;
        }
        catch(ex) {

        }
        
        c = this.colourNameToRGBHex(ec);
        if(c==undefined) 
            return def;

        return c;

    },

    //------------------------------------------------------------------------------
    getColourVector: function(vname) {
    	if(vname)
    		vname = vname.trim();
    		
        if(!vname)
            return this.$indoor;

        if(vname.startsWith("$")) {
            let v = this[vname]; 
            if(v)
                return v;

            console.error("No predef colours " + vname);
        }

        // vector form
        let v = []
        let lines = vname.split("\n");
        for (const l of lines) {
            let frags = l.split(/\s+/);
            let t = parseFloat(frags[0]);
            if(isNaN(t))
                continue;
            let b = this.decodeColor(frags[1], 0x808080);
            let f = this.decodeColor(frags[2], 0);
            v.push({"t":t, "b":b, "f":f});
        }

        console.log(JSON.stringify(v));
        if(v.length==0) 
            return this.$error;

        return v;

        // try JSON - seems to be mangled 
/*        
        try {
            let j = JSON.parse(vname);
            for (const swp of j) {
                swp.f = this.decodeColor(swp.f, 0);
                swp.b = this.decodeColor(swp.b, 0x808080);
            }
            console.log(JSON.stringify(j));
            return j
        }
        catch(ex)
        {
            console.error("Can't parse as JSON:", vname,"\n type=", typeof vname, "\n ex=", ex);
            return this.$error;
        }
        return this.$error;
*/
    },

    format: function(fmt, v) {
        if(v==null || v==undefined)
            return "?";
        
        try {
            return sprintf(fmt,v);
        } catch(ex) {
            console.error("Bad format:"+ex);
            return "?!";
        }

    }
}.resolve(taragorm_common);
