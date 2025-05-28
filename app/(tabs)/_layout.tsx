import { Tabs } from 'expo-router';
import { Brain, History, Info, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Image, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: 'transparent',
          height: 70 + insets.top,
        },
        tabBarItemStyle: {
          backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 28,
          color: '#FFFFFF',
          letterSpacing: -0.5,
        },
        headerBackground: () => (
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitle: () => (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            marginLeft: 4,
            marginTop: Platform.OS === 'ios' ? 0 : 0,
          }}>
            <Image 
              source={{ uri: 'https://i.imgur.com/WnSMHEG.png' }}
              style={{ width: 32, height: 32, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text style={{
              fontSize: 28,
              fontWeight: '800',
              color: '#FFFFFF',
              letterSpacing: -0.5,
            }}>
              Brainlight
            </Text>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Therapy',
          tabBarIcon: ({ color }) => <Brain size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
          headerTitle: 'Session History',
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'About',
          tabBarIcon: ({ color }) => <Info size={24} color={color} />,
          headerTitle: 'About Brainlight',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}