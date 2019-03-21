/*
    ioBroker.vis vistaragorm Widget-Set

    version: "0.0.1"

    Copyright 2019 Taragorm taragorm@zoho.eu
*/
"use strict";

// add translations for edit mode
$.get( "adapter/vistaragorm/words.js", function(script) {
    let translation = script.substring(script.indexOf('{'), script.length);
    translation = translation.substring(0, translation.lastIndexOf(';'));
    $.extend(systemDictionary, JSON.parse(translation));
});



const taragorm_common = {

    $error: [
    	{ t:1e32, b: 0xff00ff }
    ],

    $indoor: [
    	{ t:15, b: 0x6060ff },
    	{ t:18, b: 0x00c000 },
    	{ t:19, b: 0xb0b000 },
    	{ t:22, b: 0xff0000 }
    ],    
    
    $outdoor: [
    	{ t:8, b: 0x6060ff },
    	{ t:12, b: 0x00c000 },
    	{ t:18, b: 0xb0b000 },
    	{ t:22, b: 0xff0000 }
    ],    

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
    
    lookup: function(vect, t) {
    	return  sprintf("#%06x", vect[ this.findindex(vect,t) ].b);
    },

    intercolour : function(cl, ch, m, f) {
    	var cd = (ch&m)-(cl&m);
    	var cch = (f*cd) & m;
    	return (cl + cch) & m;
    },
    
    
    makeColour: function(n) {
    	return sprintf("#%06x", n);
    },
    
    interpol: function(vect, t) {
    	if(t <= vect[0].t)
    		return this.makeColour(vect[0].b);
    		
    	var vv = vect[vect.length-1];
    	if( t >= vv.t )
		return this.makeColour(vv.b);
    		
    	// otherwise, inside range
    	var ih = this.findindex(vect,t);
    	var vh = vect[ih];
    	if(vh.t == t)
    		return this.makeColour(vh.b); // exact
    		
    	// must be somewhere between ih and ih-1
    	var vl = vect[ih-1];
    	var f = (t - vl.t) / (vh.t - vl.t); // amount of diff
    	
    	// interpolate...
    	return this.makeColour( 
    				this.intercolour(  vl.b, vh.b, 0x0000ff, f)
    				+ this.intercolour(vl.b, vh.b, 0x00ff00, f)
    				+ this.intercolour(vl.b, vh.b, 0xff0000, f)
    				);
    },

    getBackground : function(t, vect, interp) {
        vect = vect || this.$indoor;
        
        if(interp) {
            return this.interpol(vect,t);
        } else {
            return this.lookup(vect,t);
        }
    },


    getColourVector: function(vname) {
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
    }
};



// this code can be placed directly in vistaragorm.html
vis.binds["vistaragorm_nbox"] = {
    version: "0.0.1",
    
    showVersion: function () {
        if (vis.binds["vistaragorm_nbox"].version) {
            console.log('Version vistaragorm_nbox: ' + vis.binds["vistaragorm_nbox"].version);
            vis.binds["vistaragorm_nbox"].version = null;
        }
    },
    
    setValue: function($div, data, newVal, ix) {
        let fmt = data['format'+ix] || "%.1f";
    
        $div.find('.vis_taragorm_nbox-mv' + ix ).html( sprintf(fmt, newVal) );

        if(ix==1)
        {
            var vect = taragorm_common.getColourVector(data.colours);
            var bg = taragorm_common.getBackground(newVal, vect, data.interpolate);
            $div.find('.vis_taragorm_nbox-table').css('background-color', bg );    
        }
    },
    
    createWidget: function (widgetID, view, data, style) {
        const N = 3;

        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds["vistaragorm_nbox"].createWidget(widgetID, view, data, style);
            }, 100);
        }

        var text = '';
        text += "<table class='vis_taragorm_nbox-table' style='background-color:#00ff00'>";
        text += "<tr><th>" + (data.titleText || '') + "</th></tr>";
        for(let i=1; i<=N; ++i) {
            if(data['mv'+i])
                text += sprintf("<tr><td><span class='vis_taragorm_nbox-mv%d'></span></td></th>", i);
        }


        text += "</table>";
        
        /*
        text += 'OID: ' + data.oid + '</div><br>';
        text += 'OID value: <span class="myset-value">' + vis.states[data.oid + '.val'] + '</span><br>';
        text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
        text += 'extraAttr: ' + data.extraAttr + '<br>';
        text += 'Browser instance: ' + vis.instance + '<br>';
        text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || '') + '</textarea><br>';
        */
        $('#' + widgetID).html(text);

        
        
        let self = this;
        // subscribe on updates of value
        for(let i=1; i<=N; ++i) {
            let mv = data["mv"+i];
            if (mv) {
                this.setValue($div, data, vis.states[mv + ".val"], i );
                vis.states.bind(mv + '.val', function (e, newVal, oldVal) {
                    self.setValue($div, data, newVal, i);
                });
            }
        }
        
    }
};


vis.binds["vistaragorm_mvsp"] = {
    version: "0.0.1",
    
    showVersion: function () {
        if (vis.binds["vistaragorm_mvsp"].version) {
            console.log('Version vistaragorm_mvsp: ' + vis.binds["vistaragorm_mvsp"].version);
            vis.binds["vistaragorm_mvsp"].version = null;
        }
    },
    
    setValues: function($div, data, mv, sp) {
        let fmt = data.format || "%.1f &deg;C";
    
        $div.find('.vis_taragorm_nbox-mv').html( sprintf(fmt, mv) );
        $div.find('.vis_taragorm_nbox-sp').html( sprintf(fmt, sp) );
        
        var vect = taragorm_common.getColourVector(data.colours);
        var mvbg = taragorm_common.getBackground(mv, vect, data.interpolate);
        var spbg = taragorm_common.getBackground(sp, vect, data.interpolate);
        $div.find('.vis_taragorm_nbox-table').css('background', 'radial-gradient('+ spbg+', '+ mvbg + ')' );    
    },
    
    createWidget: function (widgetID, view, data, style) {
        console.log("2nb");
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds["vistaragorm_mvsp"].createWidget(widgetID, view, data, style);
            }, 100);
        }

        var text = '';
        text += "<table class='vis_taragorm_nbox-table' style='background-color:#00ff00'>";
        text += "<tr><th>" + (data.titleText || '') + "</th></tr>";
        text += "<tr><td><span class='vis_taragorm_nbox-mv'></span></td></th>";
        text += "<tr><td><span class='vis_taragorm_nbox-sp'></span></td></th>";
        text += "</table>";
        
        /*
        text += 'OID: ' + data.oid + '</div><br>';
        text += 'OID value: <span class="myset-value">' + vis.states[data.oid + '.val'] + '</span><br>';
        text += 'Color: <span style="color: ' + data.myColor + '">' + data.myColor + '</span><br>';
        text += 'extraAttr: ' + data.extraAttr + '<br>';
        text += 'Browser instance: ' + vis.instance + '<br>';
        text += 'htmlText: <textarea readonly style="width:100%">' + (data.htmlText || '') + '</textarea><br>';
        */
        $('#' + widgetID).html(text);

        
        this.setValues(
                        $div, 
                        data, 
                        vis.states[data.mv + ".val"], 
                        vis.states[data.sp + ".val"] 
                        );
        
        let self = this;
        // subscribe on updates of values
        if (data.mv) {
            vis.states.bind(data.mv + '.val', function (e, newVal, oldVal) {
            self.setValues($div, data, newVal, vis.states[data.sp + ".val"] );
            });
        }
        if (data.sp) {
            vis.states.bind(data.sp + '.val', function (e, newVal, oldVal) {
            self.setValues($div, data, vis.states[data.mv + ".val"], newVal );
            });
        }
    }
};




vis.binds["vistaragorm_nbox"].showVersion();
vis.binds["vistaragorm_mvsp"].showVersion();


