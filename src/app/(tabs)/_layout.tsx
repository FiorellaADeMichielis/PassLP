import { Dimensions, Easing } from 'react-native';
import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/navigation/AppTabBar';
import { useAppTheme } from '@/hooks/useAppTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Layout de pestañas inferiores (Bottom Tabs).
 *
 * Alberga las rutas reales 'index' y 'account' preservando su estado,
 * con la barra de navegación personalizada de 4 accesos institucionales.
 * Aplica una transición lateral completa y fluida (slide horizontal) entre pantallas.
 */
export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.headerBg,
        },
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 280,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
        },
        sceneStyleInterpolator: ({ current }) => ({
          sceneStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                }),
              },
            ],
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Cuenta',
        }}
      />
    </Tabs>
  );
}
