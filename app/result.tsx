import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getSlopById, deleteSlop, updateSlopCaption, toggleFavorite, SlopRecord } from '@/lib/db';
import { generateCaption } from '@/lib/api';
import { SLOP_MODES, SlopMode } from '@/lib/constants';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { CopyIcon, HeartIcon, PencilIcon, RefreshCwIcon, ShareIcon, Trash2Icon } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { View, Image, ScrollView, ActivityIndicator, Alert, Pressable, Modal, TextInput } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function ResultScreen() {
  const { id, isNew } = useLocalSearchParams<{ id: string; isNew?: string }>();
  const [slop, setSlop] = useState<SlopRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');
  const [regeneratingCaption, setRegeneratingCaption] = useState(false);
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    async function fetchSlop() {
      if (id && id !== 'demo') {
        const data = await getSlopById(Number(id));
        setSlop(data);
        
        // Celebration for newly created slops
        if (isNew === 'true') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => confettiRef.current?.start(), 300);
        }
      }
      setLoading(false);
    }
    fetchSlop();
  }, [id, isNew]);

  const handleDelete = () => {
    if (!slop) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Slop',
      'Are you sure you want to delete this masterpiece?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSlop(slop.id);
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!slop) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStatus = await toggleFavorite(slop.id);
    setSlop({ ...slop, is_favorite: newStatus ? 1 : 0 });
  };

  const handleEditCaption = () => {
    if (!slop) return;
    setEditedCaption(slop.caption);
    setEditModalVisible(true);
  };

  const handleSaveCaption = async () => {
    if (!slop || !editedCaption.trim()) return;
    await updateSlopCaption(slop.id, editedCaption.trim());
    setSlop({ ...slop, caption: editedCaption.trim() });
    setEditModalVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRegenerateCaption = async () => {
    if (!slop || regeneratingCaption) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRegeneratingCaption(true);
    
    try {
      // Use the stored mode or default to facebook
      const mode = (slop.slop_mode || 'facebook') as SlopMode;
      const newCaption = await generateCaption(slop.caption, mode);
      await updateSlopCaption(slop.id, newCaption);
      setSlop({ ...slop, caption: newCaption });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Regenerate error:', error);
      Alert.alert('Error', 'Failed to regenerate caption');
    } finally {
      setRegeneratingCaption(false);
    }
  };

  const handleShareImage = async () => {
    if (!displaySlop.slop_uri) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
        return;
      }
      
      await Sharing.shareAsync(displaySlop.slop_uri, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your slop masterpiece',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleCopyCaption = async () => {
    if (!displaySlop.caption) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(displaySlop.caption);
    Alert.alert('Copied!', 'Caption copied to clipboard 📋');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Demo/placeholder data when no real slop exists yet
  const displaySlop = slop || {
    original_uri: 'https://picsum.photos/400',
    slop_uri: 'https://picsum.photos/401',
    caption: 'This is where your generated caption will appear #slop #ai #chaos',
    slop_level: 'medium',
    slop_mode: 'facebook',
    is_favorite: 0,
    created_at: new Date().toISOString(),
  };

  const isFavorite = displaySlop.is_favorite === 1;

  return (
    <>
      {/* Confetti for new slops */}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: 200, y: -20 }}
        autoStart={false}
        fadeOut
        explosionSpeed={400}
      />

      {/* Edit Caption Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center p-6"
          onPress={() => setEditModalVisible(false)}
        >
          <Pressable 
            className="bg-card rounded-xl p-4 gap-4"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-semibold text-foreground">Edit Caption</Text>
            <TextInput
              value={editedCaption}
              onChangeText={setEditedCaption}
              multiline
              autoFocus
              className="min-h-[100px] p-3 border border-border rounded-lg text-foreground"
              placeholder="Enter a new caption..."
              placeholderTextColor="#888"
            />
            <View className="flex-row gap-2">
              <Button variant="outline" className="flex-1" onPress={() => setEditModalVisible(false)}>
                <Text>Cancel</Text>
              </Button>
              <Button className="flex-1" onPress={handleSaveCaption}>
                <Text>Save</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Stack.Screen 
        options={{ 
          title: 'Behold',
          headerRight: slop ? () => (
            <View className="flex-row">
              <Button variant="ghost" size="sm" onPress={handleToggleFavorite}>
                <Icon 
                  as={HeartIcon} 
                  className={`size-5 ${isFavorite ? 'text-red-500' : 'text-foreground'}`}
                  fill={isFavorite ? '#ef4444' : 'transparent'}
                />
              </Button>
              <Button variant="ghost" size="sm" onPress={handleDelete}>
                <Icon as={Trash2Icon} className="size-5 text-destructive" />
              </Button>
            </View>
          ) : undefined,
        }} 
      />
      <View className="flex-1 bg-background">
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerClassName="pb-24"
          keyboardShouldPersistTaps="handled"
        >
        <View className="gap-6 p-4">
          {/* Original vs Slop */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">BEFORE</Text>
            <Image
              source={{ uri: displaySlop.original_uri }}
              className="aspect-square w-full rounded-xl"
              resizeMode="cover"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">AFTER</Text>
            <Image
              source={{ uri: displaySlop.slop_uri }}
              className="aspect-square w-full rounded-xl"
              resizeMode="cover"
            />
          </View>

          {/* Caption */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-muted-foreground">CAPTION</Text>
              {slop && (
                <Pressable 
                  onPress={handleRegenerateCaption}
                  disabled={regeneratingCaption}
                  className="flex-row items-center gap-1"
                >
                  {regeneratingCaption ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <>
                      <Icon as={RefreshCwIcon} className="size-3 text-primary" />
                      <Text className="text-xs text-primary">Regenerate</Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
            <Pressable 
              onPress={slop ? handleEditCaption : undefined}
              className="rounded-xl bg-card p-4 flex-row items-center gap-2"
            >
              <Text className="text-center text-lg italic text-foreground flex-1">
                "{displaySlop.caption}"
              </Text>
              {slop && <Icon as={PencilIcon} className="size-4 text-muted-foreground" />}
            </Pressable>
          </View>

          {/* Share & Copy Buttons */}
          <View className="flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onPress={handleShareImage}
            >
              <Icon as={ShareIcon} className="size-4 mr-2" />
              <Text>Share Image</Text>
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onPress={handleCopyCaption}
            >
              <Icon as={CopyIcon} className="size-4 mr-2" />
              <Text>Copy Caption</Text>
            </Button>
          </View>

          {/* Metadata */}
          <View className="flex-row justify-between items-center">
            <Text className="text-xs text-muted-foreground">
              Level: {displaySlop.slop_level}
            </Text>
            {displaySlop.slop_mode && SLOP_MODES[displaySlop.slop_mode as SlopMode] && (
              <Text className="text-xs text-muted-foreground">
                {SLOP_MODES[displaySlop.slop_mode as SlopMode].emoji} {SLOP_MODES[displaySlop.slop_mode as SlopMode].label}
              </Text>
            )}
            <Text className="text-xs text-muted-foreground">
              {new Date(displaySlop.created_at).toLocaleDateString()}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onPress={() => router.replace('/')}
            >
              <Text>Dashboard</Text>
            </Button>
            <Button 
              className="flex-1"
              onPress={() => router.replace('/lab' as any)}
            >
              <Text>Create Another</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
      </View>
    </>
  );
}
