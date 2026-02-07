import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from '@/navigation';
import { ThemeProvider } from '@/theme';

export default function App() {
  return (
    <ThemeProvider defaultThemeName="mystical-purple">
      <RootNavigator />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
