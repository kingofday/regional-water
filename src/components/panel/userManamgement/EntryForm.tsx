import {
  Form as AntForm,
  Checkbox,
  Col,
  Input,
  Row,
  Select
} from "antd";
import PriceInput from "components/shared/PriceInput";
import addreses from "config/api/addresses";
import patterns from "config/patterns";
import useApi from "hooks/useApi";
import { TOrganizationLevel } from "models/organization";
import { TRole } from "models/user";
import { useTranslation } from "react-i18next";
const Form = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const [, gettingRoles, roles] = useApi<TRole[]>({
    autoCallUrl: addreses.userManager.roles,
    cachingLifeTimeInSeconds: 60,
  });
  const [, gettingLevels, levels] = useApi<TOrganizationLevel, any[]>({
    autoCallUrl: addreses.organizationLevel.list,
    cachingLifeTimeInSeconds: 60,
    mapper: (data) => {
      const result: any[] = [];
      const iterator = (item: TOrganizationLevel) => {
        if (item.nodes && item.nodes.length) {
          item.nodes.forEach((i) =>
            iterator({
              ...i,
              name: `${item.name}/${i.name}`,
            })
          );
        } else {
          result.push(item);
        }
      };
      if (data) iterator(data);
      return result;
    },
  });
  return (
    <>
      <AntForm.Item noStyle name="id">
        <Input type="hidden" />
      </AntForm.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="firstName"
            label={t("firstName")}
            rules={[
              {
                required: true,
                message: t("required") ?? "",
              },
            ]}
          >
            <Input placeholder={t("firstName") ?? ""} />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="lastName"
            label={t("lastName")}
            rules={[
              {
                required: true,
                message: t("required") ?? "",
              },
            ]}
          >
            <Input placeholder={t("lastName") ?? ""} />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={12}>
          <AntForm.Item valuePropName="checked" name="isEnabled" label={" "}>
            <Checkbox>{t("isEnabled")}</Checkbox>
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="nationalCode"
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
              readOnly={!!data}
              placeholder={t("nationalCode") ?? ""}
              className="ltr-elm placeholder-r"
            />
          </AntForm.Item>
        </Col>
        {!data && (
          <>
            <Col xs={24} sm={12}>
              <AntForm.Item
                name="password"
                label={t("password")}
                rules={[
                  { required: true, message: t("required") ?? "" },
                  { min: 8, message: t("atleastXChar", { x: 8 }) ?? "" },
                ]}
              >
                <Input.Password
                  placeholder={t("password") ?? ""}
                  className="ltr-elm placeholder-r"
                />
              </AntForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <AntForm.Item
                name="passwordConfirm"
                label={t("confirmPassword")}
                rules={[
                  {
                    required: true,
                    message: t("required") ?? "",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("passwordsMissMatch") ?? "")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder={t("confirmPassword") ?? ""}
                  className="ltr-elm  placeholder-r"
                />
              </AntForm.Item>
            </Col>
          </>
        )}
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="personnelId"
            label={t("personnelId")}
            rules={[
              {
                required: true,
                message: t("required") ?? "",
              },
            ]}
          >
            <Input
              placeholder={t("personnelId") ?? ""}
              className="ltr-elm placeholder-r"
            />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="phoneNumber"
            label={t("mobileNumber")}
            rules={[
              {
                required: true,
                message: t("required") ?? "",
              },
              {
                pattern: patterns.mobile,
                message: t("wrongFormat") ?? "",
              },
            ]}
          >
            <Input
              placeholder={t("mobileNumber") ?? ""}
              className="ltr-elm placeholder-r"
            />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={12}>
          <PriceInput
            stringMode={false}
            name="baseSalary"
            label={t("baseSalary") ?? ""}
            placeholder={t("baseSalary") ?? ""}
          />
        </Col>
        <Col xs={24} sm={12}>
          <AntForm.Item
            name="emailAddress"
            label={t("email")}
            rules={[
              {
                pattern: patterns.email,
                message: t("wrongFormat") ?? "",
              },
            ]}
          >
            <Input
              placeholder={t("email") ?? ""}
              className="ltr-elm placeholder-r"
            />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={24}>
          <AntForm.Item name="roleIds" label={t("roles")}>
            <Select
              mode="multiple"
              loading={gettingRoles}
              //size={"large"}
              placeholder={t("roles")}
              defaultValue={[]}
              showArrow
              //onChange={handleChange}
              style={{ width: "100%" }}
              options={roles?.map((r) => ({
                label: r.name,
                value: r.id,
              }))}
            />
          </AntForm.Item>
        </Col>
        <Col xs={24} sm={24}>
          <AntForm.Item
            name="organizationLevelId"
            label={t("organizationLevel")}
          >
            <Select
              allowClear
              placeholder={t("eSymbolType")}
              options={(levels as any[])?.map((l) => ({
                label: l.name,
                value: l.id,
              }))}
            />
          </AntForm.Item>
        </Col>
      </Row>
    </>
  );
};
export default Form;
