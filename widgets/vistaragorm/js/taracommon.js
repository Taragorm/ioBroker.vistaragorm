/**
 * Common colour handling
 */


var taragorm_common = {
//var taragorm_common = taragorm_common || {
        version : 1,

    NANColor : { b: "gray", f:"black"},

    $error: [
    	{ t:1e32, b: 0xff00ff }
    ],

    /**
     * Indoor temperature standard vector
     */
    $indoor: [
    	{ t:15, b: 0x1E90FF, f:0x0000 },
    	{ t:18, b: 0x0bb000, f:0x0000 },
    	{ t:21, b: 0xdddd00, f:0x0000 },
    	{ t:24, b: 0xff0000, f:0x0000 }
    ],    
    
    /**
     * Outdoor temperature standard vector
     */
    $outdoor: [
    	{ t:8,  b: 0x1E90FF, f:0x0000 },
    	{ t:12, b: 0x00bb00, f:0x0000 },
    	{ t:18, b: 0xdddd00, f:0x0000 },
    	{ t:22, b: 0xff0000, f:0x0000 }
    ],    

    /**
     * Laser coolant temperature standard vector
     */
    $laser: [
    	{ t:12, b: 0x1E90FF, f:0x0000 },
    	{ t:24, b: 0x0bb000, f:0x0000 },
    	{ t:26, b: 0xdddd00, f:0x0000 },
    	{ t:30, b: 0xff0000, f:0x0000 }
    ],    
    
    /**
     * Return highest version object of this and the other one.
     * @param {taracommon} other 
     */
    resolve: function(other) {
        return (!other || this.version > other.version) ? this : other;
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
        return { "foreground-color": c.f, "background-color": c.b };
    },

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

        // try JSON
        try {
            return JSON.parse(vname);
        }
        catch(ex)
        {
            console.error("Can't parse as JSON:", vname);
            return this.$error;
        }
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
