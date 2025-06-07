import { bind } from "astal";
import Bluetooth from "gi://AstalBluetooth";

const deviceStr = (device: Bluetooth.Device): string => {
    return `${device.alias} ${100 * device.batteryPercentage}%`
};

export default () => {
    const bluetooth = Bluetooth.get_default();

    const devices = bind(bluetooth, "devices")
        .as(devices => devices.filter(device => device.connected));

    return <button onClicked="blueberry">
        <label>
            {devices.as(devices => "󰂯" + (devices.length === 0 ? "" : "  ")
                + devices.map(deviceStr).join(", "))}
        </label>
    </button>
};
