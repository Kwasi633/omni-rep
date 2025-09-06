/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";

interface GitHubConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (username: string) => Promise<void>;
  isConnecting: boolean;
}

export function GitHubConnectModal({ 
  isOpen, 
  onClose, 
  onConnect, 
  isConnecting 
}: GitHubConnectModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleConnect = async () => {
    if (!username.trim()) {
      setError("Please enter a valid GitHub username");
      return;
    }

    setError("");
    try {
      await onConnect(username.trim());
      setUsername("");
      onClose();
    } catch {
      setError("Failed to connect GitHub account. Please check the username and try again.");
    }
  };

  const handleClose = () => {
    setUsername("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Github className="h-5 w-5" />
            Connect GitHub Account
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter your GitHub username to connect your account and boost your reputation score.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right text-white">
              Username
            </Label>
            <Input
              id="username"
              placeholder="e.g., 'octocat'"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConnect();
                }
              }}
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm px-1">
              {error}
            </div>
          )}
          
          <div className="text-xs text-gray-500 px-1">
            We&apos;ll fetch your public GitHub data to calculate your developer reputation score.
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConnect}
            disabled={isConnecting || !username.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
