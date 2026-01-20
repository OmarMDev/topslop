import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { SLOP_LEVELS, SlopLevel, SLOP_MODES, SlopMode } from '@/lib/constants';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ChevronDownIcon, CheckIcon, ShuffleIcon, SparklesIcon } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Image, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function RefineryScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [selectedLevel, setSelectedLevel] = useState<SlopLevel>('medium');
  const [selectedMode, setSelectedMode] = useState<SlopMode>('facebook');
  const [context, setContext] = useState('');
  const decodedUri = decodeURIComponent(photoUri || '');
  
  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const modesList = Object.keys(SLOP_MODES) as SlopMode[];

  const handleSlopify = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const params = new URLSearchParams({
      photoUri: decodedUri,
      level: selectedLevel,
      mode: selectedMode,
    });
    if (context.trim()) {
      params.set('context', context.trim());
    }
    router.push(`/process?${params.toString()}` as any);
  };

  const handleSurpriseMe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const randomMode = modesList[Math.floor(Math.random() * modesList.length)];
    const levels = Object.keys(SLOP_LEVELS) as SlopLevel[];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    setSelectedMode(randomMode);
    setSelectedLevel(randomLevel);
  };

  const openModeSelector = () => {
    Haptics.selectionAsync();
    bottomSheetRef.current?.expand();
  };

  const selectMode = (mode: SlopMode) => {
    Haptics.selectionAsync();
    setSelectedMode(mode);
    bottomSheetRef.current?.close();
  };

  const selectLevel = (level: SlopLevel) => {
    Haptics.selectionAsync();
    setSelectedLevel(level);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderModeItem = useCallback(
    ({ item }: { item: SlopMode }) => {
      const mode = SLOP_MODES[item];
      const isSelected = item === selectedMode;
      
      return (
        <Pressable
          onPress={() => selectMode(item)}
          className={`flex-row items-center p-4 mx-4 my-1 rounded-xl ${
            isSelected ? 'bg-primary/10' : 'bg-transparent'
          }`}
        >
          <Text className="text-2xl mr-3">{mode.emoji}</Text>
          <View className="flex-1">
            <Text className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
              {mode.label}
            </Text>
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              {mode.description}
            </Text>
          </View>
          {isSelected && (
            <Icon as={CheckIcon} className="size-5 text-primary" />
          )}
        </Pressable>
      );
    },
    [selectedMode]
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Choose Your Slop' }} />
      <View style={StyleSheet.absoluteFill} className="bg-background">
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-6 p-4">
            {/* Image Preview */}
            <View className="overflow-hidden rounded-xl">
              <Image
                source={{ uri: decodedUri }}
                className="aspect-square w-full"
                resizeMode="cover"
              />
            </View>

            {/* Platform Selector Button */}
            <View className="gap-2">
              <Text className="text-lg font-semibold text-foreground">
                Choose Your Platform
              </Text>
              <Pressable
                onPress={openModeSelector}
                className="flex-row items-center justify-between p-4 rounded-xl border-2 border-border bg-card"
              >
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{SLOP_MODES[selectedMode].emoji}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {SLOP_MODES[selectedMode].label}
                    </Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {SLOP_MODES[selectedMode].description}
                    </Text>
                  </View>
                </View>
                <Icon as={ChevronDownIcon} className="size-5 text-muted-foreground" />
              </Pressable>
            </View>

            {/* Slop Level Selector */}
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">
                Select Slop Intensity
              </Text>
              
              {(Object.keys(SLOP_LEVELS) as SlopLevel[]).map((level) => (
                <Pressable
                  key={level}
                  onPress={() => selectLevel(level)}
                  className={`rounded-xl border-2 p-4 ${
                    selectedLevel === level 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border bg-card'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    selectedLevel === level ? 'text-primary' : 'text-foreground'
                  }`}>
                    {SLOP_LEVELS[level].label}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {SLOP_LEVELS[level].prompt}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Optional Context */}
            <View className="gap-2">
              <Text className="text-lg font-semibold text-foreground">
                Add Context <Text className="text-muted-foreground font-normal">(optional)</Text>
              </Text>
              <TextInput
                value={context}
                onChangeText={setContext}
                placeholder="e.g., 'make it look like a 90s album cover' or 'add more chaos'"
                placeholderTextColor="#888"
                multiline
                className="min-h-[80px] p-3 border border-border rounded-xl bg-card text-foreground"
              />
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mt-4">
              <Button 
                variant="outline" 
                size="lg" 
                onPress={handleSurpriseMe}
                className="flex-row items-center justify-center gap-2"
              >
                <Icon as={ShuffleIcon} className="size-5" />
                <Text>Surprise Me</Text>
              </Button>
              
              <Button size="lg" onPress={handleSlopify} className="flex-row items-center justify-center gap-2">
                <Icon as={SparklesIcon} className="size-5" />
                <Text>Slopify It</Text>
              </Button>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Sheet for Mode Selection */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: '#1c1c1e' }}
          handleIndicatorStyle={{ backgroundColor: '#888' }}
        >
          <View className="px-4 pb-2 border-b border-border">
            <Text className="text-lg font-semibold text-foreground text-center">
              Select Platform
            </Text>
          </View>
          <BottomSheetFlatList
            data={modesList}
            keyExtractor={(item: SlopMode) => item}
            renderItem={renderModeItem}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </BottomSheet>
      </View>
    </>
  );
}
