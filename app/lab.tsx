import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ImageIcon, RefreshCwIcon, XIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

export default function LabScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Loading state
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Loading camera...</Text>
      </View>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center gap-6 bg-background p-6">
        <Text className="text-center text-xl font-semibold">
          Camera Access Required
        </Text>
        <Text className="text-center text-muted-foreground">
          We need access to your camera to capture mundane reality
        </Text>
        <Button onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Button>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      
      if (photo?.uri) {
        // Navigate to refinery with the photo URI
        router.push(`/refinery?photoUri=${encodeURIComponent(photo.uri)}` as any);
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      router.push(`/refinery?photoUri=${encodeURIComponent(result.assets[0].uri)}` as any);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }} 
        facing={facing}
      >
        {/* Top bar */}
        <View className="flex-row justify-between p-4 pt-12">
          <Button variant="ghost" onPress={() => router.back()}>
            <Icon as={XIcon} className="size-6 text-white" />
          </Button>
          <Button variant="ghost" onPress={toggleCameraFacing}>
            <Icon as={RefreshCwIcon} className="size-6 text-white" />
          </Button>
        </View>

        {/* Bottom controls */}
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-8 pb-12">
          {/* Gallery button */}
          <TouchableOpacity
            onPress={handlePickImage}
            className="h-12 w-12 items-center justify-center rounded-full bg-white/20"
            activeOpacity={0.7}
          >
            <Icon as={ImageIcon} className="size-6 text-white" />
          </TouchableOpacity>

          {/* Capture button */}
          <TouchableOpacity
            onPress={handleCapture}
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20"
            activeOpacity={0.7}
          >
            <View className="h-16 w-16 rounded-full bg-white" />
          </TouchableOpacity>

          {/* Spacer for symmetry */}
          <View className="h-12 w-12" />
        </View>
      </CameraView>
    </View>
  );
}
