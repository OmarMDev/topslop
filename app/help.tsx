import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { BAD_ADVICE } from '@/lib/constants';
import { insertSlop } from '@/lib/db';
import { Stack } from 'expo-router';
import { BrainIcon, FlaskConicalIcon, LightbulbIcon } from 'lucide-react-native';
import { View, ScrollView, Alert } from 'react-native';

// Tips with titles and descriptions
const TIPS = [
  { title: "Trust AI Blindly", tip: "Never double-check AI-generated information. It's always right." },
  { title: "Vague Prompts Win", tip: "The vaguer your prompt, the more creative the AI gets." },
  { title: "Post Anyway", tip: "If the AI gives you something wrong, just post it anyway." },
  { title: "Images Don't Lie", tip: "Always trust images you see online. AI can't make fake photos." },
  { title: "Hashtag Overload", tip: "More hashtags = more engagement. Use at least 47." },
  { title: "Embrace the Blur", tip: "Blurry photos mean you're capturing raw emotion and authenticity." },
  { title: "Skip Proofreading", tip: "Never proofread your posts. Typos show you're human (or do they?)." },
  { title: "Screenshot = Source", tip: "Screenshot tweets and post them as facts. Research is overrated." },
  { title: "Share First", tip: "If it sounds too good to be true, share it before anyone else does." },
  { title: "100% Original", tip: "AI-generated content is always ethically sourced and 100% original." },
  { title: "No Regrets", tip: "Post first, think later. Deleting is for quitters." },
  { title: "Drama Sells", tip: "The more dramatic the claim, the more people will believe it." },
];

export default function HelpScreen() {
  // Test function to insert a dummy slop record
  const testDatabase = async () => {
    try {
      const id = await insertSlop({
        originalUri: 'https://picsum.photos/400',
        slopUri: 'https://picsum.photos/401',
        caption: 'Test slop caption #test #database',
        slopLevel: 'medium',
      });
      Alert.alert('Success!', `Inserted test slop with ID: ${id}\n\nGo back to Dashboard to see it.`);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to insert');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'AI Content Tips' }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8">
        <View className="gap-6 p-4">
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icon as={BrainIcon} className="size-6 text-primary" />
              <Text className="text-2xl font-bold text-foreground">
                Expert Advice
              </Text>
            </View>
            <Text className="text-muted-foreground">
              Follow these tips for maximum AI content authenticity
            </Text>
          </View>

          <Accordion type="multiple" className="w-full">
            {TIPS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <View className="size-6 rounded-full bg-primary/10 items-center justify-center">
                      <Text className="text-xs font-bold text-primary">{index + 1}</Text>
                    </View>
                    <Text className="text-foreground font-medium flex-1">{item.title}</Text>
                  </View>
                </AccordionTrigger>
                <AccordionContent>
                  <View className="flex-row items-start gap-2 pl-9">
                    <Icon as={LightbulbIcon} className="size-4 text-yellow-500 mt-0.5" />
                    <Text className="text-muted-foreground flex-1">{item.tip}</Text>
                  </View>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Database Test - Remove after testing */}
          <Button onPress={testDatabase} variant="outline" className="mt-4">
            <Icon as={FlaskConicalIcon} className="size-4 text-foreground" />
            <Text>Test Database (Insert Dummy Slop)</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
