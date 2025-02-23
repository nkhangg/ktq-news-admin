import { cn } from '../../utils';

export interface IActiveColumnProps {
    active: boolean;
}

export default function ActiveColumn({ active }: IActiveColumnProps) {
    return (
        <div className="flex items-center justify-center">
            <span
                className={cn('w-3 aspect-square rounded-full', {
                    ['bg-red-500']: !active,
                    ['bg-green-500']: active,
                })}
            ></span>
        </div>
    );
}
