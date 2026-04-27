export type AuthorizationPayload = {
  routeCodes: string[];
  permissions: string[];
};

export type CurrentUser = AuthorizationPayload & {
  id: number;
  username: string;
  realName?: string | null;
  avatar?: string | null;
  roles: string[];
};
