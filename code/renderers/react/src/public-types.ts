import type {
  AnnotatedStoryFn,
  Args,
  ComponentAnnotations,
  StoryAnnotations,
  ArgsStoryFn,
  DecoratorFunction,
  LoaderFunction,
} from '@storybook/csf';
import { ComponentType, JSXElementConstructor } from 'react';
import { ReactFramework } from './types';

type JSXElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

/**
 * Metadata to configure the stories for a component.
 *
 * @see [Default export](https://storybook.js.org/docs/formats/component-story-format/#default-export)
 */
export type Meta<CmpOrArgs = Args> = CmpOrArgs extends ComponentType<infer CmpArgs>
  ? ComponentAnnotations<ReactFramework, CmpArgs>
  : ComponentAnnotations<ReactFramework, CmpOrArgs>;

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

export type StoryObj<MetaOrArgs = Args> = MetaOrArgs extends {
  render?: ArgsStoryFn<ReactFramework, infer RArgs>;
  decorators?: DecoratorFunction<ReactFramework, infer DArgs>[];
  component?: ComponentType<infer CmpArgs>;
  loaders?: LoaderFunction<ReactFramework, infer LArgs>[];
  args?: infer DefaultArgs;
}
  ? CmpArgs & RArgs & DArgs & LArgs extends infer Args
    ? StoryAnnotations<
        ReactFramework,
        Args,
        SetOptional<Args, keyof (DefaultArgs & ActionArgs<Args>)>
      >
    : never
  : StoryAnnotations<ReactFramework, MetaOrArgs>;

type ActionArgs<Args> = {
  [P in keyof Args as ((...args: any[]) => void) extends Args[P] ? P : never]: Args[P];
};

type SetOptional<T, K> = {
  [P in keyof T as P extends K ? P : never]?: T[P];
} & {
  [P in keyof T as P extends K ? never : P]: T[P];
};
