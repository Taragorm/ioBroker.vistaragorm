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
            var fmts = []
            for(let i=0; i<N; ++i)
                fmts.push(data['format'+(i+1)] || "%.1f");

            var vect = taragorm_common.getColourVector(data.colours);                

            var $div = $('#' + widgetID);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_nbox"].createWidget(widgetID, view, data, style);
                }, 100);
            }
    
            var text = [];

            text.push(`
<table width='100%' height='100%' class='vis_taragorm_nbox-table' style='background-color:#ff00ff'>
<tr><th>${data.titleText || ''}</th></tr>`
            );

            for(let i=1; i<=N; ++i) {
                if(data['oid_mv'+i]) {
                    text.push(`<tr><td><span class='vis_taragorm_nbox-mv${i}'></span></td></th>`);
                }
            }
    
            text.push("</table>");
            
            $('#' + widgetID).html(text.join(""));

            var $mvs = [];
            for(let i=1; i<=N; ++i) {
                $mvs.push($div.find('.vis_taragorm_nbox-mv' + i ));
            }

            if(data.onClick) 
                $div.find('.vis_taragorm_nbox-table').attr('onClick', data.onClick);
            
            var $table = $div.find('.vis_taragorm_nbox-table');
            
            let self = this;
            // subscribe on updates of value
            let bound = [];
    
            for(let i=0; i<N; ++i) {
                let mv = data["oid_mv"+(i+1)];         
                if (mv) {
                    let mvv = mv+".val";
                    let iv = vis.states[mvv];
                    bound.push(mvv);
                    setValue( iv, i );
                    //console.log("bound ", mvv, " intial state=", iv, " ix=", ix);
                    vis.states.bind(mvv, function (e, newVal, oldVal) {
                        //console.log(mv,i,"=", newVal," from ", oldVal );                    
                        setValue(newVal, i);
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
            let $mv = $mvs[ix];
            if(!$mv)
                return;

            $mv.html( taragorm_common.format(fmts[ix], newVal) );    
            if(ix==0)
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
    version: "0.0.4",
    
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
            var fmt = data.format || "%.1f &deg;C";
            var vect = taragorm_common.getColourVector(data.colours);
            var $div = $('#' + widgetID);
            var oid_mv = data.oid_mv +".val"
            var oid_sp = data.oid_sp +".val"
            var offSp = data.offSp;
            
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

            var $table = $div.find('.vis_taragorm_nbox-table');
            var $mv = $div.find('.vis_taragorm_nbox-mv');
            var $sp = $div.find('.vis_taragorm_nbox-sp');
             
            setValues(null,null);
            
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
                $div.data('bindHandler', setValues);
            }
            
        } catch(ex) {
            console.error(ex);
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
            
            if(offSp != undefined && sp <= offSp) {
                // just show single colour
                let colours = taragorm_common.getColoursCSS(mv, vect, data.interpolate);
                $table.css( colours );    
            } else {
                // two colour mode
                let mvcols = taragorm_common.getColours(mv, vect, data.interpolate);
                let spbg = taragorm_common.getBackground(sp, vect, data.interpolate);
                $table.css({ "background": "radial-gradient("+ mvcols.b+", "+ spbg + ")", "foreground-color": mvcols.f } );    
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
    //--------------------------------------------------------------------------------------
};

vis.binds["vistaragorm_htmltoggle"] = {
    version: "0.0.1",
    
    //--------------------------------------------------------------------------------------
    showVersion: function () {
        if (vis.binds["vistaragorm_htmltoggle"].version) {
            console.log('Version vistaragorm_htmltoggle: ' + vis.binds["vistaragorm_htmltoggle"].version);
            vis.binds["vistaragorm_htmltoggle"].version = null;
        }
    },
    
    //--------------------------------------------------------------------------------------
    createWidget: function (widgetID, view, data, style) {
        try {
            var $div = $('#' + widgetID);
            var html_true = data.htmlTrue;
            var html_false = data.htmlFalse;

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_htmltoggle"].createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            //console.log("Create mvsp");
    
            var text = `<button type="button" class="vis-tara-button">&hearts;</button>`;
            
            $('#' + widgetID).html(text);

            var $button = $div.find(".vis-tara-button").button();
            $button.click(_click);



            // subscribe on updates of values
            let bound = [];
            if (data.oid) {
                var oidv = data.oid + ".val";
                bound.push(oidv );
                vis.states.bind(oidv, function (e, newVal, oldVal) {
                    _setValue(newVal);
                });
            }
            
           if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', _setValue);
            }

            _setValue(vis.states[oidv]);

        } catch(ex) {
            console.error(ex);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function _setValue(v) {
            $button.html( v ? html_true : html_false);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function _click() {
            vis.setValue(oidv, !vis.states[oidv]);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}

vis.binds["vistaragorm_bool"] = {
    version: "0.0.1",
    
    //--------------------------------------------------------------------------------------
    showVersion: function () {
        if (vis.binds["vistaragorm_bool"].version) {
            console.log('Version vistaragorm_bool: ' + vis.binds["vistaragorm_bool"].version);
            vis.binds["vistaragorm_bool"].version = null;
        }
    },
    
    //--------------------------------------------------------------------------------------
    createWidget: function (widgetID, view, data, style) {
        try {
            var $div = $('#' + widgetID);
            var html_true = data.htmlTrue;
            var html_false = data.htmlFalse;

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_bool"].createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            //console.log("Create mvsp");
    
            var text = `<span class="vis-tara-span">&hearts;</span>`;
            
            $('#' + widgetID).html(text);

            var $span = $div.find(".vis-tara-span");



            // subscribe on updates of values
            let bound = [];
            if (data.oid) {
                var oidv = data.oid + ".val";
                bound.push(oidv );
                vis.states.bind(oidv, function (e, newVal, oldVal) {
                    _setValue(newVal);
                });
            }
            
           if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', _setValue);
            }

            _setValue(vis.states[oidv]);

        } catch(ex) {
            console.error(ex);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function _setValue(v) {
            //console.log(`${v}`);
            $span.html( Boolean(v) ? html_true : html_false);
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}

vis.binds["vistaragorm_hilo"] = {
    version: "0.0.1",
    
    //--------------------------------------------------------------------------------------
    showVersion: function () {
        if (vis.binds["vistaragorm_hilo"].version) {
            console.log('Version vistaragorm_hilo: ' + vis.binds["vistaragorm_hilo"].version);
            vis.binds["vistaragorm_hilo"].version = null;
        }
    },
    
    //--------------------------------------------------------------------------------------
    createWidget: function (widgetID, view, data, style) {
        try {
            var $div = $('#' + widgetID);
            var html_ll = data.htmlLoLo;
            var html_l = data.htmlLo;
            var html_n = data.htmlNormal;
            var html_h = data.htmlHi;
            var html_hh = data.htmlHiHi;
            var lim_ll = data.lolo;
            var lim_l = data.lo;
            var lim_h = data.hi;
            var lim_hh = data.hihi;
            

            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds["vistaragorm_hilo"].createWidget(widgetID, view, data, style);
                }, 100);
            }
            
            //console.log("Create mvsp");
    
            var text = `<span class="vis-tara-span">&hearts;</span>`;
            
            $('#' + widgetID).html(text);

            var $span = $div.find(".vis-tara-span");



            // subscribe on updates of values
            let bound = [];
            if (data.oid) {
                var oidv = data.oid + ".val";
                bound.push(oidv );
                vis.states.bind(oidv, function (e, newVal, oldVal) {
                    _setValue(newVal);
                });
            }
            
           if(bound.length) {
                $div.data('bound', bound);
                $div.data('bindHandler', _setValue);
            }

            _setValue(vis.states[oidv]);

        } catch(ex) {
            console.error(ex);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function _setValue(v) {
            v = Number(v);
            console.log(`${v}, ${lim_l}, ${lim_ll}, ${lim_h}, ${lim_hh}`);
            var t = html_n || "OK";
            if(lim_l != undefined && v <= lim_l)
            {
                if(lim_ll != undefined && v <= lim_ll)
                    t = html_ll;
                else 
                    t = html_l;
            }
            else if(lim_h != undefined && v >= lim_h)
            {
                if(lim_hh != undefined && v >= lim_hh)
                    t = html_hh;
                else
                    t = html_h;
            }

            $span.html( sprintf(t,v) );
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
}


vis.binds["vistaragorm_nbox"].showVersion();
vis.binds["vistaragorm_mvsp"].showVersion();
vis.binds["vistaragorm_htmltoggle"].showVersion();
vis.binds["vistaragorm_bool"].showVersion();
vis.binds["vistaragorm_hilo"].showVersion();


