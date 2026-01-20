import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAppColorScheme } from '@/hooks/useAppColorScheme';
import { saveApiKey, getApiKey, deleteApiKey, hasApiKey } from '@/lib/secure';
import { getNotificationPermissionStatus, requestNotificationPermissions } from '@/lib/notifications';
import { Stack } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { KeyIcon, MoonIcon, SunIcon, MonitorIcon, Trash2Icon, CheckIcon, AlertCircleIcon, CameraIcon, ShieldIcon, ExternalLinkIcon, BellIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View, TextInput, Alert, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

type ThemeOption = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const { preference, setPreference, isDark } = useAppColorScheme();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const [apiKey, setApiKeyState] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const stored = await getApiKey();
      if (stored) {
        setApiKeyState(stored);
        setHasStoredKey(true);
      }
      
      // Load notification permission status
      const notifStatus = await getNotificationPermissionStatus();
      setNotificationPermission(notifStatus);
      
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    
    try {
      await saveApiKey(apiKey.trim());
      setHasStoredKey(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'API key saved securely! 🔐');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteApiKey = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete API Key',
      'Are you sure you want to remove your stored API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteApiKey();
            setApiKeyState('');
            setHasStoredKey(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const themeOptions: { value: ThemeOption; label: string; icon: typeof SunIcon }[] = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: MonitorIcon },
  ];

  const handleThemeChange = (theme: ThemeOption) => {
    Haptics.selectionAsync();
    setPreference(theme);
  };

  const openAppSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openSettings();
  };

  const handleRequestCameraPermission = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await requestCameraPermission();
    if (result.granted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRequestNotificationPermission = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const granted = await requestNotificationPermissions();
    if (granted) {
      setNotificationPermission('granted');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setNotificationPermission('denied');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 gap-6 pb-8">
        {/* Theme Section */}
        <View className="gap-3">
          <Text className="text-lg font-semibold text-foreground">Appearance</Text>
          <View className="flex-row gap-2">
            {themeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handleThemeChange(option.value)}
                className={`flex-1 items-center justify-center p-4 rounded-xl border-2 ${
                  preference === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}
              >
                <Icon 
                  as={option.icon} 
                  className={`size-6 mb-2 ${
                    preference === option.value ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <Text className={`text-sm font-medium ${
                  preference === option.value ? 'text-primary' : 'text-foreground'
                }`}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Permissions Section */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Icon as={ShieldIcon} className="size-5 text-foreground" />
            <Text className="text-lg font-semibold text-foreground">Permissions</Text>
          </View>
          
          <View className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Camera Permission */}
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3 flex-1">
                <Icon as={CameraIcon} className="size-5 text-muted-foreground" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Camera</Text>
                  <Text className="text-xs text-muted-foreground">Required to capture photos</Text>
                </View>
              </View>
              {cameraPermission?.granted ? (
                <View className="flex-row items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                  <Icon as={CheckIcon} className="size-3 text-green-500" />
                  <Text className="text-xs text-green-500 font-medium">Granted</Text>
                </View>
              ) : cameraPermission?.canAskAgain ? (
                <Button size="sm" variant="outline" onPress={handleRequestCameraPermission}>
                  <Text className="text-xs">Grant</Text>
                </Button>
              ) : (
                <View className="flex-row items-center gap-1 bg-red-500/10 px-3 py-1 rounded-full">
                  <Icon as={AlertCircleIcon} className="size-3 text-red-500" />
                  <Text className="text-xs text-red-500 font-medium">Denied</Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View className="h-px bg-border mx-4" />

            {/* Notifications Permission */}
            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3 flex-1">
                <Icon as={BellIcon} className="size-5 text-muted-foreground" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Notifications</Text>
                  <Text className="text-xs text-muted-foreground">Get notified when slop is ready</Text>
                </View>
              </View>
              {notificationPermission === 'granted' ? (
                <View className="flex-row items-center gap-1 bg-green-500/10 px-3 py-1 rounded-full">
                  <Icon as={CheckIcon} className="size-3 text-green-500" />
                  <Text className="text-xs text-green-500 font-medium">Granted</Text>
                </View>
              ) : notificationPermission === 'undetermined' ? (
                <Button size="sm" variant="outline" onPress={handleRequestNotificationPermission}>
                  <Text className="text-xs">Grant</Text>
                </Button>
              ) : (
                <View className="flex-row items-center gap-1 bg-red-500/10 px-3 py-1 rounded-full">
                  <Icon as={AlertCircleIcon} className="size-3 text-red-500" />
                  <Text className="text-xs text-red-500 font-medium">Denied</Text>
                </View>
              )}
            </View>
          </View>

          {/* Open System Settings */}
          <Pressable 
            onPress={openAppSettings}
            className="flex-row items-center justify-center gap-2 p-3 bg-card rounded-xl border border-border"
          >
            <Icon as={ExternalLinkIcon} className="size-4 text-primary" />
            <Text className="text-primary font-medium">Open System Settings</Text>
          </Pressable>
        </View>

        {/* API Key Section */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Icon as={KeyIcon} className="size-5 text-foreground" />
            <Text className="text-lg font-semibold text-foreground">Google AI API Key</Text>
          </View>
          
          <Text className="text-sm text-muted-foreground">
            Your API key is stored securely on your device. Get one from{' '}
            <Text className="text-primary">aistudio.google.com</Text>
          </Text>

          {hasStoredKey && (
            <View className="flex-row items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <Icon as={CheckIcon} className="size-4 text-green-500" />
              <Text className="text-green-500 flex-1">API key configured</Text>
            </View>
          )}

          {!hasStoredKey && process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY && (
            <View className="flex-row items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <Icon as={AlertCircleIcon} className="size-4 text-blue-500" />
              <Text className="text-blue-500 flex-1 text-sm">Using environment variable (dev mode)</Text>
            </View>
          )}

          <View className="gap-2">
            <TextInput
              value={showKey ? apiKey : apiKey ? '•'.repeat(Math.min(apiKey.length, 40)) : ''}
              onChangeText={setApiKeyState}
              placeholder="Enter your Google AI API key"
              placeholderTextColor="#888"
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
              className="p-4 border border-border rounded-xl bg-card text-foreground"
            />
            
            <View className="flex-row gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onPress={() => setShowKey(!showKey)}
              >
                <Text>{showKey ? 'Hide' : 'Show'}</Text>
              </Button>
              
              <Button 
                className="flex-1"
                onPress={handleSaveApiKey}
                disabled={saving || !apiKey.trim()}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text>Save Key</Text>
                )}
              </Button>
            </View>

            {hasStoredKey && (
              <Button 
                variant="outline" 
                onPress={handleDeleteApiKey}
                className="mt-2"
              >
                <Icon as={Trash2Icon} className="size-4 text-destructive mr-2" />
                <Text className="text-destructive">Remove Stored Key</Text>
              </Button>
            )}
          </View>
        </View>

        {/* App Info */}
        <View className="mt-auto pt-4 border-t border-border gap-1">
          <Text className="text-center text-foreground text-base font-semibold">
            TopSlop
          </Text>
          <Text className="text-center text-primary text-sm italic">
            Your top one-stop shop for AI slop
          </Text>
          <Text className="text-center text-muted-foreground text-xs mt-2">
            v1.0.0 · Made with chaos since 2026
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
