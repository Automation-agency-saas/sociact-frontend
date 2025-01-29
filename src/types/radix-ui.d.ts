declare module '@radix-ui/react-tabs' {
  import * as React from 'react';

  type TabsProps = {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    orientation?: 'horizontal' | 'vertical';
    dir?: 'ltr' | 'rtl';
    activationMode?: 'automatic' | 'manual';
  } & React.ComponentPropsWithoutRef<'div'>;

  type TabsListProps = React.ComponentPropsWithoutRef<'div'>;
  type TabsTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
    value: string;
  };
  type TabsContentProps = React.ComponentPropsWithoutRef<'div'> & {
    value: string;
  };

  const Root: React.FC<TabsProps>;
  const List: React.FC<TabsListProps>;
  const Trigger: React.FC<TabsTriggerProps>;
  const Content: React.FC<TabsContentProps>;

  export { Root, List, Trigger, Content };
} 