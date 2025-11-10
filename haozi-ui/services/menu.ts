import {ApiResponse, request} from '@/lib/api';
import {withErrorHandling} from '@/lib/apiUtils';
import {MenuItem, MenuType, OpenStyle,} from '@/types/menu';

// 统一导出常用的枚举，方便业务层直接复用
export {MenuType, OpenStyle};

export type MenuTreeNode = MenuItem;

export interface MenuDetail extends MenuTreeNode {
    parentName?: string;
}

type MenuMetaPayload = {
    deeplink?: boolean;
    keepAlive?: boolean;
    modal?: {
        present?: string;
        width?: number;
    };
};

type MenuPayloadBase = {
    parentId: string;
    name: string;
    url: string;
    perms: string;
    type: MenuType;
    openStyle: OpenStyle;
    icon: string;
    weight: number;
    hidden: number;
    meta?: MenuMetaPayload;
};

export type MenuCreateParams = MenuPayloadBase;
export type MenuUpdateParams = MenuPayloadBase & { id: string };

export interface MenuQueryParams {
    type?: MenuType;
}

export interface MenuNavigation {
    href: string;
    basePath: string;
    modal: {
        create: string;
        edit: (id: string) => string;
    };
    breadcrumbs: string[];
    modulePath: string;
}

export interface NavigableMenuItem extends MenuItem {
    getNavigation: () => MenuNavigation;
    getRoute: () => string;
    getModalRoute: (action: string, id?: string) => string;
    getBasePath: () => string;
}

const DEFAULT_MENU_VALUES: MenuDetail = {
    id: '',
    parentId: '0',
    name: '',
    url: '',
    type: MenuType.MENU,
    openStyle: OpenStyle.INTERNAL,
    perms: '',
    weight: 0,
    icon: '',
    hidden: false,
    meta: {
        title: '',
        hidden: false,
        cache: true,
    },
};

const ensureLeadingSlash = (value: string) => {
    if (!value) return '/';
    return value.startsWith('/') ? value : `/${value}`;
};

const stripPageSuffix = (value: string) => value.replace(/\/page$/, '');

const normalizeInternalUrl = (url?: string) => {
    if (!url) return '';

    return url;
};


const buildModalRoute = (menuUrl: string, action: string, id?: string) => {
    const basePath = stripPageSuffix(menuUrl || '');
    const modalBase = ensureLeadingSlash(`${basePath}/modal/${action}`.replace('//', '/'));
    return id ? `${modalBase}/${id}` : modalBase;
};

const toBasePath = (menuUrl: string) => ensureLeadingSlash(stripPageSuffix(menuUrl || ''));

const unwrapResponse = <T>(response: { data?: ApiResponse<T> }, fallback: T): T =>
    (response.data?.data as T) ?? fallback;

const toMenuDetail = (data: Partial<MenuItem> & { parentName?: string }): MenuDetail => ({
    ...DEFAULT_MENU_VALUES,
    ...data,
    meta: {
        ...DEFAULT_MENU_VALUES.meta,
        ...(data.meta || {}),
    },
});

const toBackendPayload = (payload: MenuPayloadBase | (MenuPayloadBase & { id: string })) => {
    const base = {
        parentId: payload.parentId,
        name: payload.name,
        url: payload.url,
        perms: payload.perms || '',
        type: payload.type,
        openStyle: payload.openStyle,
        icon: payload.icon || '',
        weight: payload.weight,
        hidden: payload.hidden ?? 0,
        meta: {
            ...payload.meta,
            hidden: payload.hidden === 1,
        },
    };

    return 'id' in payload ? {...base, id: payload.id} : base;
};

const buildNavigation = (menu: MenuItem): MenuNavigation => ({
    href: ensureLeadingSlash(menu.url || ''),
    basePath: toBasePath(menu.url || ''),
    modal: {
        create: buildModalRoute(menu.url || '', 'create'),
        edit: (id: string) => buildModalRoute(menu.url || '', 'edit', id),
    },
    breadcrumbs: stripPageSuffix(menu.url || '').split('/').filter(Boolean),
    modulePath: stripPageSuffix(menu.url || ''),
});

export async function getMenuList(params?: MenuQueryParams): Promise<MenuItem[]> {
    const response = await request.get<MenuItem[]>('/sys/menu/list', params);
    return unwrapResponse(response, [] as MenuItem[]);
}

export async function getMenuDetail(id: string): Promise<MenuDetail> {
    const response = await request.get<MenuItem & { parentName?: string }>(`/sys/menu/${id}`);
    const raw = unwrapResponse(response, {} as MenuItem & { parentName?: string });
    return toMenuDetail(raw);
}

export function createMenu(data: MenuCreateParams) {
    return withErrorHandling(request.post('/sys/menu', toBackendPayload(data)), '创建菜单');
}

export function updateMenu(data: MenuUpdateParams) {
    return withErrorHandling(request.put('/sys/menu', toBackendPayload(data)), '更新菜单');
}

export function deleteMenu(id: string) {
    return withErrorHandling(request.delete('/sys/menu', {id}), '删除菜单');
}

export class MenuNavigationHelper {
    static makeNavigable(menu: MenuItem): NavigableMenuItem {
        return {
            ...menu,
            getNavigation: () => buildNavigation(menu),
            getRoute: () => ensureLeadingSlash(menu.url || ''),
            getModalRoute: (action: string, id?: string) => buildModalRoute(menu.url || '', action, id),
            getBasePath: () => toBasePath(menu.url || ''),
        };
    }

    static makeMenusNavigable(menus: MenuItem[]): NavigableMenuItem[] {
        return menus.map(menu => this.makeNavigable(menu));
    }

    static normalizeMenuUrl(url?: string): string {
        return normalizeInternalUrl(url);
    }
}

export async function getMenuListNavigable(params?: MenuQueryParams): Promise<NavigableMenuItem[]> {
    const menus = await getMenuList(params);
    return MenuNavigationHelper.makeMenusNavigable(menus);
}

export function createMenuWithNavigation(data: MenuCreateParams) {
    return createMenu({
        ...data,
        url: MenuNavigationHelper.normalizeMenuUrl(data.url),
    });
}

export function updateMenuWithNavigation(data: MenuUpdateParams) {
    return updateMenu({
        ...data,
        url: MenuNavigationHelper.normalizeMenuUrl(data.url),
    });
}
