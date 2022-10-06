import type { ComponentType, ReactElement } from 'react';
import type { AnyFramework } from '@storybook/csf';

export type { RenderContext } from '@storybook/store';
export type { StoryContext } from '@storybook/csf';

// export interface ReactFramework extends AnyFramework {
//   component: ComponentType<this['T']>;
//   storyResult: StoryFnReactReturnType;
// }

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

export interface IStorybookStory {
  name: string;
  render: (context: any) => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export type Framework = {
  component: unknown;
  T: unknown; // higher kinded type
  storyResult: unknown;
};

export interface ReactFramework extends Framework {
  component: ComponentType<this['T']>; // reference the higher kinded type
  storyResult: StoryFnReactReturnType;
}

// used like this:
interface ComponentAnnotations<TFramework extends Framework, TArgs> {
  // specify the generic type with an intersection
  component?: (TFramework & { T: TArgs })['component'];

  // falls back to unknown, if you don't intersect T
  subcomponents?: Record<string, TFramework['component']>;
}
