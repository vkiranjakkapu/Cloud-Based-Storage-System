type DuoFolderIconProps = {
    /**
     * size-40 was applied by default.
     * Override using '!'
     */
    className?: string;
    focusColor?: string;
    shadowColor?: string;
};

export default function DuoFolderIcon({
    className,
    focusColor,
    shadowColor,
}: DuoFolderIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 273 228"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className={`drop-shadow-sm ${className}`}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M273 97C267.68 95.3783 266.096 92.669 260.205 92.669H16.3576C10.6414 92.6647 5.4697 95.3368 0 97V46.3979C0 34.1092 4.3606 22.2605 13.037 13.5711C21.7134 4.88166 33.4811 0 45.7513 0H105.572C110.13 0.00198838 114.643 0.903247 118.853 2.65229C123.062 4.40133 126.887 6.96389 130.108 10.1936L162.817 42.9366C164.984 45.1096 167.924 46.3318 170.991 46.3345H230.812C243.082 46.3345 255.642 50.6087 263.006 61.1522C270.738 72.2228 271.948 79.0761 273 92.669V97Z"
                className={shadowColor ?? `text-white/90 dark:text-secondary-accent`}
            />
            <path
                d="M0 95C0 78.4315 13.4315 65 30 65H243C259.569 65 273 78.4315 273 95V208C273 219.046 264.046 228 253 228H20C8.9543 228 0 219.046 0 208V95Z"
                className={focusColor ?? `text-current`}
            />
        </svg>
    );
}
