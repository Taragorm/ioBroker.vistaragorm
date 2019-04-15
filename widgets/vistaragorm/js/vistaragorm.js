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


// this code can be placed directly in vistaragorm.html
vis.binds["vistaragorm_nbox"] = {
    version: "0.0.4",
    
    //--------------------------------------------------------------------------------------
    showVersion: function () {
        if (vis.binds["vistaragorm_nbox"].version) {
            console.log('Version vistaragorm_nbox: ' + vis.binds["vistaragorm_nbox"].version);
            vis.binds["vistaragorm_nbox"].version = null;
        }
    },
        
    //--------------------------------------------------------------------------------------
    createWidget: function (widgetID, view, data, style) {
        try {
        
            const N = 3;
            const fmts = []
            for(let i=0; i<N; ++i)
                fmts.push(data['format'+ix] || "%.1f");

            const vect = taragorm_common.getColourVector(data.colours);                

            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_nbox"].createWidget(widgetID, view, data, style);
                }, 100);
            }
    
            //console.log("Create nbox");
            
            const $mvs = [];
            var text = [];

            text.push(`
<table width='100%' height='100%' class='vis_taragorm_nbox-table' style='background-color:#ff00ff'>
<tr><th>" + ${data.titleText || ''}</th></tr>`
            );

            for(let i=1; i<=N; ++i) {
                $mvs.push($div.find('.vis_taragorm_nbox-mv' + i ));
                if(data['oid_mv'+i]) {
                    text.push(`<tr><td><span class='vis_taragorm_nbox-mv${i}'></span></td></th>`);
                }
            }
    
            text.push("</table>");
            
            $('#' + widgetID).html(text.join(""));
    
            if(data.onClick) 
                $div.find('.vis_taragorm_nbox-table').attr('onClick', data.onClick);
            
            const $table = $div.find('.vis_taragorm_nbox-table');
            
            let self = this;
            // subscribe on updates of value
            let bound = [];
    
            for(let i=1; i<=N; ++i) {
                let mv = data["oid_mv"+i];         
                if (mv) {
                    let mvv = mv+".val";
                    let iv = vis.states[mvv];
                    let ix = i;
                    bound.push(mvv);
                    setValue( iv, i );
                    //console.log("bound ", mvv, " intial state=", iv, " ix=", ix);
                    vis.states.bind(mvv, function (e, newVal, oldVal) {
                        //console.log(mv,ix,"=", newVal," from ", oldVal );                    
                        setValue(newVal, ix);
                    });
                }
            }
    
            if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', this.setValues);
            }
            //console.log("Create nbox - done");
        } catch(ex) {
            console.error(ex);
        }        

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // local functions
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function setValue (newVal, ix) {
            //console.log("nbox::setvalue ix=", ix, " v=", newVal);

            $mvs[ix].html( taragorm_common.format(fmts[ix], newVal) );    
            if(ix==1)
            {
                var colours = taragorm_common.getColoursCSS(newVal, vect, data.interpolate);
                $table.css( colours );    
            }
        }
    
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
    //--------------------------------------------------------------------------------------
};


vis.binds["vistaragorm_mvsp"] = {
    version: "0.0.3",
    
    //--------------------------------------------------------------------------------------
    showVersion: function () {
        if (vis.binds["vistaragorm_mvsp"].version) {
            console.log('Version vistaragorm_mvsp: ' + vis.binds["vistaragorm_mvsp"].version);
            vis.binds["vistaragorm_mvsp"].version = null;
        }
    },
    
    //--------------------------------------------------------------------------------------
    createWidget: function (widgetID, view, data, style) {
        try {
            let fmt = data.format || "%.1f &deg;C";
            var vect = taragorm_common.getColourVector(data.colours);
            var $div = $('#' + widgetID);
            const oid_mv = data.oid_mv +".val"
            const oid_sp = data.oid_sp +".val"
            
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_mvsp"].createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            //console.log("Create mvsp");
    
            var text = '';
            text += "<table width='100%' height='100%' class='vis_taragorm_nbox-table' style='background-color:#00ff00'>";
            text += "<tr><th>" + (data.titleText || '') + "</th></tr>";
            text += "<tr><td><span class='vis_taragorm_nbox-mv'></span></td></th>";
            text += "<tr><td><span class='vis_taragorm_nbox-sp'></span></td></th>";
            text += "</table>";
            
            $('#' + widgetID).html(text);
    
            if(data.onClick) 
                $div.find('.vis_taragorm_nbox-table').attr('onClick', data.onClick);

            const $table = $div.find('.vis_taragorm_nbox-table');
            const $mv = $div.find('.vis_taragorm_nbox-mv');
            const $sp = $div.find('.vis_taragorm_nbox-sp'):
             
            this.setValues(null,null);
            
            // subscribe on updates of values
            let bound = [];
            if (data.oid_mv) {
                let mvv = oid_mv;
                bound.push( mvv );
                vis.states.bind(mvv, function (e, newVal, oldVal) {
                    setValues(newVal, null );
                });
            }
            
            if (data.oid_sp) {
                let spv= oid_sp;
                bound.push( spv );
                vis.states.bind(spv, function (e, newVal, oldVal) {
                    setValues(null, newVal );
                });
            }
    
            if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', this.setValues);
            }
            
        } catch(ex) {
            log.error(ex);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // local functions
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function setValues (mv, sp) {
            //console.log("setvalues mv=",mv," sp=",sp);
            
            if(mv==null)
                mv = vis.states[oid_mv];
    
            if(sp==null)
                sp = vis.states[oid_sp];
    
            $mv.html( taragorm_common.format(fmt, mv) );
            $sp.html( taragorm_common.format(fmt, sp) );
            
            var mvcols = taragorm_common.getColours(mv, vect, data.interpolate);
            var spbg = taragorm_common.getBackground(sp, vect, data.interpolate);
            $table.css({ "background": "radial-gradient("+ mvcols.b+", "+ spbg + ")", "foreground-color": mvcols.f } );    
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
    //--------------------------------------------------------------------------------------
};




vis.binds["vistaragorm_nbox"].showVersion();
vis.binds["vistaragorm_mvsp"].showVersion();


