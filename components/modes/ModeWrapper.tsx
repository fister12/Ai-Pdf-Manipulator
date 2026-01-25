"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ModeWrapperProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onBack: () => void;
    children: React.ReactNode;
    headerColor?: string;
}

export function ModeWrapper({
    title,
    description,
    icon,
    onBack,
    children,
    headerColor = "from-primary to-primary/70",
}: ModeWrapperProps) {
    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-4xl px-4 py-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="sr-only">Back to Chat</span>
                        </Button>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${headerColor} text-white shadow-lg`}>
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="mx-auto max-w-4xl px-4 py-6">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

// Reusable Card component for modes
interface ModeCardProps {
    children: React.ReactNode;
    className?: string;
}

export function ModeCard({ children, className = "" }: ModeCardProps) {
    return (
        <div className={`rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm ${className}`}>
            {children}
        </div>
    );
}

// Reusable Section Title component
interface ModeSectionTitleProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
}

export function ModeSectionTitle({ icon, title, description }: ModeSectionTitleProps) {
    return (
        <div className="mb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
                {icon}
                {title}
            </h3>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

// Primary action button with consistent styling
interface ModeButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
    type?: "button" | "submit";
}

export function ModeButton({
    children,
    onClick,
    disabled = false,
    variant = "primary",
    className = "",
    type = "button",
}: ModeButtonProps) {
    const baseStyles = "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

// File drop zone with consistent styling
interface ModeDropZoneProps {
    onDrop: (files: FileList) => void;
    accept?: string;
    isDragging: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    children: React.ReactNode;
}

export function ModeDropZone({
    onDrop,
    isDragging,
    onDragOver,
    onDragLeave,
    children,
}: ModeDropZoneProps) {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onDrop(files);
        }
    };

    return (
        <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${isDragging
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                }`}
        >
            {children}
        </div>
    );
}

// Input field with consistent styling
interface ModeInputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: "text" | "textarea";
    rows?: number;
    className?: string;
}

export function ModeInput({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    rows = 4,
    className = "",
}: ModeInputProps) {
    const inputStyles = "w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";

    return (
        <div className={className}>
            {label && (
                <label className="mb-2 block text-sm font-medium">{label}</label>
            )}
            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className={inputStyles}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputStyles}
                />
            )}
        </div>
    );
}

// Loading spinner
export function ModeLoading({ text = "Processing..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">{text}</p>
        </div>
    );
}

// Error message
export function ModeError({ message, onRetry, className = "" }: { message: string; onRetry?: () => void; className?: string }) {
    return (
        <div className={`rounded-xl border border-destructive/50 bg-destructive/10 p-4 ${className}`}>
            <p className="text-sm text-destructive">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-2 text-sm font-medium text-destructive hover:underline"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

// Success message
export function ModeSuccess({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-4">
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        </div>
    );
}

// Tab navigation
interface ModeTabsProps {
    tabs: { id: string; label: string; icon?: React.ReactNode }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function ModeTabs({ tabs, activeTab, onTabChange }: ModeTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto rounded-xl border border-border/50 bg-muted/30 p-1.5">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
