import { getFlagUrl } from '@/utils/countryCodeMap';

interface FlagIconProps {
    countryName: string;
    className?: string;
    alt?: string;
}

/**
 * Reusable component to display country flags as SVG images
 * @param countryName - The name of the country
 * @param className - Optional CSS classes to apply to the flag
 * @param alt - Optional alt text (defaults to "{countryName} flag")
 */
export default function FlagIcon({ countryName, className = '', alt }: FlagIconProps) {
    const flagUrl = getFlagUrl(countryName);
    const altText = alt || `${countryName} flag`;

    return (
        <img
            src={flagUrl}
            alt={altText}
            className={`inline-block ${className}`}
            onError={(e) => {
                // Fallback to a gray placeholder if flag not found
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"%3E%3Crect width="3" height="2" fill="%23ccc"/%3E%3C/svg%3E';
            }}
        />
    );
}
