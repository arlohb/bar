import { bind, Variable } from "astal";
import Battery from "gi://AstalBattery";

const percentToIcon = (icons: string[], percent: number): string => {
    const index = Math.round(percent * (icons.length - 1) / 100)
    return icons[index];
};

const batteryIcon = (percent: number, charging: boolean): string => {
    return percentToIcon(
        charging
            ? ["󰢜", "󰂆", "󰂇", "󰂈", "󰢝", "󰂉", "󰢞", "󰂊", "󰂋", "󰂅"]
            : ["󰁺", "󰁻", "󰁼", "󰁽", "󰁾", "󰁿", "󰂀", "󰂁", "󰂂", "󰁹"],
        percent,
    );
};

export default () => {
    const battery = Battery.get_default();
    if (!battery.isPresent) return <></>;

    return <button>
        <label>
            {bind(Variable.derive(
                [bind(battery, "percentage"), bind(battery, "charging")],
                (p, charging) => {
                    return `${batteryIcon(100 * p, charging)}  ${100 * p}%`;
                }
            ))}
        </label>
    </button>
};

