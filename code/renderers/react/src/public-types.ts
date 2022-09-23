import { AnnotatedStoryFn, Args, ComponentAnnotations, StoryAnnotations } from '@storybook/csf';
import { ComponentProps, ComponentType, JSXElementConstructor } from 'react';
import { ReactFramework } from './types';

type JSXElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<
  CmpOrArgs = Args,
  StoryArgs = CmpOrArgs extends ComponentType<infer CmpArgs> ? CmpArgs : CmpOrArgs
> = CmpOrArgs extends ComponentType<infer CmpArgs>
  ? ComponentAnnotations<ReactFramework<CmpArgs>, StoryArgs>
  : ComponentAnnotations<ReactFramework<CmpOrArgs>, StoryArgs>;

/**
 * Story function that represents a CSFv2 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryFn<TArgs = Args> = AnnotatedStoryFn<ReactFramework, TArgs>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type StoryObj<TArgs = Args> = StoryAnnotations<ReactFramework, TArgs>;

/**
 * For the common case where a component's stories are simple components that receives args as props:
 *
 * ```tsx
 * export default { ... } as ComponentMeta<typeof Button>;
 * ```
 */
export type ComponentMeta<T extends JSXElement> = Meta<ComponentProps<T>>;

/**
 * For the common case where a (CSFv2) story is a simple component that receives args as props:
 *
 * ```tsx
 * const Template: ComponentStoryFn<typeof Button> = (args) => <Button {...args} />
 * ```
 */
export type ComponentStoryFn<T extends JSXElement> = StoryFn<ComponentProps<T>>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStoryObj<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */
export type ComponentStoryObj<T extends JSXElement> = StoryObj<ComponentProps<T>>;

/**
 * Story function that represents a CSFv3 component example.
 *
 * @see [Named Story exports](https://storybook.js.org/docs/formats/component-story-format/#named-story-exports)
 */
export type Story<
  MetaOrArgs = Args,
  StoryArgs = MetaOrArgs extends { component: ComponentType<infer CmpArgs> } ? CmpArgs : MetaOrArgs
> = MetaOrArgs extends {
  component: ComponentType<infer CmpArgs>;
  args?: infer D;
}
  ? StoryAnnotations<ReactFramework<CmpArgs>, StoryArgs> &
      ({} extends MakeOptional<StoryArgs, D & ActionArgs<StoryArgs>>
        ? unknown
        : { args: MakeOptional<StoryArgs, D & ActionArgs<StoryArgs>> })
  : StoryAnnotations<ReactFramework, MetaOrArgs>;

/**
 * For the common case where a (CSFv3) story is a simple component that receives args as props:
 *
 * ```tsx
 * const MyStory: ComponentStory<typeof Button> = {
 *   args: { buttonArg1: 'val' },
 * }
 * ```
 */ export type ComponentStory<T extends JSXElement> = ComponentStoryObj<T>;

type ActionArgs<Args> = {
  [P in keyof Args as ((...args: any[]) => void) extends Args[P] ? P : never]: Args[P];
};

type MakeOptional<T, O> = Omit<T, keyof O> & Partial<Pick<T, Extract<keyof T, keyof O>>>;
