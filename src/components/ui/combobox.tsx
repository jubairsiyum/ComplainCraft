"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Filter options based on search - check both label and value
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    const search = searchValue.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(search) ||
      option.value.toLowerCase().includes(search)
    )
  }, [options, searchValue])

  // Check if current value exists in options
  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : value

  const handleSelect = (selectedValue: string) => {
    // Direct selection with the value
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleSearchChange = (search: string) => {
    setSearchValue(search)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchValue) {
      // Use the custom typed value when Enter is pressed
      onValueChange(searchValue)
      setOpen(false)
      setSearchValue("")
    }
  }

  // When popover closes, if there's a search value and it doesn't match any option, use it
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && searchValue && !options.find(opt => opt.value === searchValue)) {
      onValueChange(searchValue)
      setSearchValue("")
    }
    setOpen(newOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex flex-col" onKeyDown={handleKeyDown}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">
                {searchValue ? (
                  <div className="p-4 text-sm">
                    <p className="text-muted-foreground mb-2">{emptyMessage}</p>
                    <p className="font-medium">
                      Using: <span className="text-primary">&quot;{searchValue}&quot;</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Press Enter or click outside to confirm
                    </p>
                  </div>
                ) : (
                  emptyMessage
                )}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    handleSelect(option.value)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
