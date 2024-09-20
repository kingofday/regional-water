//import * as highstock from "highcharts/highstock";
import highstock from "highcharts/highstock";
import noDataToDisplay from "highcharts/modules/no-data-to-display"
import i18n from "i18next"
noDataToDisplay(highstock)
highstock.dateFormats = {
  a: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(
      new Date(ts)
    );
  },
  A: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(
      new Date(ts)
    );
  },
  d: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { day: "2-digit" }).format(
      new Date(ts)
    );
  },
  e: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(
      new Date(ts)
    );
  },
  b: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { month: "short" }).format(
      new Date(ts)
    );
  },
  B: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(
      new Date(ts)
    );
  },
  m: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { month: "2-digit" }).format(
      new Date(ts)
    );
  },
  y: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
      new Date(ts)
    );
  },
  Y: function (ts: number) {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
      new Date(ts)
    );
  }
};
highstock.setOptions({
  lang:{
    noData: i18n.t("thereIsNoData")??"داده ای وجود ندارد"
  }
})
export default highstock;