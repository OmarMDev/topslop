import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSlops } from '@/hooks/useSlops';
import { SLOP_MODES, SlopMode } from '@/lib/constants';
import { Link, Stack, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { HeartIcon, HeartOffIcon, HelpCircleIcon, ImageOffIcon, PlusIcon, SettingsIcon, SparklesIcon, BarChart3Icon } from 'lucide-react-native';
import { useCallback } from 'react';
import { View, FlatList, Image, Pressable, ActivityIndicator, RefreshControl } from 'react-native';

export default function DashboardScreen() {
  const { slops, loading, refresh, favoritesOnly, setFavoritesOnly, stats } = useSlops();

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const toggleFavoritesFilter = () => {
    Haptics.selectionAsync();
    setFavoritesOnly(!favoritesOnly);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Slopify',
          headerRight: () => (
            <View className="flex-row items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onPress={toggleFavoritesFilter}
              >
                <Icon 
                  as={HeartIcon} 
                  className={`size-5 ${favoritesOnly ? 'text-red-500' : 'text-foreground'}`}
                  fill={favoritesOnly ? '#ef4444' : 'transparent'}
                />
              </Button>
              <Link href="/settings" asChild>
                <Button variant="ghost" size="sm">
                  <Icon as={SettingsIcon} className="size-5 text-foreground" />
                </Button>
              </Link>
              <Link href="/help" asChild>
                <Button variant="ghost" size="sm">
                  <Icon as={HelpCircleIcon} className="size-5 text-foreground" />
                </Button>
              </Link>
            </View>
          ),
        }} 
      />
      <View className="flex-1 bg-background">
        {loading && slops.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : slops.length === 0 && !favoritesOnly ? (
          <View className="flex-1 items-center justify-center gap-6 p-6">
            <Icon as={ImageOffIcon} className="size-16 text-muted-foreground" />
            <Text className="text-center text-xl font-semibold text-foreground">
              No slops yet
            </Text>
            <Text className="text-center text-muted-foreground">
              Time to ruin some perfectly good photos
            </Text>
            <Link href="/lab" asChild>
              <Button size="lg">
                <Text>Enter The Lab</Text>
              </Button>
            </Link>
          </View>
        ) : slops.length === 0 && favoritesOnly ? (
          <View className="flex-1 items-center justify-center gap-6 p-6">
            <Icon as={HeartOffIcon} className="size-16 text-muted-foreground" />
            <Text className="text-center text-xl font-semibold text-foreground">
              No favorites yet
            </Text>
            <Text className="text-center text-muted-foreground">
              Tap the heart on a slop to save it here
            </Text>
            <Button variant="outline" onPress={toggleFavoritesFilter}>
              <Text>Show All Slops</Text>
            </Button>
          </View>
        ) : (
          <>
            <FlatList
              data={slops}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ gap: 16, padding: 16, paddingBottom: 100 }}
              columnWrapperStyle={{ gap: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                  tintColor="#888"
                />
              }
              ListHeaderComponent={
                stats.total > 0 ? (
                  <View className="mb-2 p-3 bg-card rounded-xl flex-row items-center justify-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Icon as={BarChart3Icon} className="size-4 text-muted-foreground" />
                      <Text className="font-semibold text-foreground">{stats.total}</Text>
                      <Text className="text-muted-foreground">created</Text>
                    </View>
                    {stats.favorites > 0 && (
                      <View className="flex-row items-center gap-1">
                        <Icon as={HeartIcon} className="size-4 text-red-500" fill="#ef4444" />
                        <Text className="font-semibold text-foreground">{stats.favorites}</Text>
                      </View>
                    )}
                    {stats.mostUsedMode && SLOP_MODES[stats.mostUsedMode as SlopMode] && (
                      <Text className="text-muted-foreground">{SLOP_MODES[stats.mostUsedMode as SlopMode].label}</Text>
                    )}
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <Link href={`/result?id=${item.id}` as any} asChild>
                  <Pressable className="flex-1">
                    <Card className="overflow-hidden p-0 gap-0">
                      <View className="relative">
                        <Image
                          source={{ uri: item.slop_uri }}
                          className="aspect-square w-full"
                          resizeMode="cover"
                        />
                        {item.is_favorite === 1 && (
                          <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                            <Icon as={HeartIcon} className="size-4 text-red-500" fill="#ef4444" />
                          </View>
                        )}
                      </View>
                      <View className="p-2">
                        <Text 
                          numberOfLines={2} 
                          className="text-xs text-muted-foreground"
                        >
                          {item.caption}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                </Link>
              )}
            />
            {/* Floating Action Button */}
            <View className="absolute bottom-6 right-6">
              <Link href="/lab" asChild>
                <Pressable className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Icon as={PlusIcon} className="size-7 text-primary-foreground" />
                </Pressable>
              </Link>
            </View>
          </>
        )}
      </View>
    </>
  );
}
