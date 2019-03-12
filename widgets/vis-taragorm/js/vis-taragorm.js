/*
    ioBroker.vis vis-taragorm Widget-Set

    version: "0.0.1"

    Copyright 2019 Taragorm taragorm@zoho.eu
*/
"use strict";

// add translations for edit mode
$.get( "adapter/vis-taragorm/words.js", function(script) {
    let translation = script.substring(script.indexOf('{'), script.length);
    translation = translation.substring(0, translation.lastIndexOf(';'));
    $.extend(systemDictionary, JSON.parse(translation));
});


// this code can be placed directly in vis-taragorm.html
vis.binds["vis_taragorm_nbox"] = {
    version: "0.0.1",
    showVersion: function () {
        if (vis.binds["vis_taragorm_nbox"].version) {
            console.log('Version vis_taragorm_nbox: ' + vis.binds["vis_taragorm_nbox"].version);
            vis.binds["vis_taragorm_nbox"].version = null;
        }
    },
    createWidget: function (widgetID, view, data, style) {
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds["vis_taragorm_nbox"].createWidget(widgetID, view, data, style);
            }, 100);
        }

        var text = '';
        text += "<table width='100%' class='vis_taragorm_nbox-table' bgcolour='green'>";
        text += "<tr><th>" + (data.titleText || '') + "</th></tr>";
        text += "<tr><td><span class='vis_taragorm_nbox-value'>" + vis.states[data.oid + ".val"] + "C </span></td></th>";
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

        // subscribe on updates of value
        if (data.oid) {
            vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                $div.find('.vis_taragorm_nbox-value').html(newVal);
            });
        }
    }
};

vis.binds["vis_taragorm_nbox"].showVersion();
