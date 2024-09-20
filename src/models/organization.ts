export type TOrganizationLevel = {
  id: number;
  name: string;
  parentId: number;
  nodes?: TOrganizationLevel[];
};
