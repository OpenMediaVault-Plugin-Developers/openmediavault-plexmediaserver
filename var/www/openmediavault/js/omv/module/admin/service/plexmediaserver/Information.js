/**
 * Copyright (C) 2013 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")

/**
 * @class OMV.module.admin.service.vdr.Info
 * @derived OMV.workspace.form.Panel
 */
Ext.define("OMV.module.admin.service.plexmediaserver.Information", {
    extend : "OMV.workspace.form.Panel",

    autoLoadData    : false,
    hideOkButton    : true,
    hideResetButton : true,
    mode            : "local",

    getFormItems : function() {
        var me = this;

        return [{
            /* VDR info */
            xtype  : "fieldset",
            title  : _("Information"),
            layout : "fit",
            items  : [{
                border  : false,
                html    : '<h3>OMV Firewall</h3>' +
                        'If you are using OMVs firewall create rules to open the requisite ports on your LAN.' +
                        '<ul>' +
                        '<li>' +
                        '<b>UDP 1900</b> (discovery service for Plex DLNA Server) [required for PC, Android, standard DLNA clients]' +
                        '</li>' +
                        '<li>' +
                        '<b>UDP 5353</b> (discovery service Plex DLNA Server for Bonjour/Avahi) [required for Apple clients]' +
                        '</li>' +
                        '<li>' +
                        '<b>UDP 32410</b>, <b>32412</b>, <b>32413</b>, <b>32414</b> (for current network discovery)' +
                        '</li>' +
                        '<li>' +
                        '<b>TCP 32469</b> (for access to the Plex DLNA Server)' +
                        '</li>' +
                        '</ul>' +
                        '<h3>Router Settings</h3>' +
                        'Forward the following ports from your router to OMV.  These ports are used for remote access to your Plex Media Server.' +
                        '<ul>' +
                        '<li>' +
                        '<b>TCP 32400</b> (for access to Plex Media Server) [required]' +
                        '</li>' +
                        '<li>' +
                        '<b>TCP 32443</b> (for SSL access to Plex Media Server) [optional]' +
                        '</li>' +
                        '</ul>' +
                        '<h3>Plex Pass</h3>' +
                        'Plex Pass members can follow these instructions to get the most recent Debian version of Plex Media Server.' +
                        '<ol>' +
                        '<li>' +
                        'Click on this link to go to the <a href="https://forums.plex.tv/" target="_blank">Plex forum</a>.  Then click on <b>Sign In</b> in the upper right.   Sign in with your <b>UserID</b> and <b>Password</b>.' +
                        '</li>' +
                        '<li>' +
                        'Once signed in click on this <a href="https://forums.plex.tv/index.php/topic/48865-debian-package/" target="_blank">link</a>.  You are now in a Plex Pass only section of the forum.' +
                        '</li>' +
                        '<li>' +
                        'The 1st post contains links to the latest Debian 32 bit and 64 bit package of Plex Media Server.  Download the appropriate package for your machine.' +
                        '</li>' +
                        '</ol>' +
                        '<h3>Upgrading Plex Media Server Manually</h3>' +
                        'This will normally only have to be done by Plex Pass members upgrading to the latest packages.' +
                        '<ol>' +
                        '<li>' +
                        'Command line: <b>/etc/init.d/plexmediaserver stop</b>' +
                        '</li>' +
                        '<li>' +
                        'Command line: <b>cd /var/cache/apt/archives</b>' +
                        '</li>' +
                        '<li>' +
                        'Command line: <b>rm plex*.deb</b>' +
                        '</li>' +
                        '<li>' +
                        'Now move the new package to this location <b>/var/cache/apt/archives</b>.  While in the archives directory the best method is to use "<b>wget downloadlink</b>" from Plex forums.' +
                        '</li>' +
                        '<li>' +
                        'While on the post in the Plex forum where the package links are located right click on the 32 or 64 bit link.  Then click on "<b>Copy link address</b>".' +
                        '</li>' +
                        '<li>' +
                        'In a Putty root session to your OMV: <b>cd /var/cache/apt/archives</b>' +
                        '</li>' +
                        '<li>' +
                        'Still in root session: <b>wget(type a space after the wget then right click and paste the link.  Hit ENTER and the package will download directly to this location.</b>)' +
                        '</li>' +
                        '<li>' +
                        'Now install the package while still in archives directory:  <b>dpkg -i plex(hit TAB and then ENTER)</b>' +
                        '</li>' +
                        '<li>' +
                        'After installation start PlexMediaServer: <b>/etc/init.d/plexmediaserver start</b>' +
                        '</li>' +
                        '</ol>' 
            }]
        }];
    }

});

OMV.WorkspaceManager.registerPanel({
    id        : "information",
    path      : "/service/plexmediaserver",
    text      : _("Setup Info"),
    position  : 30,
    className : "OMV.module.admin.service.plexmediaserver.Information"
});
