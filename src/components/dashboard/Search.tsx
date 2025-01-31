import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchInputProps {
    onSearch: (query: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout
        return (...args: any[]) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => func(...args), delay)
        }
    }

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            onSearch(query)
        }, 300),
        [onSearch],
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        debouncedSearch(query)
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search tools..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    )
}