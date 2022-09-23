import React, { ComponentType, KeyboardEventHandler, ReactElement, ReactNode } from 'react';
import { Meta, Story } from '../public-types';

interface ButtonProps {
  label: string;
  disabled: boolean;
}

declare const Button: (props: ButtonProps) => JSX.Element;

/**
 * Mimicking the satisfies operator.
 */
function satisfies<A>() {
  return <T extends A>(x: T) => x;
}

// ✅ valid
export const meta1 = satisfies<Meta<typeof Button>>()({
  component: Button,
  args: { label: 'good', disabled: false },
});

export const Basic1: Story<typeof meta1> = {};

// // ✅ valid
export const meta2 = satisfies<Meta<typeof Button>>()({
  component: Button,
  args: { label: 'good' },
});

export const Basic2: Story<typeof meta2> = {
  args: { disabled: false },
};

// ❌ invalid
const meta3 = satisfies<Meta<typeof Button>>()({
  component: Button,
});

export const Basic3: Story<typeof meta3> = {
  // @ts-expect-error disabled not provided
  args: { label: 'good' },
};

// ❌ invalid
const meta4 = satisfies<Meta<typeof Button>>()({
  component: Button,
  args: { label: 'good' },
});

// @ts-expect-error disabled not provided
export const Basic4: Story<typeof meta4> = {};

// ❌ invalid
const meta5 = satisfies<Meta<ButtonProps>>()({
  component: Button,
});

export const Basic5: Story<typeof meta5> = {
  // @ts-expect-error disabled not provided
  args: { label: 'good' },
};

interface ButtonProps2 {
  label: string;
  disabled: boolean;
  onClick(): void;
  onKeyDown: KeyboardEventHandler;
  onLoading: (s: string) => JSX.Element;
  submitAction(): void;
}

declare const Button2: (props: ButtonProps2) => JSX.Element;

// ✅ valid
const meta6 = satisfies<Meta<ButtonProps2>>()({
  component: Button2,
  args: { label: 'good' },
});

export const Basic6: Story<typeof meta6> = {
  // all functions are optional, except onLoading
  args: { disabled: false, onLoading: () => <div>Loading...</div> },
};

type ThemeData = 'light' | 'dark';
declare const Theme: (props: { theme: ThemeData; children?: ReactNode }) => JSX.Element;
type Props = ButtonProps & { theme: ThemeData };

export const meta7 = satisfies<Meta<Props>>()({
  component: Button,
  args: { label: 'good', disabled: false },
  render: (args, { component }) => {
    // component is not null as it is provided in meta
    // TODO: Might be nice if we can infer that.
    // eslint-disable-next-line
    const Component = component!;
    return (
      <Theme theme={args.theme}>
        <Component {...args} />
      </Theme>
    );
  },
});

export const Basic: Story<typeof meta7, Props> = {
  args: { theme: 'light' },
};
