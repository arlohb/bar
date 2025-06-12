import { App, Gdk, Gtk } from "astal/gtk4"
import style from "./style.scss"
import Bar from "./Bar"
import Hyprland from "gi://AstalHyprland?version=0.1"


App.start({
    css: style,
    main() {
        // We get monitors from Hyprland
        // App has monitor signals for Gtk3, but not 4 for some reason
        const hyprland = Hyprland.get_default();

        // Map from a Hyprland monitor to a GDK monitor
        const getGdkMonitor = (hyprMonitor: Hyprland.Monitor): Gdk.Monitor | null =>
            App.get_monitors()
                .find(gdkMonitor => hyprMonitor.name == gdkMonitor.connector)
                ?? null;

        // Store the current bars
        const bars = new Map<number, Gtk.Widget>();

        // For each initial monitor, create a bar
        hyprland.get_monitors().forEach(hyprMonitor => {
            const monitor = getGdkMonitor(hyprMonitor);
            if (!monitor) return;
            bars.set(hyprMonitor.id, Bar(monitor));
        });

        // When a new monitor is added, create a bar
        hyprland.connect("monitor-added", (_, hyprMonitor) => {
            const gdkMonitor = getGdkMonitor(hyprMonitor);
            if (!gdkMonitor) return;
            bars.set(hyprMonitor.id, Bar(gdkMonitor));
        });

        // When a monitor is removed, delete a bar
        hyprland.connect("monitor-removed", (_, hyprMonitorId) => {
            // Destroy actually does exist
            (bars.get(hyprMonitorId) as any)?.destroy();
            bars.delete(hyprMonitorId);
        });
    },
})
