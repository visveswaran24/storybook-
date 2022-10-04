/* eslint-disable jest/expect-expect */
import React, { KeyboardEventHandler, ReactNode } from 'react';
import { Meta, StoryObj } from '../public-types';
import { DecoratorFn } from '../public-api';
import { describe, satisfies, test } from './utils';

type ButtonProps = { label: string; disabled: boolean };
const Button: (props: ButtonProps) => JSX.Element = () => <></>;

describe('Args can be provided in multiple ways', () => {
  test('✅All required args may be provided in meta', () => {
    const meta = satisfies<Meta<typeof Button>>()({
      component: Button,
      args: { label: 'good', disabled: false },
    });

    type Story = StoryObj<typeof meta>;
    const Basic: Story = {};
  });

  test('✅ Required args may be provided partial in meta and the story', () => {
    const meta = satisfies<Meta<typeof Button>>()({
      component: Button,
      args: { label: 'good' },
    });
    const Basic: StoryObj<typeof meta> = {
      args: { disabled: false },
    };
  });

  test('❌ The combined shape of meta args and story args must match the required args.', () => {
    {
      const meta = satisfies<Meta<typeof Button>>()({ component: Button });
      const Basic: StoryObj<typeof meta> = {
        // @ts-expect-error disabled not provided ❌
        args: { label: 'good' },
      };
    }
    {
      const meta = satisfies<Meta<typeof Button>>()({
        component: Button,
        args: { label: 'good' },
      });
      // @ts-expect-error disabled not provided ❌
      const Basic: StoryObj<typeof meta> = {};
    }
    {
      const meta = satisfies<Meta<ButtonProps>>()({ component: Button });
      const Basic: StoryObj<typeof meta> = {
        // @ts-expect-error disabled not provided ❌
        args: { label: 'good' },
      };
    }
  });
});

test('✅ All void functions are optional', () => {
  interface CmpProps {
    label: string;
    disabled: boolean;
    onClick(): void;
    onKeyDown: KeyboardEventHandler;
    onLoading: (s: string) => JSX.Element;
    submitAction(): void;
  }

  const Cmp: (props: CmpProps) => JSX.Element = () => <></>;

  const meta = satisfies<Meta<CmpProps>>()({
    component: Cmp,
    args: { label: 'good' },
  });

  const Basic: StoryObj<typeof meta> = {
    args: { disabled: false, onLoading: () => <div>Loading...</div> },
  };
});

type ThemeData = 'light' | 'dark';
declare const Theme: (props: { theme: ThemeData; children?: ReactNode }) => JSX.Element;

describe('Story args can be inferred', () => {
  test('Correct args are inferred when type is widened for render function', () => {
    type Props = ButtonProps & { theme: ThemeData };

    const meta = satisfies<Meta<Props>>()({
      component: Button,
      args: { label: 'good', disabled: false },
      render: (args, { component }) => {
        // TODO: Might be nice if we can infer that.
        // component is not null as it is provided in meta
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const Component = component!;
        return (
          <Theme theme={args.theme}>
            <Component {...args} />
          </Theme>
        );
      },
    });

    const Basic: StoryObj<typeof meta> = { args: { theme: 'light' } };
  });

  test('Correct args are inferred when type is widened for decorators', () => {
    type Props = ButtonProps & { decoratorArg: number };

    const withDecorator: DecoratorFn<{ decoratorArg: number }> = (Story, { args }) => (
      <>
        Decorator: {args.decoratorArg}
        This Story allows optional TArgs, but the decorator only knows about the decoratorArg. It
        should really allow optionally a Partial of TArgs.
        <Story args={{ decoratorArg: 0 }} />
      </>
    );

    const meta = satisfies<Meta<Props>>()({
      component: Button,
      args: { label: 'good', disabled: false },
      decorators: [withDecorator],
    });

    // Yes, decorator arg is required
    const Basic: StoryObj<typeof meta> = { args: { decoratorArg: 0 } };
  });
});
