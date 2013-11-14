/**
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2013 OpenMediaVault Plugin Developers
 *
 * OpenMediaVault is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * OpenMediaVault is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenMediaVault. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/form/field/SharedFolderComboBox.js")

/**
 * @class OMV.module.admin.service.plexmediaserver.Settings
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.plexmediaserver.Settings", {
    extend: "OMV.workspace.form.Panel",

    rpcService: "PlexMediaServer",
    rpcGetMethod: "getSettings",
    rpcSetMethod: "setSettings",
    plugins: [{
        ptype: "linkedfields",
        correlations: [{
            name: [
                "openmanage"
            ],
            conditions: [
                { name: "enable", value: false }
            ],
            properties: "disabled"
        }]
    }],

    initComponent : function () {
        var me = this;

        me.on('load', function () {
            var checked = me.findField('enable').checked;
            var showtab = me.findField('showtab').checked;
            var parent = me.up('tabpanel');

            if (!parent)
                return;

            var webClientPanel = parent.down('panel[title=' + _("Web Client") + ']');

            if (webClientPanel) {
                checked ? webClientPanel.enable() : webClientPanel.disable();
                showtab ? webClientPanel.tab.show() : webClientPanel.tab.hide();
            }
        });

        me.callParent(arguments);
    },

    getFormItems: function () {
        return [{
            xtype: "fieldset",
            title: _("General settings"),
            fieldDefaults: {
                labelSeparator: ""
            },
            items: [{
                xtype: "checkbox",
                name: "enable",
                fieldLabel: _("Enable"),
                checked: false
            },{
                xtype: "combo",
                name: "mntentref",
                fieldLabel: _("Database Volume"),
                emptyText: _("Select a volume ..."),
                allowBlank: false,
                allowNone: false,
                editable: false,
                triggerAction: "all",
                displayField: "description",
                valueField: "uuid",
                store: Ext.create("OMV.data.Store", {
                    autoLoad: true,
                    model: OMV.data.Model.createImplicit({
                        idProperty: "uuid",
                        fields: [
                            { name: "uuid", type: "string" },
                            { name: "devicefile", type: "string" },
                            { name: "description", type: "string" }
                        ]
                    }),
                    proxy: {
                        type: "rpc",
                        rpcData: {
                            service: "ShareMgmt",
                            method: "getCandidates"
                        },
                        appendSortParams: false
                    },
                    sorters: [{
                        direction: "ASC",
                        property: "devicefile"
                    }]
                }),
                plugins: [{
                    ptype: "fieldinfo",
                    text: _("Database files will move to new location if database volume is changed.")
                }]
            },{
                xtype: "textfield",
                name: "db-folder",
                fieldLabel: _("Database Folder"),
                allowNone: true,
                readOnly: true
            },{
                xtype: "checkbox",
                name: "showtab",
                fieldLabel: _("Enable"),
                checked: false,
                plugins    : [{
                    ptype : "fieldinfo",
                    text  : _("Show tab containing Web Client frame")
                }]
            }]
        },{
            xtype: "button",
            name: "openmanage",
            text: _("Plex Web Client"),
            scope: this,
            handler: function() {
                var link = 'http://' + location.hostname + ':32400/manage';
                window.open(link, '_blank');
            }
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id: "settings",
    path: "/service/plexmediaserver",
    text: _("Settings"),
    position: 10,
    className: "OMV.module.admin.service.plexmediaserver.Settings"
});
