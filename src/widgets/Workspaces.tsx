import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";

enum RuleKey {
    Title,
    Class,
};

type Rule = {
    key: RuleKey;
    pattern: string;
    icon: string;
};

const rules: Rule[] = [
    { key: RuleKey.Title, pattern: "nvim", icon: "" },
    { key: RuleKey.Class, pattern: "kitty", icon: "󰄛" },
    { key: RuleKey.Title, pattern: "YouTube", icon: "󰗃" },
    { key: RuleKey.Class, pattern: "firefox", icon: "" },
    { key: RuleKey.Class, pattern: "blender", icon: "󰂫" },
    { key: RuleKey.Class, pattern: "cockatrice", icon: "󰘸" },
    { key: RuleKey.Class, pattern: "steam", icon: "" },
    { key: RuleKey.Class, pattern: "blueberry.py", icon: "󰂯" },
    { key: RuleKey.Class, pattern: "Rofi", icon: "" },
    { key: RuleKey.Class, pattern: "PrismLauncher", icon: "󰍳" },
    { key: RuleKey.Class, pattern: "Aseprite", icon: "" },
    { key: RuleKey.Class, pattern: "Cura", icon: "󰐫" },
];

const matchRule = (client: Hyprland.Client, rule: Rule): boolean => {
    let search = "";
    switch (rule.key) {
        case RuleKey.Title: search = client.title; break;
        case RuleKey.Class: search = client.class; break;
    }
    return search.includes(rule.pattern);
};

const clientIcon = (client: Hyprland.Client): string => {
    for (const rule of rules) {
        if (matchRule(client, rule)) {
            return rule.icon;
        }
    }

    return "󰘔";
};

const Workspace = ({ workspace, active, focusedClient }: {
    workspace: Hyprland.Workspace,
    active: boolean,
    focusedClient: string,
}) => {
    return <button
        onClicked={() => { if (!active) workspace.focus() }}
        halign={Gtk.Align.CENTER}
        cssClasses={active ? ["active"] : []}
    >
        <box spacing={12}>
            {workspace.clients
                .filter(client => !client.hidden)
                .sort((a, b) => a.x - b.x)
                .map(client => <label
                    cssClasses={client.address == focusedClient
                        ? ["focus"] : ["unfocus"]
                    }
                >
                    {clientIcon(client)}
                </label>)
            }
        </box>
    </button>
};

export default ({ monitorName }: { monitorName: string }) => {
    const hyprland = Hyprland.get_default();

    const workspaces = bind(hyprland, "workspaces")
        .as(workspaces => workspaces
            .filter(workspace => workspace?.monitor?.name === monitorName));

    const activeWorkspaceId = bind(hyprland, "focusedWorkspace")
        .as(() => hyprland.get_monitor_by_name(monitorName))
        .as(monitor => monitor?.activeWorkspace.id);

    return <box cssClasses={["Workspaces"]}>
        {bind(Variable.derive(
            [
                // Not directly used, children depend on these changes
                bind(hyprland, "clients"),
                bind(hyprland, "focusedClient"),
                // Directly used when changed
                workspaces,
                activeWorkspaceId
            ],
            (_c, focusedClient, workspaces, activeWorkspaceId) => workspaces
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(workspace => <Workspace
                    workspace={workspace}
                    active={workspace.id === activeWorkspaceId}
                    focusedClient={focusedClient?.address}
                />)
        ))}
    </box>
};

