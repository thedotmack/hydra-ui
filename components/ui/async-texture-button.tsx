import * as React from "react"
import { TextureButton, UnifiedButtonProps } from "./texture-button"
import { LoadingSpinner } from "@/common/LoadingSpinner"
import { cn } from "@/lib/utils"

export interface AsyncTextureButtonProps extends UnifiedButtonProps {
  onAction: () => Promise<void> | void
  loadingText?: string
}

export const AsyncTextureButton = React.forwardRef<HTMLButtonElement, AsyncTextureButtonProps>(
  ({ onAction, children, className, loadingText, disabled, ...rest }, ref) => {
    const [loading, setLoading] = React.useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      try {
        setLoading(true)
        await onAction()
      } finally {
        setLoading(false)
      }
    }

    return (
      <TextureButton
        ref={ref}
        disabled={disabled || loading}
        className={cn(className, loading && "cursor-wait")}
        onClick={handleClick}
        {...rest}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner height="18px" />
            {loadingText && <span className="text-xs font-medium opacity-70">{loadingText}</span>}
          </span>
        ) : (
          children
        )}
      </TextureButton>
    )
  }
)

AsyncTextureButton.displayName = "AsyncTextureButton"
