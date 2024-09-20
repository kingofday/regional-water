import CryptoJS from "crypto-js";
import config from "config";
import storageKeys from "./storageKeys";
import { TTheme, TooltipItem } from "models";
import colors from "./colors";
import i18n from "i18next"
export default class utils {
    static toPersianDate = (date: string | Date | null, options?: Intl.DateTimeFormatOptions) => {
        if (!date) return null;
        const d = new Date(date)
        return new Intl.DateTimeFormat('fa-IR', options).format(d);
    };
    static shortText(text: string, length: number, appender?: string): string {
        if (!text) return text;
        let textLength = text.length;
        if (textLength > length)
            return text.substring(0, length) + (appender ?? "...");
        return text;
    }
    static commaThousondSeperator(input: number | null | undefined, options: {
        separator?: string;
        dot?: string;
        decimalLength?: number;
        suffix?: string;
        prefix?: string;
        emptyString?: string;
        addPositiveSign?: boolean
    } = {
            separator: ",",
            dot: "/",
            decimalLength: 2,
            emptyString: "-",
            addPositiveSign: false
        }) {
        if (typeof input === "undefined" || input === null) return options.emptyString ?? "-";
        let str = (input % 1 == 0 ? input : parseFloat(input.toFixed(options.decimalLength ?? 2))).toString();
        let arr = str.split(".");
        return `${options.prefix ?? ""}${options.addPositiveSign && input > 0 ? "+" : ""}${(
            arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, options.separator ?? ",") +
            (arr.length === 2 ? `${options.dot ?? "/"}${arr[1]}` : "")
        )}${options.suffix ?? ""}`;
    }
    static formatDecimalNumber(input: number, dot = "/", decimalLength = 2): string {
        return input.toFixed(decimalLength).toString().replace(".", dot);
    };
    static formatNumber(num: number, decimalLength = 1, dot = "/"): string {
        let isNegative = num < 0;
        num = Math.abs(num as number);
        let result: string = num.toString();
        let suffix = "";
        const lessThanThousond = 999,
            thousond = 1000,
            million = 1000000,
            Billion = 1000000000,
            trillion = 1000000000000;

        if (num > lessThanThousond && num <= million) {
            result = (num / thousond).toFixed(decimalLength);
            suffix = "K";
        } else if (num > million && num <= Billion) {
            result = (num / 1000000).toFixed(decimalLength);
            suffix = "M";
        } else if (num > Billion) {
            result = (num / Billion).toFixed(decimalLength);
            suffix = "B";
        }
        // else if (num >= trillion) {
        //   result = (num / trillion).toFixed(decimalLength);
        //   suffix = "T";
        // }
        let output = parseFloat(result);
        return `${isNegative ? "-" : ""}${output}${suffix}`.replace(".", dot);
    }
    static decrypt = (txt: string) => {
        if (!txt) return null;
        var bytes = CryptoJS.AES.decrypt(txt, config.salt);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };
    static encrypt = (data: any) =>
        CryptoJS.AES.encrypt(JSON.stringify(data), config.salt).toString();
    static copyToClipboard(text: string) {
        const range = document.createRange();
        const selection = document.getSelection();
        const mark = document.createElement("span");
        mark.textContent = text;
        // reset user styles for span element
        mark.style.all = "unset";
        // prevents scrolling to the end of the page
        mark.style.position = "fixed";
        mark.style.top = "0";
        mark.style.clip = "rect(0, 0, 0, 0)";
        // used to preserve spaces and line breaks
        mark.style.whiteSpace = "pre";
        // do not inherit user-select (it may be `none`)
        mark.style.webkitUserSelect = "text";
        //mark.style.MozUserSelect = "text";
        //mark.style.msUserSelect = "text";
        mark.style.userSelect = "text";
        mark.addEventListener("copy", function (e) {
            e.stopPropagation();
        });

        document.body.appendChild(mark);

        // The following line is very important
        if (selection && selection.rangeCount > 0) {
            selection?.removeAllRanges();
        }

        range.selectNodeContents(mark);
        selection?.addRange(range);
        document.execCommand("copy");
        document.body.removeChild(mark);
    }
    static nullValueChecker(value: any, onSuccess?: (value: any, ...rest: any) => string, params?: any[]): string {
        if (value === null) return "-";
        if (onSuccess)
            return onSuccess.apply(null, params ? [value, ...params] : [value]);
        else return value;
    }
    static sortAsc(key: string) {

        return function (a: any, b: any) {
            if (!isNaN(a[key]) && isNaN(b[key])) {
                a[key] = parseInt(a[key]);
                b[key] = parseInt(b[key]);
            }
            if (a[key] === b[key]) return 0;
            else if (a[key] > b[key]) return 1;
            else return -1;
        };
    }
    static sortDesc = function (key: string) {
        return function (a: any, b: any) {
            if (!isNaN(a[key]) && isNaN(b[key])) {
                a[key] = parseInt(a[key]);
                b[key] = parseInt(b[key]);
            }
            if (a[key] === b[key]) return 0;
            else if (a[key] > b[key]) return -1;
            else return 1;
        };
    };
    static convertToDateTime(date: any, preferedTime = "08:30:00"): Date | null {
        try {
            if (!date) return null;
            return new Date(
                `${date["year"] ?? date["Year"]}/${date["month"] ?? date["Month"]}/${date["day"] ?? date["Day"]
                } ${preferedTime}`
            );
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    static isNan(value?: number | null | string) {
        return value === null || Number.isNaN(Number(value));
    }
    static getStoredData = <T>(key: string): T | null => {
        try {
            let value = localStorage.getItem(key);
            if (value) return this.decrypt(value) as T;
            return null;
        } catch (e) {
            console.log(e);
            return null;
        }
    };
    static storedData = (key: string, value: any) => {
        if (!value) return;
        localStorage.setItem(key, this.encrypt(value));
    };
    static removeStoredData = (key: string) => {
        localStorage.removeItem(key);
    };
    static sendReport(
        type: "info" | "error" | "warning",
        message: string
    ) {
        if (process.env.NODE_ENV === "development") return;
        //let lastSentDate = 
        for (let ep of config.reportEndPoints) {
            switch (ep.type) {
                case "discord":
                    try {
                        fetch(ep.url, {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({
                                username: "ErrorLog",
                                avatar_url: "",
                                content: `HillaPay-client-${type}-${message}-(${window.location.href})`,
                            }),
                        });
                    }
                    catch (err) {
                    }
                    break;
            }
        }
    }
    static clearStorage() {
        localStorage.removeItem(storageKeys.menus)
        localStorage.removeItem(storageKeys.token)
        localStorage.removeItem(storageKeys.refreshToken)
        localStorage.removeItem(storageKeys.tokenExpiretime)
    }
    static chartTooltipWrapper(
        children: string,
        theme: TTheme,
        className?: string
    ): string {
        let html = `<div class="custom-tooltip ${className}" 
            style="dislay:flex;
            flex-direction:column;
            padding: 5px 10px;
            background: ${colors[theme].bg};
            color:${colors[theme].text};
            border-radius: 10px;
            box-shadow: 0px 4px 8px -2px rgba(22, 31, 48, 0.1), 0px 2px 4px -2px rgba(22, 31, 48, 0.06);">${children}</div>`;
        return html;
    }
    static conditionalColor(
        value: number | null | undefined,
        theme: TTheme
    ): string | undefined {
        if (value === null || value == undefined) return undefined;
        if (value === 0) return colors[theme].text;
        else if (value > 0) return colors.green;
        else return colors.red;
    }
    static createTooltip(
        items: TooltipItem[],
        theme: TTheme,
        date?: string,
        className?: string,
        fontSize = "12px",
    ): string {
        let html = "";
        for (let x of items) {
            if (typeof x === "string") {
                html += x;
                continue;
            }
            if (x.value === null || x.value === "") continue;
            let v: string | number | undefined = "";
            if (this.isNan(x.value)) {
                v = x.value;
            }
            else if (x.formatValue) {
                v = this.formatNumber(parseFloat(x.value?.toString() ?? "0"));
            }
            else {
                v = `${x.prefix ? `<span>${x.prefix}</span> ` : ""}${this.commaThousondSeperator(parseFloat((x.value ?? 0).toString()))}${x.suffix ? ` <span>${x.suffix}</span>` : ""}`;
            }
            html += `<div 
              className="${className ?? ""}"
              style='display:flex;
              justify-content:space-between;
              gap:0.625rem;
              font-size: ${fontSize};
              ${x.divider
                    ? "border-top:solid 1px #ccc;margin-top:4px;padding-top:4px;"
                    : ""
                }
              ${x.colorForValue ? "" : x.color ? `color:${x.color};` : ""}'>
              <span style="direction:${x.dir ?? "ltr"};display:inline-flex;margin-right:3px;
              ${x.colorForValue ? `color:${x.color};` : x.redGreenMode ? `color:${this.conditionalColor(x.value as number, theme)};` : ""
                }">
              ${v}</span>
              ${x.name ? `<span style="display:inline-block;direction:${x.dir ?? "rtl"};">${x.name}</span>` : ""}</div>`;
        }
        if (date) html += `<b style="font-size: 10px;opacity:0.5;">${date}</b>`;
        return this.chartTooltipWrapper(html, theme);
    }
    static createLegend(
        name: string,
        color: string,
        shape: "square" | "circle" | "bullet" | string
    ) {
        let shapeHtml = "";
        const shapeStyle = `display:inline-block;width:6px;height:6px;background-color:${color};`;
        switch (shape) {
            case "square":
                shapeHtml = `<span style="${shapeStyle}"></span>`;
                break;
            case "bullet":
                shapeHtml = `<span style="border-radius:50%;${shapeStyle}border:solid 2px ${color};background-color:transparent;"></span>`;
                break;
            case "circle":
                shapeHtml = `<span style="border-radius:50%;${shapeStyle}"></span>`;
                break;
            default:
                shapeHtml = "";
                break;
        }
        return `<span style="display:inline-flex;gap:0.25rem;direction:rtl;align-items: center;" class="custom-legend">
            ${shapeHtml}
            <span style="color:${color};" class="name">${name}</span>
            </span>`;
    }
    static convertToQueryString(params: Object): string {
        let qs: any = {};
        for (let k in params) {
            let v = params[k as keyof typeof params];
            if (typeof v !== 'undefined')
                qs[k] = v;

        }
        return new URLSearchParams(qs).toString();
    }
    static convrtEnumToOptions(obj: any): ({
        label: string;
        value: string;
    })[] {
        return Object.keys(obj)
            .filter(key => !isNaN(Number(obj[key as keyof typeof obj])))
            .map((k) =>
            ({
                label: i18n.t(k) ?? "",
                value: obj[k as keyof typeof obj] ?? ""
            }));
    }
    static getEnumDescripion(type: any, value: any) {
        let option = this.convrtEnumToOptions(type).find(x => x.value == value);
        if (option) return option.label;
        else return "-"
    }
    static calculateTickInterval(data?: string[]) {
        if (!data) return undefined;
        const range = new Date(data[data.length - 1]).getTime() - new Date(data[0]).getTime(); // Get data range in ms
        let tickInterval;

        if (range < 24 * 30 * 3600 * 1000) { // Less than 1 month
            tickInterval = 24 * 3600 * 1000; // 1 day
        } else if (range < 24 * 365 * 30 * 3600 * 1000) {  // Less than 1 year
            tickInterval = 24 * 30 * 3600 * 1000; // 1 month
        } else {
            tickInterval = 24 * 365 * 3600 * 1000; // 1 year
        }

        return tickInterval;
    }
}