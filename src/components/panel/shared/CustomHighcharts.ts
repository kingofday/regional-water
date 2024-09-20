//import * as highstock from "highcharts/highstock";
import Highcharts from "highcharts/highcharts";
import noDataToDisplay from "highcharts/modules/no-data-to-display"
import i18n from "i18next"
noDataToDisplay(Highcharts)
Highcharts.setOptions({
  lang:{
    noData: i18n.t("thereIsNoData")??"داده ای وجود ندارد"
  }
})
export default Highcharts;