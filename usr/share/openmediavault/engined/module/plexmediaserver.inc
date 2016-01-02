<?php
/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2013-2016 OpenMediaVault Plugin Developers
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

require_once("openmediavault/config.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/log.inc");
require_once("openmediavault/module.inc");
require_once "openmediavault/systemctl.inc";
require_once "openmediavault/util.inc";

class OMVModulePlexMediaServer extends OMVModuleServiceAbstract
  implements OMVINotifyListener, OMVIModuleServiceStatus {

    private $serviceName = "plexmediaserver";

    /**
     * Get the module name.
     */
    public function getName()
    {
        return "PlexMediaServer";
    }

    private function getEventMessagePath()
    {
        return sprintf(
            "org.openmediavault.services.%s",
            $this->serviceName
        );
    }

    private function getXpath()
    {
        return sprintf(
            "/config/services/%s",
            $this->serviceName
        );
    }

    /**
     * Generate the configuration.
     * @throw E_EXEC_FAILED
     */
    public function applyConfig()
    {
        $cmd = sprintf("export LANG=C; omv-mkconf %s 2>&1", $this->serviceName);
        if (0 !== $this->exec($cmd, $output)) {
            throw new OMVException(
                OMVErrorMsg::E_EXEC_FAILED,
                $cmd,
                implode(PHP_EOL, $output)
            );
        }
    }

    /**
     * Stop the managed service.
     */
    public function stopService()
    {
        $systemCtl = new OMVSystemCtl($this->serviceName);
        $systemCtl->disable(true);
    }

    /**
     * Start the managed service.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     */
    public function startService()
    {
        global $xmlConfig;

        $object = $xmlConfig->get($this->getXpath());
        if(is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXpath()
            );
        }
        if(FALSE === boolval($object['enable'])) {
            return;
        }
        $systemCtl = new OMVSystemCtl($this->serviceName);
        $systemCtl->enable(true);
    }

    /**
     * Get the status of the managed service.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     */
    public function getStatus()
    {
        global $xmlConfig;

        $object = $xmlConfig->get($this->getXpath());
        if(is_null($object)) {
            throw new OMVException(
                OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED,
                $this->getXpath()
            );
        }
        $systemCtl = new OMVSystemCtl($this->serviceName);
        return [
            "name"    => $this->getName(),
            "title"   => gettext("PlexMediaServer"),
            "enabled" => boolval($object["enable"]),
            "running" => $systemCtl->isActive()
        ];
    }

    /**
     * Bind listeners.
     */
    function bindListeners(OMVNotifyDispatcher $dispatcher) {
        $dispatcher->addListener(
            OMV_NOTIFY_MODIFY,
            $this->getEventMessagePath(),
            array($this, "setDirty"));
    }
}

// Register module.
$moduleMgr = &OMVModuleMgr::getInstance();
$moduleMgr->registerModule(new OMVModulePlexMediaServer());
