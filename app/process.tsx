import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SlopLevel, SlopMode } from '@/lib/constants';
import { runSlopPipeline } from '@/lib/api';
import { insertSlop } from '@/lib/db';
import { notifySlopReady, notifySlopError } from '@/lib/notifications';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Loader2Icon, AlertCircleIcon } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Animated, Easing, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProcessScreen() {
  const { photoUri, level, mode, context } = useLocalSearchParams<{
    photoUri: string;
    level: SlopLevel;
    mode: SlopMode;
    context?: string;
  }>();
  
  const [status, setStatus] = useState('Initializing the slop machine...');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation for the loading indicator
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const processImage = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    setStatus('Initializing the slop machine...');
    
    try {
      const decodedUri = decodeURIComponent(photoUri);
      const decodedContext = context ? decodeURIComponent(context) : undefined;
      const decodedMode = mode ? (decodeURIComponent(mode) as SlopMode) : 'facebook';
      
      console.log('🎯 Processing with mode:', decodedMode, 'level:', level);
      
      // Run the full pipeline with mode
      const result = await runSlopPipeline(decodedUri, level, decodedMode, setStatus, decodedContext);
      
      // Save to database (include mode)
      setStatus('Saving to the vault...');
      const newId = await insertSlop({ ...result, slopMode: decodedMode });
      
      // Send notification if app is in background
      if (AppState.currentState !== 'active') {
        await notifySlopReady(newId);
      }
      
      // Navigate to result with isNew flag for confetti
      router.replace(`/result?id=${newId}&isNew=true`);
      
    } catch (e) {
      console.error('Pipeline error:', e);
      setError(e instanceof Error ? e.message : 'Something went wrong');
      
      // Send error notification if app is in background
      if (AppState.currentState !== 'active') {
        await notifySlopError();
      }
      
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    processImage();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center gap-8 p-6">
          {error ? (
            <>
              <Text className="text-6xl">💀</Text>
              <Text className="text-center text-xl font-semibold text-destructive">
                The Void Rejected You
              </Text>
              <Text className="text-center text-muted-foreground">
                {error}
              </Text>
              <View className="flex-row gap-3">
                <Button variant="outline" onPress={() => router.back()}>
                  <Text>Go Back</Text>
                </Button>
                <Button onPress={processImage}>
                  <Text>Try Again</Text>
                </Button>
              </View>
            </>
          ) : (
            <>
              <Animated.View 
                style={{ 
                  transform: [{ rotate: spin }] 
                }}
              >
                <Icon as={Loader2Icon} className="size-16 text-primary" />
              </Animated.View>
              <Text className="text-center text-xl font-semibold text-foreground mt-4">
                {status}
              </Text>
              <Text className="text-center text-sm text-muted-foreground">
                The void is processing your request...
              </Text>
              <ActivityIndicator size="small" className="mt-4" />
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
