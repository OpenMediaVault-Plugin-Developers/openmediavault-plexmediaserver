<?php
/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2013-2014 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
require_once("openmediavault/object.inc");
require_once("openmediavault/config.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/util.inc");
require_once("openmediavault/rpcservice.inc");
require_once("openmediavault/notify.inc");

class OMVRpcServicePlexMediaServer extends OMVRpcServiceAbstract {
    /**
     * Get the RPC service name.
     */
    public function getName() {
        return "PlexMediaServer";
    }

    /**
     * Initialize the RPC service.
     */
    public function initialize() {
        $this->registerMethod("getSettings");
        $this->registerMethod("setSettings");
    }

    /**
     * Get the settings configuration object.
     * @param params The method parameters.
     * @param context The context of the caller.
     * @return The requested configuration object.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     */
    public function getSettings($params, $context) {
        global $xmlConfig;
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array( "role" => OMV_ROLE_ADMINISTRATOR ));

        // Get the configuration object.
        $xpath = "//services/plexmediaserver";
        $object = $xmlConfig->get($xpath);
        if(is_null($object))
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $xpath);

        // Modify the result object.
        $object['enable']   = boolval($object['enable']);
        $object['showtab']  = boolval($object['showtab']);
        $object['pyenable'] = boolval($object['pyenable']);
        $object['pyrun']    = boolval($object['pyrun']);
        $object["pyport"]   = intval($object["pyport"]);

        return $object;
    }

    /**
     * Set the settings configuration object.
     * @param params The method parameters.
     * @param context The context of the caller.
     * @return The stored configuration object.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     * @throw E_CONFIG_SET_OBJECT_FAILED
     */
    public function setSettings($params, $context) {
        global $xmlConfig;
        // Validate the RPC caller context.
        $this->validateMethodContext($context, array( "role" => OMV_ROLE_ADMINISTRATOR ));

        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, '{
            "type"       : "object",
            "properties" : {
                "enable"    : { "type" : "boolean" },
                "pyenable"  : { "type" : "boolean", "optional" : true },
                "pyrun"     : { "type" : "boolean", "optional" : true },
                "db-folder" : { "type" : "string", "optional" : true },
                "mntentref" : { ' . $GLOBALS['OMV_JSONSCHEMA_UUID_NONE'] . ' },
                "showtab"   : { "type" : "boolean" },
                "pyport"    : { "type" : "integer","minimum":1024,"maximum":65535, "optional" : true }
            }
        }');

        $xpath = sprintf("//system/fstab/mntent[uuid='%s']", $params['mntentref']);
        $deviceDir = $xmlConfig->get($xpath);
        $deviceDir = $deviceDir['dir'];

        $dbFolder = "{$deviceDir}/plexmediaserver";
        $params['db-folder'] = $dbFolder;

        // Prepare configuration data
        $object = array(
            "enable"    => array_boolval($params, 'enable'),
            "pyenable"  => array_boolval($params, 'pyenable'),
            "pyrun"     => array_boolval($params, 'pyrun'),
            "pyport"    => $params["pyport"],
            "db-folder" => $params['db-folder'],
            "mntentref" => $params['mntentref'],
            "showtab"   => array_boolval($params, 'showtab')
        );

        // Set configuration object
        if (false === $xmlConfig->replace("//services/plexmediaserver", $object))
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED, $this->getXpath());

        // Notify configuration changes
        $dispatcher = &OMVNotifyDispatcher::getInstance();
        $dispatcher->notify(OMV_NOTIFY_MODIFY, "org.openmediavault.services.plexmediaserver", $object);

        return $object;
    }
}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServicePlexMediaServer());
?>
