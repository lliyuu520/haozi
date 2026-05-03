import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/src/store/authStore';

/** 首页 */
export default function HomeScreen() {
    const user = useAuthStore((s) => s.user);

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>
                欢迎, {user?.realName || user?.username || '用户'}
            </Text>
            <Text style={styles.placeholder}>这里是首页内容区域</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    welcome: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    placeholder: {
        fontSize: 14,
        color: '#999',
    },
});
