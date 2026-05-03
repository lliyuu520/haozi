import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/src/store/authStore';
import { api } from '@/src/api/request';
import { removeToken } from '@/src/utils/token';

/** 个人中心页 */
export default function ProfileScreen() {
    const user = useAuthStore((s) => s.user);

    /** 退出登录 */
    const handleLogout = () => {
        Alert.alert('确认退出', '确定要退出登录吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '退出',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // 调用后端退出接口
                        await api.post('/auth/logout');
                    } catch {
                        // 即使后端退出失败也继续清理
                    }
                    // 清除本地 token
                    await removeToken();
                    // 清除 Zustand 状态，AuthGuard 会自动跳转到登录页
                    useAuthStore.getState().clear();
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* 用户信息卡片 */}
            <View style={styles.card}>
                {/* 头像占位 */}
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="#fff" />
                    </View>
                </View>

                <Text style={styles.username}>{user?.username ?? '未知用户'}</Text>
                {user?.realName ? (
                    <Text style={styles.realName}>{user.realName}</Text>
                ) : null}

                {/* 角色列表 */}
                {user?.roles && user.roles.length > 0 ? (
                    <View style={styles.rolesRow}>
                        {user.roles.map((role) => (
                            <View key={role} style={styles.roleBadge}>
                                <Text style={styles.roleText}>{role}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            {/* 退出登录按钮 */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <Ionicons name="log-out-outline" size={20} color="#ff4d4f" />
                <Text style={styles.logoutText}>退出登录</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
        paddingTop: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1890ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    realName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    rolesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: 4,
    },
    roleBadge: {
        backgroundColor: '#e6f7ff',
        borderColor: '#91d5ff',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    roleText: {
        fontSize: 12,
        color: '#1890ff',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#ff4d4f',
        fontWeight: '500',
    },
});
