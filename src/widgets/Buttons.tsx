import { Variable } from "astal";
import { Gtk } from "astal/gtk4";

const wlKeysAuto = Variable(false).poll(
    500,
    "wl_keys auto query",
    output => output == "true"
);

export default () => (
    <box cssClasses={["Buttons"]}>
        <button
            onClicked="rofi -show drun"
            halign={Gtk.Align.START}
        >
            󰣇
        </button>
        <button
            onClicked="sh -c '~/.config/hypr/rotate.sh 1'"
            halign={Gtk.Align.START}
        >
            󰴓
        </button>
        <button
            onClicked="sh -c '~/.config/hypr/rotate.sh 0'"
            halign={Gtk.Align.START}
        >
            󰌢
        </button>
        <button
            onClicked="hyprctl dispatch togglesplit"
            halign={Gtk.Align.START}
        >
            󰑦
        </button>
        <button
            onClicked="wl_keys auto toggle"
            halign={Gtk.Align.START}
        >
            {wlKeysAuto(state => state ? "󰌌" : "󰌐")}
        </button>
        <button
            onClicked="wl_keys ui toggle"
            halign={Gtk.Align.START}
        >
            󰧹
        </button>
    </box>
);

