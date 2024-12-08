interface AvatarProps {
    src?: string;
    alt?: string;
    fallbackText?: string;
  }
  
  interface AvatarFallbackProps {
    children: React.ReactNode;
  }
  
  export function Avatar({ src, fallbackText }: AvatarProps) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        {src ? (
          <image href={src} className="object-cover w-full h-full" />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-sm text-gray-500 dark:text-gray-300">
        {fallbackText}
          </span>
        )}
      </div>
    );
  }
  
  export function AvatarImage({ src, alt }: AvatarProps) {
    return <img src={src} alt={alt} className="object-cover w-full h-full" />;
  }
  
  export function AvatarFallback({ children }: AvatarFallbackProps) {
    return (
      <div className="flex items-center justify-center w-full h-full text-sm text-gray-500 dark:text-gray-300">
        {children}
      </div>
    );
  }
  