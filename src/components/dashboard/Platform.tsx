
import { Platform } from '@/lib/types';
import { platformConfig } from '@/lib/config/tools';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface HeaderProps {
    activePlatform: Platform;
    setActivePlatform: (platform: Platform) => void;
}

export function PlatformSelector({ activePlatform, setActivePlatform }: HeaderProps) {
    return (
        <div className="block">
            <Select value={activePlatform} onValueChange={(value: Platform) => setActivePlatform(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(platformConfig).map(([key, config]) => (
                        <SelectItem
                            key={key}
                            value={key as Platform}
                            className="data-[state=active]:bg-primary/10 hover:text-white"
                        >
                            <div className='flex gap-2 md:gap-4 items-center pr-2 w-full text-nowrap'>
                                <config.icon className={`size-4 ${config.color}`} />
                                <span>{config.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 