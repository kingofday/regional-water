
const useCategiricalData = (props: {
    valueProp: string,
    labelProp: string
    groupByProp: string
}) => {
    return ({ data }: { data?: any[] }): {
        [key: string]: [string, number];
    } => {
        if (!data) return {}
        let groups = data.reduce((acc: { [key: string]: [string, number] }, x) => {
            let key = props.groupByProp;
            let current = acc[x[key]];
            let v = x[props.valueProp];
            if (!current) {
                acc[x[key]] = [x[props.labelProp], v];
            }
            else {
                acc[x[key]][1] += (v !== null ? v : 0);
            }
            return acc;
        }, {})
        return groups;
    }

}
export default useCategiricalData