"use client"

import React from "react";
import { Controller, Control } from "react-hook-form";

type FormProps = React.PropsWithChildren<Record<string, any>>;

export function Form(props: FormProps) {
  return <>{props.children}</>;
}

export function FormControl({ children, ...rest }: any) {
  return <div {...rest}>{children}</div>;
}

export function FormItem({ children, ...rest }: any) {
  return <div {...rest}>{children}</div>;
}

export function FormLabel({ children, ...rest }: any) {
  return <label {...rest}>{children}</label>;
}

export function FormMessage({ children, ...rest }: any) {
  return <p {...rest}>{children}</p>;
}

type FormFieldProps = {
  control: any;
  name: any;
  render: (args: { field: any }) => React.ReactElement;
};

export function FormField({ control, name, render }: FormFieldProps) {
  // Use any casts to avoid strict generic incompatibilities across projects.
  return <Controller control={control as any} name={name as any} render={(fieldProps: any) => render({ field: fieldProps.field })} /> as any;
}
