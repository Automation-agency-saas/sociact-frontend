
import { Platform } from '@/lib/types';
import { platformConfig } from '@/lib/config/tools';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface HeaderProps {
    activePlatform: Platform;
    setActivePlatform: (platform: Platform) => void;
}

export function PlatformSelector({ activePlatform, setActivePlatform }: HeaderProps) {
    return (
        <div className="hidden md:block">
            <Select value={activePlatform} onValueChange={(value: Platform) => setActivePlatform(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(platformConfig).map(([key, config]) => (
                        <SelectItem
                            key={key}
                            value={key as Platform}
                            className="data-[state=active]:bg-primary/10 hover:text-white"
                        >
                            <div className='flex gap-4 items-center'>
                                <config.icon className={`h-4 w-4 ${config.color}`} />
                                <span>{config.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
} 