"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { COUNTRIES } from "@/lib/zedas-data";
import Flag from "./flag";

interface CountrySearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (isoN: number) => void;
}

// Pilot countries sorted alphabetically for predictable scanning.
const SORTED = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name));

export default function CountrySearch({
  open,
  onOpenChange,
  onSelect,
}: CountrySearchProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-zd-overlay
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/45 backdrop-blur-[2px]"
        />
        <Dialog.Content
          data-zd-modal
          className="fixed inset-x-0 bottom-0 z-[var(--z-modal)] w-full overflow-hidden rounded-t-2xl border border-border bg-surface shadow-2xl pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-[18%] sm:w-[min(32rem,92vw)] sm:-translate-x-1/2 sm:rounded-2xl"
        >
          <Dialog.Title className="sr-only">Search countries</Dialog.Title>
          <Dialog.Description className="sr-only">
            Find a pilot country by name. Use the arrow keys and Enter to select.
          </Dialog.Description>
          <Command
            loop
            filter={(value, search) =>
              value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
            }
          >
            <div className="flex items-center gap-2 border-b border-border px-3.5">
              <Search className="size-4 shrink-0 text-muted" aria-hidden />
              <Command.Input
                aria-label="Search countries"
                placeholder="Search pilot countries…"
                spellCheck={false}
                autoComplete="off"
                className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
              />
            </div>
            <Command.List className="max-h-[min(20rem,60dvh)] overflow-y-auto p-1.5 [overscroll-behavior:contain]">
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
                No country found.
              </Command.Empty>
              {SORTED.map((c) => (
                <Command.Item
                  key={c.isoN}
                  value={c.name}
                  onSelect={() => onSelect(c.isoN)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground data-[selected=true]:bg-surface-2"
                >
                  <Flag isoN={c.isoN} className="h-4 w-auto" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-[11px] text-muted">
                    {c.region}
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
