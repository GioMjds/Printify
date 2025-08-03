'use client';

interface CountBadgeProps {
    count: number;
    variant?: 'default' | 'urgent';
    className?: string;
    tooltip?: string;
}

export default function CountBadge({
    count,
    variant = 'default',
    className = '',
    tooltip
}: CountBadgeProps) {
    if (count === 0) return null;

    const baseClasses = "inline-flex items-center justify-center px-2 py-1 text-md font-bold rounded-full min-w-8 h-8 transition-all duration-200";
    const variantClasses = variant === 'urgent'
        ? "bg-red-500 text-white animate-pulse shadow-lg"
        : "bg-accent text-white shadow-md";

    return (
        <div className="relative group">
            <span className={`${baseClasses} ${variantClasses} ${className}`}>
                {count > 99 ? '99+' : count}
            </span>
            {tooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {tooltip}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                </div>
            )}
        </div>
    );
}