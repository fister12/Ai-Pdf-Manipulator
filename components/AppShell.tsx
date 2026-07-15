"use client";

import { useRef } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/AppSidebar";
import { Topbar } from "@/components/Topbar/Topbar";
import { useFileContext } from "@/lib/context/FileContext";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFiles } = useFileContext();
    const pathname = usePathname();

    const handleSettings = () => {
        console.log("Opening settings...");
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    const handleProfile = () => {
        console.log("Opening profile...");
    };

    return (
        <SidebarProvider defaultOpen={false}>
            {/* Hidden file input for global programmatic uploads */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />

            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <Topbar
                    userName="John Doe"
                    userEmail="john@example.com"
                    onSettings={handleSettings}
                    onLogout={handleLogout}
                    onProfile={handleProfile}
                />

                {/* Page Content */}
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
