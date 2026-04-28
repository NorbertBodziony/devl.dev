// @ts-nocheck
import { createContext, createEffect, createMemo, createSignal, splitProps, useContext } from "solid-js";
import { Primitive } from "./_primitive";

const CheckboxGroupContext = createContext<any>();

export function useCheckboxGroup() {
  return useContext(CheckboxGroupContext);
}

export function CheckboxGroup(props: any) {
  const [local, others] = splitProps(props, ["children", "defaultValue", "value", "onValueChange"]);
  const controlled = createMemo(() => Array.isArray(local.value));
  const [value, setValue] = createSignal<string[]>(local.value ?? local.defaultValue ?? []);

  createEffect(() => {
    if (controlled()) setValue(local.value ?? []);
  });

  const setItem = (item: string, checked: boolean) => {
    const next = checked
      ? Array.from(new Set([...value(), item]))
      : value().filter((current) => current !== item);

    if (!controlled()) setValue(next);
    local.onValueChange?.(next);
  };

  return (
    <CheckboxGroupContext.Provider
      value={{
        isChecked: (item: string) => value().includes(item),
        setItem,
      }}
    >
      <Primitive role="group" {...others}>
        {local.children}
      </Primitive>
    </CheckboxGroupContext.Provider>
  );
}
