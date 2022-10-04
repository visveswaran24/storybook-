import { AnnotatedStoryFn, Args, ComponentAnnotations, StoryAnnotations } from '@storybook/csf';
import { ComponentType, JSXElementConstructor } from 'react';
import { ReactFramework } from './types';
import { ArgsStoryFn, DecoratorFunction } from '../../../../../csf/src';

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
export type StoryObj<MetaOrArgs = Args> = MetaOrArgs extends {
  render?: ArgsStoryFn<ReactFramework, infer StoryArgs>;
  decorators?: DecoratorFunction<ReactFramework, infer StoryArgs>[];
  component?: ComponentType<infer CmpArgs>;
  args?: infer D;
}
  ? (unknown extends StoryArgs ? CmpArgs : StoryArgs) extends infer Args
    ? StoryAnnotations<ReactFramework<CmpArgs>, Args> & StrictStoryArgs<Args, D>
    : never
  : StoryAnnotations<ReactFramework, MetaOrArgs>;

type StrictStoryArgs<Args, D> = {} extends MakeOptional<Args, D & ActionArgs<Args>>
  ? { args?: Partial<Args> }
  : { args: MakeOptional<Args, D & ActionArgs<Args>> };

type ActionArgs<Args> = {
  [P in keyof Args as ((...args: any[]) => void) extends Args[P] ? P : never]: Args[P];
};

type MakeOptional<T, O> = Omit<T, keyof O> & Partial<Pick<T, Extract<keyof T, keyof O>>>;
