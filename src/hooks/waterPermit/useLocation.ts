import { FormInstance } from "antd";
import addreses from "config/api/addresses";
import useApi from "hooks/useApi";
import { TLocation } from "models";
import { TSourceLocation } from "models/waterPermit";
interface IUseLocation {
  entryFrm: FormInstance;
  location?: TSourceLocation | null;
}
const useLocation = ({ location, entryFrm }: IUseLocation) => {
  const [getCounties, loadingCounties, counties] = useApi<TLocation[]>({
    autoCallUrl: addreses.locations.counties,
    cachingLifeTimeInSeconds: 60,
  });
  const [getDistricts, loadingDistricts, districts] = useApi<TLocation[]>({
    cachingLifeTimeInSeconds: 60,
    autoCallUrl: location?.countiesId
      ? addreses.locations.districs(location?.countiesId.toString())
      : undefined,
  });
  const [getCities, loadingCities, cities] = useApi<TLocation[]>({
    cachingLifeTimeInSeconds: 60,
    autoCallUrl: location?.districsId
      ? addreses.locations.cities(location?.districsId.toString())
      : undefined,
  });
  const [getRuralDistricts, loadingRuralDistricts, ruralDistricts] = useApi<
    TLocation[]
  >({
    cachingLifeTimeInSeconds: 60,
    autoCallUrl: location?.districsId
      ? addreses.locations.ruralDistricts(location?.districsId.toString())
      : undefined,
  });
  const [getVillages, loadingVillages, villages] = useApi<TLocation[]>({
    cachingLifeTimeInSeconds: 60,
    autoCallUrl: location?.ruralDistricsId
      ? addreses.locations.villages(location?.ruralDistricsId.toString())
      : undefined,
  });
  const onCountyChanged = (value: any) => {
    entryFrm.resetFields([
      ["sourceLocation", "districsId"],
      ["sourceLocation", "citiesId"],
      ["sourceLocation", "ruralDistricsId"],
      ["sourceLocation", "villageId"],
    ]);
    getDistricts.get(addreses.locations.districs(value));
  };
  const onDistrictChanged = (value: any) => {
    entryFrm.resetFields([
      ["sourceLocation", "citiesId"],
      ["sourceLocation", "ruralDistricsId"],
      ["sourceLocation", "villageId"],
    ]);
    getCities.get(addreses.locations.cities(value));
    getRuralDistricts.get(addreses.locations.ruralDistricts(value));
  };
  const onRuralDistrictsChanged = (value: any) => {
    entryFrm.resetFields([["sourceLocation", "villageId"]]);
    getVillages.get(addreses.locations.villages(value));
  };
  return {
    loadingCounties,
    counties,
    onCountyChanged,
    loadingDistricts,
    districts,
    onDistrictChanged,
    loadingCities,
    cities,
    getRuralDistricts,
    loadingRuralDistricts,
    ruralDistricts,
    onRuralDistrictsChanged,
    loadingVillages,
    villages,
  };
};
export default useLocation;
