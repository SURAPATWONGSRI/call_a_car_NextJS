import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
  variant?: "spinner" | "bar" | "dots";
}

export const LoadingSpinner = ({
  className,
  size = "md",
  containerClassName,
  variant = "spinner",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (variant === "bar") {
    return (
      <div
        className={cn("flex justify-center items-center", containerClassName)}
      >
        <div
          className={cn(
            "w-full max-w-[100px] h-1 bg-gray-200 overflow-hidden rounded-full",
            className
          )}
        >
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: "30%",
              animation: "simpleSlide 1.2s ease-in-out infinite",
            }}
          />
        </div>
        <style jsx global>{`
          @keyframes simpleSlide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(400%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn("flex justify-center items-center", containerClassName)}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "bg-primary rounded-full",
                size === "sm"
                  ? "h-1 w-1"
                  : size === "md"
                  ? "h-2 w-2"
                  : "h-3 w-3",
                className
              )}
              style={{ opacity: 0.6 + i * 0.2 }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default simple spinner
  return (
    <div className={cn("flex justify-center items-center", containerClassName)}>
      <div
        className={cn(
          "border-t-2 border-primary border-solid rounded-full animate-spin",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
