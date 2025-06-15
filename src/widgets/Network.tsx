import { bind, Variable } from "astal";
import Network from "gi://AstalNetwork";

export default () => {
    const network = Network.get_default();

    const state = Variable("").poll(
        500,
        () => {
            if (network.wired?.state === Network.DeviceState.ACTIVATED) {
                return "󰈀   Wired"
            }
            else if (network.wifi?.state === Network.DeviceState.ACTIVATED) {
                return `󰖩   ${network.wifi.ssid}`
            } else {
                return "󰌙"
            }
        }
    );

    return <button>{bind(state)}</button>
};

