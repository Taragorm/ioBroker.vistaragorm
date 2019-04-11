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
    version: "0.0.3",
    
    showVersion: function () {
        if (vis.binds["vistaragorm_nbox"].version) {
            console.log('Version vistaragorm_nbox: ' + vis.binds["vistaragorm_nbox"].version);
            vis.binds["vistaragorm_nbox"].version = null;
        }
    },
    
    setValue: function($div, data, newVal, ix) {
        //console.log("nbox::setvalue ix=", ix, " v=", newVal);

        let fmt = data['format'+ix] || "%.1f";
    
        $div.find('.vis_taragorm_nbox-mv' + ix ).html( taragorm_common.format(fmt, newVal) );

        if(ix==1)
        {
            var vect = taragorm_common.getColourVector(data.colours);
            var colours = taragorm_common.getColoursCSS(newVal, vect, data.interpolate);
            $div.find('.vis_taragorm_nbox-table').css( colours );    
        }
    },
    
    createWidget: function (widgetID, view, data, style) {
        try {
        
            const N = 3;
    
            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_nbox"].createWidget(widgetID, view, data, style);
                }, 100);
            }
    
            //console.log("Create nbox");
            
            var text = '';
            text += "<table width='100%' height='100%' class='vis_taragorm_nbox-table' style='background-color:#ff00ff'>";
            text += "<tr><th>" + (data.titleText || '') + "</th></tr>";
            for(let i=1; i<=N; ++i) {
                if(data['oid_mv'+i]) {
                    text += sprintf("<tr><td><span class='vis_taragorm_nbox-mv%d'></span></td></th>", i);
                }
            }
    
            text += "</table>";
            
            $('#' + widgetID).html(text);
    
            if(data.onClick) 
             $div.find('.vis_taragorm_nbox-table').attr('onClick', data.onClick);
            
            
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
                    this.setValue($div, data, iv, i );
                    //console.log("bound ", mvv, " intial state=", iv, " ix=", ix);
                    vis.states.bind(mvv, function (e, newVal, oldVal) {
                        //console.log(mv,ix,"=", newVal," from ", oldVal );                    
                        self.setValue($div, data, newVal, ix);
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
    }
};


vis.binds["vistaragorm_mvsp"] = {
    version: "0.0.3",
    
    showVersion: function () {
        if (vis.binds["vistaragorm_mvsp"].version) {
            console.log('Version vistaragorm_mvsp: ' + vis.binds["vistaragorm_mvsp"].version);
            vis.binds["vistaragorm_mvsp"].version = null;
        }
    },
    
    setValues: function($div, data, mv, sp) {
        //console.log("setvalues mv=",mv," sp=",sp);
        
        let fmt = data.format || "%.1f &deg;C";
    
        if(mv==null)
            mv = vis.states[data.mv+".val"];

        if(sp==null)
            sp = vis.states[data.sp+".val"];

        $div.find('.vis_taragorm_nbox-mv').html( taragorm_common.format(fmt, mv) );
        $div.find('.vis_taragorm_nbox-sp').html( taragorm_common.format(fmt, sp) );
        
        var vect = taragorm_common.getColourVector(data.colours);
        var mvcols = taragorm_common.getColours(mv, vect, data.interpolate);
        var spbg = taragorm_common.getBackground(sp, vect, data.interpolate);
        $div.find('.vis_taragorm_nbox-table').css({ "background": "radial-gradient("+ mvcols.b+", "+ spbg + ")", "foreground-color": mvcols.f } );    
    },
    
    createWidget: function (widgetID, view, data, style) {
        try {
            var $div = $('#' + widgetID);
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
             
             
            this.setValues(
                            $div, 
                            data, 
                            vis.states[data.oid_mv + ".val"], 
                            vis.states[data.oid_sp + ".val"] 
                            );
            
            let self = this;
            // subscribe on updates of values
            let bound = [];
            if (data.oid_mv) {
                let mvv = data.oid_mv +".val";
                bound.push( mvv );
                //console.log("Bound ",mvv);
                vis.states.bind(mvv, function (e, newVal, oldVal) {
                    self.setValues($div, data, newVal, null );
                });
            }
            
            if (data.oid_sp) {
                let spv= data.oid_sp+".val";
                bound.push( spv );
                //console.log("Bound ",spv);
                vis.states.bind(spv, function (e, newVal, oldVal) {
                    self.setValues($div, data, null, newVal );
                });
            }
    
            if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', this.setValues);
            }
            //console.log("Create mvsp - done");
            
        } catch(ex) {
            log.error(ex);
        }
    }
};




vis.binds["vistaragorm_nbox"].showVersion();
vis.binds["vistaragorm_mvsp"].showVersion();


