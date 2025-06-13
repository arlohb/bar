import { bind, Binding, exec, Variable } from "astal";

export default () => {
    const now = Variable(new Date()).poll(500, () => new Date());

    const lastRan: Binding<Date | null> = Variable(null)
        // Get last exec time in local format
        .poll(500, "systemctl show --user nextcloud-sync.service \
            --property=ExecMainExitTimestamp --value"
        )
        // Change to epoch
        (dateStr => dateStr ? exec(`date --date="${dateStr}" +%s`) : null)
        // Change to JS date
        .as(epoch => {
            if (!epoch || epoch == "") return null;
            return new Date(parseInt(epoch) * 1000)
        });

    const elapsedSecs: Variable<number | null> = Variable.derive(
        [now, lastRan], (now, lastRan) => {
            if (!lastRan) return null;
            return Math.round((now.getTime() - lastRan.getTime()) / 1000);
        }
    );

    return <button>
        {bind(elapsedSecs).as(secs => secs ? `󰅟   ${secs}s` : "󰘿")}
    </button>
};

