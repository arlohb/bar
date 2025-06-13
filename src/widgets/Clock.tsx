import { bind, Variable } from "astal";

export default () => {
    const time = Variable("").poll(1000, "date '+%H:%M'");
    return <button>{bind(time)}</button>;
};

