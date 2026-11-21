
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kampusku.app',
  appName: 'KampusKu',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 300,
      launchAutoHide: true,
      backgroundColor: '#0755C9',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
