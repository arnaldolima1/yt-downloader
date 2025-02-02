import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMemo } from "react";


interface CustomSelectProps {
  onValueChange: (value: string | undefined) => void;
  defaultValue?: { value: string; label: string };
  placeholder?: string;
  options: {
    label: string;
    items: { value: string; label: string }[];
  }[];
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export function CustomSelect({
  onValueChange,
  defaultValue,
  placeholder,
  options,
  className,
  triggerClassName,
  contentClassName,
}: CustomSelectProps) {
  const insets = useSafeAreaInsets();

  const contentInsets = useMemo(
    () => ({
      top: insets.top,
      bottom: insets.bottom,
      left: 12,
      right: 12,
    }),
    [insets.top, insets.bottom] // Apenas atualiza se mudar
  );

  return (
    <Select
      defaultValue={defaultValue}
      className={cn("", className)}
      onValueChange={(e) => onValueChange(e?.value)}
    >
      <SelectTrigger
        className={cn(
          "border border-border bg-background text-foreground rounded-lg p-2",
          triggerClassName
        )}
      >
        <SelectValue
          className="text-sm text-foreground native:text-lg"
          placeholder={placeholder || "Select an option"}
        />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        align="center"
        className={cn("border border-border shadow-md", contentClassName)}
      >
        {options.map((group, index) => (
          <SelectGroup key={index} className="bg-background">
            <SelectLabel className=" justify-start text-xs uppercase text-muted-foreground ">
              {group.label}
            </SelectLabel>
            {group.items.map((item) => (
              <SelectItem
                key={item.value}
                label={item.label}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
