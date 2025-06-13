import { App, Astal, Gdk } from "astal/gtk4"
import Battery from "./widgets/Battery"
import Bluetooth from "./widgets/Bluetooth"
import Buttons from "./widgets/Buttons"
import Clock from "./widgets/Clock"
import Network from "./widgets/Network"
import Workspaces from "./widgets/Workspaces"

export default function Bar(gdkmonitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return <window
        visible
        cssClasses={["Bar"]}
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={App}>
        <centerbox cssName="centerbox">
            <Buttons />
            <Workspaces monitorName={gdkmonitor.get_connector() ?? ""} />
            <box cssClasses={["RightBtns"]}>
                <Bluetooth />
                <Network />
                <Battery />
                <Clock />
            </box>
        </centerbox>
    </window>
}
