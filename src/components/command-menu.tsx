"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Link2Icon } from "@radix-ui/react-icons";
import { demos } from "@/lib/demos";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search demos...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Demos">
            {demos.map((demo) => (
              <CommandItem
                key={demo.href}
                value={demo.name}
                onSelect={() => {
                  runCommand(() => router.push(demo.href));
                }}
              >
                <Link2Icon className="mr-2 h-4 w-4" />
                {demo.name}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* might be cool if we get many demos */}
          {/* {demos.map((demo) => ( */}
          {/*   <CommandGroup key={demo.name} heading={demo.name}> */}
          {/*     {demos.map((demo) => ( */}
          {/*       <CommandItem */}
          {/*         key={demo.href} */}
          {/*         value={demo.name} */}
          {/*         onSelect={() => { */}
          {/*           runCommand(() => router.push(demo.href)); */}
          {/*         }} */}
          {/*       > */}
          {/*         <div className="mr-2 flex h-4 w-4 items-center justify-center"> */}
          {/*           <CircleIcon className="h-3 w-3" /> */}
          {/*         </div> */}
          {/*         {demo.name} */}
          {/*       </CommandItem> */}
          {/*     ))} */}
          {/*   </CommandGroup> */}
          {/* ))} */}

          {/* might be cool if i want to have mode switching */}
          {/*   <CommandSeparator /> */}
          {/*   <CommandGroup heading="Theme"> */}
          {/*     <CommandItem onSelect={() => runCommand(() => setTheme("light"))}> */}
          {/*       <SunIcon className="mr-2 h-4 w-4" /> */}
          {/*       Light */}
          {/*     </CommandItem> */}
          {/*     <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}> */}
          {/*       <MoonIcon className="mr-2 h-4 w-4" /> */}
          {/*       Dark */}
          {/*     </CommandItem> */}
          {/*     <CommandItem onSelect={() => runCommand(() => setTheme("system"))}> */}
          {/*       <LaptopIcon className="mr-2 h-4 w-4" /> */}
          {/*       System */}
          {/*     </CommandItem> */}
          {/*   </CommandGroup> */}
        </CommandList>
      </CommandDialog>
    </>
  );
}
