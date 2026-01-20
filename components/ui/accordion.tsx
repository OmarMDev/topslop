import * as AccordionPrimitive from '@rn-primitives/accordion';
import { ChevronDownIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { TextClassContext } from '@/components/ui/text';

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ children, ...props }, ref) => {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root ref={ref} {...props}>
        <Animated.View layout={LinearTransition.duration(200)}>{children}</Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  );
});
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, value, ...props }, ref) => {
  return (
    <Animated.View className={'overflow-hidden'} layout={LinearTransition.duration(200)}>
      <AccordionPrimitive.Item ref={ref} className={cn('border-b border-border', className)} value={value} {...props} />
    </Animated.View>
  );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  const progress = useDerivedValue(() =>
    isExpanded ? withTiming(1, { duration: 200 }) : withTiming(0, { duration: 200 })
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180], Extrapolation.CLAMP)}deg` }],
  }));

  return (
    <TextClassContext.Provider value='text-foreground text-sm native:text-base font-medium'>
      <AccordionPrimitive.Header className='flex'>
        <AccordionPrimitive.Trigger ref={ref} {...props} asChild>
          <Pressable
            className={cn(
              'flex flex-row items-center justify-between py-4 web:transition-all group web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-ring',
              className
            )}
          >
            {typeof children === 'function' ? children({ pressed: false, hovered: false }) : children}
            <Animated.View style={chevronStyle}>
              <ChevronDownIcon size={18} className={'text-foreground shrink-0'} />
            </Animated.View>
          </Pressable>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { isExpanded } = AccordionPrimitive.useItemContext();

  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn('overflow-hidden text-sm', className)}
      {...props}
    >
      <InnerContent isExpanded={isExpanded}>{children}</InnerContent>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = 'AccordionContent';

function InnerContent({ children, isExpanded }: { children: React.ReactNode; isExpanded: boolean }) {
  if (!isExpanded) {
    return null;
  }

  if (Platform.OS === 'web') {
    return (
      <View className='pb-4'>
        {children}
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOutUp.duration(200)}
      className='pb-4'
    >
      {children}
    </Animated.View>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
