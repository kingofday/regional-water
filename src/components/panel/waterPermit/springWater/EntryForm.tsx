import {
  Alert,
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Steps,
} from "antd";
import DatePickerFormItem from "components/panel/shared/DatePickerFormItem";
import InputNumberFormItem from "components/panel/shared/InputNumberFormItem";
import CustomIcon from "components/shared/CustomIcon";
import addreses from "config/api/addresses";
import patterns from "config/patterns";
import utils from "config/utils";
import useApi from "hooks/useApi";
import useLocation from "hooks/waterPermit/useLocation";
import { PersianMonthesEnum } from "models";
import {
  SpringTypeEnum,
  SpringUsageVolumeTypeEnum,
  TSprintWaterSummary,
} from "models/springWater";
import { MouseEvent, ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SimilarRecords from "./SimilarRecords";
const StepContent = ({
  active,
  id,
  children,
}: {
  active: boolean;
  id?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className="step-content"
      id={id}
      style={{ display: active ? "block" : "none", position: "relative" }}
    >
      <Row gutter={10}>{children}</Row>
    </div>
  );
};
const EntryForm = ({
  data,
  onSuccess,
  onCancel,
  readOnly,
}: {
  data?: TSprintWaterSummary;
  onCancel: () => void;
  onSuccess?: (item: TSprintWaterSummary, closeModal: boolean) => void;
  readOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const [entryFrm] = Form.useForm();
  const {
    loadingCounties,
    counties,
    onCountyChanged,
    loadingDistricts,
    districts,
    onDistrictChanged,
    loadingCities,
    cities,
    loadingRuralDistricts,
    ruralDistricts,
    onRuralDistrictsChanged,
    loadingVillages,
    villages,
  } = useLocation({
    entryFrm,
    location: data?.sourceLocation,
  });
  const [step, setStep] = useState(0);
  const [errors, setError] = useState<string[]>([]);
  const [addOrUpdate, loading] = useApi({
    onSuccess(res) {
      onSuccess?.(res as TSprintWaterSummary, false);
      setStep((s) => s + 1);
    },
  });
  const [find, finding] = useApi({
    autoCallUrl: data ? addreses.springWaterPermit.find(data.id) : undefined,
    onSuccess(res) {
      const data = res as any;
      console.log("find", data);
      if (data) {
        entryFrm.setFieldsValue(data);
      }
    },
  });
  const handleSubmit = (values: any) => {
    const frmData = values;
    if (!data) addOrUpdate.post(addreses.springWaterPermit.add, frmData);
    else addOrUpdate.put(addreses.springWaterPermit.update, frmData);
  };
  const handleFailed = (err: any) => {
    setError(
      err.errorFields.map(
        (x: any) => `"${t(x.name[0].replace("Id", ""))}" ${x.errors[0]}`
      )
    );
  };
  const back = () => {
    setStep((s) => s - 1);
  };
  const next = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setStep((s) => s + 1);
  };
  const stepItems = useMemo(
    () => [
      {
        title: t("permitOwner"),
      },
      {
        title: t("waterSource"),
      },
      {
        title: t("usageAndDeliverLocation"),
      },
      {
        title: t("waterAmount"),
      },
      {
        title: t("extractAndTransfer"),
      },
      {
        title: t("similarRecords"),
      },
    ],
    []
  );
  return (
    <Form
      id="surface-water-form"
      key="surface-water-form"
      form={entryFrm}
      layout="vertical"
      initialValues={data}
      onFinish={handleSubmit}
      onFinishFailed={handleFailed}
      autoComplete="off"
      disabled={finding}
    >
      <Row gutter={[0, 20]}>
        {finding && (
          <Col xs={24} sm={24}>
            <Alert type="info" message={`${t("loading")}...`} />
          </Col>
        )}
        {data && (
          <>
            <Form.Item noStyle name="id">
              <Input type="hidden" />
            </Form.Item>
            <Form.Item noStyle name="sourceLocationId">
              <Input type="hidden" />
            </Form.Item>
          </>
        )}
        <Col xs={24} sm={24}>
          <Steps
            responsive={false}
            size="small"
            current={step}
            items={stepItems}
          />
        </Col>
        <Col xs={24} sm={24}>
          {!!errors.length && (
            <Alert
              type="error"
              message={errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            />
          )}
        </Col>
        <Col xs={24} sm={24}>
          {step === 0 && (
            <StepContent active={true} id="permit-owner">
              <Col xs={24} sm={24}>
                <Divider orientation="left">
                  {t("permitOwnerInformation")}
                </Divider>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "firstName"]}
                  label={t("firstName")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("firstName") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "lastName"]}
                  label={t("lastName")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("lastName") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "fatherName"]}
                  label={t("fatherName")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("fatherName") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} style={{ position: "static" }}>
                <DatePickerFormItem
                  name={["waterUserProfile", "birthdate"]}
                  label={t("birthdate") ?? ""}
                  placeholder={t("birthdate") ?? ""}
                  popupTargetId="permit-owner"
                  readOnly={readOnly}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "nationalCode"]}
                  label={t("nationalCode")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                    {
                      pattern: patterns.nationalCode,
                      message: t("wrongFormat") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("nationalCode") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "birthCertificateNumber"]}
                  label={t("birthCertificateNumber")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("birthCertificateNumber") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "certificateCity"]}
                  label={t("certificateCity")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("certificateCity") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "companyName"]}
                  label={t("companyName")}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: t("required") ?? "",
                  //     },
                  //   ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("companyName") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "companyRegistrationNumber"]}
                  label={t("companyRegistrationNumber")}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: t("required") ?? "",
                  //     },
                  //   ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("companyRegistrationNumber") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "companyNationalCode"]}
                  label={t("companyNationalCode")}
                  //   rules={[
                  //     {
                  //       required: true,
                  //       message: t("required") ?? "",
                  //     },
                  //   ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("companyNationalCode") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Divider orientation="left">{t("permitOwnerAddress")}</Divider>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "phoneNumber"]}
                  label={t("phoneNumber")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                    {
                      pattern: patterns.phone,
                      message: t("wrongFormat") ?? "",
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("phoneNumber") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "cellPhone"]}
                  label={t("mobileNumber")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                    {
                      pattern: patterns.mobile,
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("mobileNumber") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name={["waterUserProfile", "postalCode"]}
                  label={t("postalCode")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                    {
                      pattern: patterns.postalCode,
                    },
                  ]}
                >
                  <Input
                    readOnly={readOnly}
                    placeholder={t("postalCode") ?? ""}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item
                  name={["waterUserProfile", "address"]}
                  label={t("address")}
                  rules={[
                    {
                      required: true,
                      message: t("required") ?? "",
                    },
                  ]}
                >
                  <Input readOnly={readOnly} placeholder={t("address") ?? ""} />
                </Form.Item>
              </Col>
            </StepContent>
          )}
          <StepContent active={step === 1} id="water-source">
            <Col xs={24} sm={24}>
              <Divider orientation="left">{t("waterSourceLocation")}</Divider>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name={["sourceLocation", "countiesId"]}
                label={t("county")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("county")}
                  loading={loadingCounties}
                  onChange={onCountyChanged}
                  options={counties?.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name={["sourceLocation", "districsId"]}
                label={t("district")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("district")}
                  loading={loadingDistricts}
                  onChange={onDistrictChanged}
                  options={districts?.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name={["sourceLocation", "citiesId"]}
                label={t("city")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("city")}
                  loading={loadingCities}
                  options={cities?.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name={["sourceLocation", "ruralDistricsId"]}
                label={t("rural")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("rural")}
                  loading={loadingRuralDistricts}
                  onChange={onRuralDistrictsChanged}
                  options={ruralDistricts?.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name={["sourceLocation", "villageId"]}
                label={t("village")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("village")}
                  loading={loadingVillages}
                  options={villages?.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name={["sourceLocation", "plaque"]}
                label={t("plaque") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("plaque") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name={["sourceLocation", "studyArea"]}
                label={t("studyArea") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("studyArea") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name={["sourceLocation", "drainageBasin"]}
                label={t("drainageBasin") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("drainageBasin") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="springType"
                label={t("springType")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t("springType")}
                  options={utils.convrtEnumToOptions(SpringTypeEnum)}
                  disabled={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}>
              <Divider orientation="left">{t("waterSourceCoordinate")}</Divider>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="springName"
                label={t("springName") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("springName") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="altitude"
                label={t("altitude") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("altitude") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="lat"
                label={t("utmx") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("utmx") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="long"
                label={t("utmy") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("utmy") ?? ""}
                readOnly={readOnly}
              />
            </Col>
          </StepContent>
          <StepContent active={step === 2} id="usage-location">
            <Col xs={24} sm={24}>
              <Divider orientation="left">
                {t("waterUsageLocationSpecification")}
              </Divider>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="fromNorthTo"
                label={t("fromNorthTo")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Input
                  className="w-100 ltr-elm placeholder-r"
                  placeholder={t("fromNorthTo") ?? ""}
                  readOnly={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="fromSouthTo"
                label={t("fromSouthTo")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Input
                  className="w-100 ltr-elm placeholder-r"
                  placeholder={t("fromSouthTo") ?? ""}
                  readOnly={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="fromEastTo"
                label={t("fromEastTo")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Input
                  className="w-100 ltr-elm placeholder-r"
                  placeholder={t("fromEastTo") ?? ""}
                  readOnly={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="fromWestTo"
                label={t("fromWestTo")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Input
                  className="w-100 ltr-elm placeholder-r"
                  placeholder={t("fromWestTo") ?? ""}
                  readOnly={readOnly}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="areaOfAgriculturalLands"
                label={t("areaOfAgriculturalLands") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("areaOfAgriculturalLands") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="totalLandArea"
                label={t("totalLandArea") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("totalLandArea") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={24}>
              <Form.List name="cropsUnderCultivationPercentage">
                {(fields, { add, remove }) => (
                  <>
                    {!readOnly && (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<CustomIcon name="IoAddOutline" />}
                        >
                          {t("cropsUnderCultivationPercentage")}
                        </Button>
                      </Form.Item>
                    )}
                    {fields.map(({ key, name, ...restField }, idx) => (
                      <Space
                        key={key}
                        style={{ display: "flex", marginBottom: 8 }}
                        align="baseline"
                      >
                        <Form.Item {...restField} name={[name, "id"]} noStyle>
                          <Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={idx === 0 ? t("name") : undefined}
                          name={[name, "name"]}
                          rules={[
                            { required: true, message: t("required") ?? "" },
                          ]}
                        >
                          <Input placeholder={t("name") ?? ""} />
                        </Form.Item>
                        <InputNumberFormItem
                          {...restField}
                          form={Form}
                          name={[name, "percentage"]}
                          label={idx === 0 ? t("percentage") ?? "" : undefined}
                          rules={[
                            {
                              required: true,
                              message: t("required") ?? "",
                            },
                          ]}
                          placeholder={t("percentage") ?? ""}
                        />
                        <Button
                          type="text"
                          onClick={() => remove(name)}
                          style={{ marginTop: 30 }}
                        >
                          <CustomIcon name="IoCloseOutline" />
                        </Button>
                      </Space>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
          </StepContent>
          <StepContent active={step === 3} id="water-amount">
            <Col xs={24} sm={24}>
              <Form.List name="springUsageVolume">
                {(fields, { add, remove }) => (
                  <>
                    {!readOnly && (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<CustomIcon name="IoAddOutline" />}
                        >
                          {t("waterAmount")}
                        </Button>
                      </Form.Item>
                    )}
                    {fields.map(({ key, name, ...restField }, idx) => (
                      <Row gutter={[10, 10]}>
                        <Form.Item {...restField} name={[name, "id"]} noStyle>
                          <Input type="hidden" />
                        </Form.Item>
                        <Col xs={24} sm={10}>
                          <Form.Item
                            {...restField}
                            label={idx === 0 ? t("name") : undefined}
                            name={[name, "name"]}
                            rules={[
                              { required: true, message: t("required") ?? "" },
                            ]}
                          >
                            <Input placeholder={t("name") ?? ""} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={3}>
                          <InputNumberFormItem
                            {...restField}
                            form={Form}
                            label={idx === 0 ? t("workHours") ?? "" : undefined}
                            name={[name, "workHours"]}
                            rules={[
                              { required: true, message: t("required") ?? "" },
                            ]}
                            placeholder={t("workHours") ?? ""}
                            readOnly={readOnly}
                          />
                        </Col>
                        <Col xs={12} sm={3}>
                          <InputNumberFormItem
                            form={Form}
                            name={[name, "cubicMeters"]}
                            label={
                              idx === 0 ? t("cubicMeters") ?? "" : undefined
                            }
                            rules={[
                              {
                                required: true,
                                message: t("required") ?? "",
                              },
                            ]}
                            placeholder={t("cubicMeters") ?? ""}
                            readOnly={readOnly}
                          />
                        </Col>
                        <Col xs={12} sm={3}>
                          <Form.Item
                            {...restField}
                            label={idx === 0 ? t("month") : undefined}
                            name={[name, "month"]}
                            rules={[
                              { required: true, message: t("required") ?? "" },
                            ]}
                          >
                            <Select
                              placeholder={t("month") ?? ""}
                              options={utils.convrtEnumToOptions(
                                PersianMonthesEnum
                              )}
                              disabled={readOnly}
                              style={{ minWidth: 80 }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={10} sm={4}>
                          <Form.Item
                            name={[name, "springUsageVolumeType"]}
                            label={idx === 0 ? t("usageType") ?? "" : undefined}
                            rules={[
                              {
                                required: true,
                                message: t("required") ?? "",
                              },
                            ]}
                          >
                            <Select
                              allowClear
                              placeholder={t("surfaceWaterUsageVolumeType")}
                              options={utils.convrtEnumToOptions(
                                SpringUsageVolumeTypeEnum
                              )}
                              disabled={readOnly}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={2} sm={1}>
                          <Button
                            type="text"
                            onClick={() => remove(name)}
                            style={{ marginTop: idx === 0 ? 30 : 0 }}
                          >
                            <CustomIcon name="IoCloseOutline" />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
              </Form.List>
            </Col>
          </StepContent>
          <StepContent active={step === 4} id="extract-transfer">
            <Col xs={24} sm={24}>
              <Divider orientation="left">{t("extractAndTransfer")}</Divider>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="pumpingEngineType"
                label={t("pumpingEngineType") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                readOnly={readOnly}
                placeholder={t("pumpingEngineType") ?? ""}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="diesel"
                label={t("diesel") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("diesel") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="pumpEnginePower"
                label={t("pumpEnginePower") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("pumpEnginePower") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="measuringInstrumentName"
                label={t("measuringInstrumentName")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
              >
                <Input
                  readOnly={readOnly}
                  placeholder={t("measuringInstrumentName") ?? ""}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="electric"
                label={t("electric") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                placeholder={t("electric") ?? ""}
                readOnly={readOnly}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumberFormItem
                form={Form}
                name="electroPumpPower"
                label={t("electroPumpPower") ?? ""}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                ]}
                readOnly={readOnly}
                placeholder={t("electroPumpPower") ?? ""}
              />
            </Col>
            <Col xs={12} sm={12} md={8}>
              <Form.Item valuePropName="checked" name="isPumping" label={" "}>
                <Checkbox disabled={readOnly}>{t("isPumping")}</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={8}>
              <Form.Item
                valuePropName="checked"
                name="isGravityEngine"
                label={" "}
              >
                <Checkbox disabled={readOnly}>{t("isGravityEngine")}</Checkbox>
              </Form.Item>
            </Col>
          </StepContent>
          {step === 5 && (
            <StepContent active={true} id="similar-records">
              <SimilarRecords
                data={entryFrm.getFieldsValue(["waterUserProfile"])}
              />
            </StepContent>
          )}
        </Col>
        <Col xs={24} sm={24}>
          <div
            className="actions"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {(() => {
              switch (step) {
                case stepItems.length - 1:
                  return (
                    <>
                      {readOnly ? (
                        <Button loading={data ? finding : false} onClick={back}>
                          {t("prev")}
                        </Button>
                      ) : (
                        <span></span>
                      )}
                      <Button
                        htmlType={"button"}
                        type="primary"
                        danger
                        onClick={onCancel}
                      >
                        {t("close")}
                      </Button>
                    </>
                  );
                case stepItems.length - 2:
                  return (
                    <>
                      <Button loading={data ? finding : false} onClick={back}>
                        {t("prev")}
                      </Button>
                      <Button
                        htmlType={readOnly ? "button" : "submit"}
                        type="primary"
                        disabled={
                          finding ||
                          loadingDistricts ||
                          loadingCities ||
                          loadingRuralDistricts ||
                          loadingVillages ||
                          loading
                        }
                        loading={loading}
                        onClick={readOnly ? next : undefined}
                      >
                        {t(readOnly ? "next" : "submit")}
                      </Button>
                    </>
                  );
                default:
                  return (
                    <>
                      <Button loading={data ? finding : false} onClick={back}>
                        {t("prev")}
                      </Button>
                      <Button
                        htmlType={"button"}
                        type="primary"
                        onClick={next}
                        disabled={
                          finding ||
                          loadingDistricts ||
                          loadingCities ||
                          loadingRuralDistricts ||
                          loadingVillages
                        }
                      >
                        {t("next")}
                      </Button>
                    </>
                  );
              }
            })()}
          </div>
        </Col>
      </Row>
    </Form>
  );
};
export default EntryForm;
