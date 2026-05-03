import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'token';

/** 保存 token 到 SecureStore */
export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

/** 从 SecureStore 读取 token */
export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

/** 从 SecureStore 删除 token */
export async function removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}
