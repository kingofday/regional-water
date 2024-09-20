
const useGroupByData = (props: {
    valueProps: string,
    dateTimeProps: string,
    groupByProps?: string
}) => {
    return ({ data }: { data?: any[] }) => {
        if(!data) return []
        let groups = data.reduce((acc: { [key: string]: [number, number] }, x) => {
            let key = props.groupByProps ?? props.dateTimeProps;
            let current = acc[x[key]];
            let v = x[props.valueProps];
            if (!current) {

                acc[x[key]] = [new Date(x[props.dateTimeProps]).getTime(), v]
            }
            else {
                acc[x[key]][1] += (v !== null ? v : 0);
            }
            return acc;
        }, {})
        return Object.values(groups).sort((a, b) => a[0] - b[0]);
    }

}
export default useGroupByData