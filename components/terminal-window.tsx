import React from "react"
interface TerminalWindowProps {
  title?: string
  children: React.ReactNode
}

export function TerminalWindow({ title = "bash", children }: TerminalWindowProps) {
  return (
    <div className="border border-border">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="h-2.5 w-2.5 bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 bg-[#27c93f]" />
        <span className="ml-3 text-xs text-muted-foreground">{title}</span>
      </div>
      <div className="p-4 text-sm">{children}</div>
    </div>
  )
}
