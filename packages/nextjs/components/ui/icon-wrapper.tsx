/* eslint-disable prettier/prettier */
/**
 * Icon wrapper to fix TypeScript compatibility issues with Lucide React
 */

import { 
  Plus, 
  CheckCircle, 
  Clock, 
  Github, 
  Linkedin, 
  Twitter, 
  Shield, 
  Smartphone, 
  AlertCircle 
} from "lucide-react";

// Create wrapper components that properly handle the icon types
import type { LucideProps } from "lucide-react";
import React from "react";

export const IconPlus: React.FC<LucideProps> = (props) => <Plus {...props} />;
export const IconCheckCircle: React.FC<LucideProps> = (props) => <CheckCircle {...props} />;
export const IconClock: React.FC<LucideProps> = (props) => <Clock {...props} />;
export const IconGithub: React.FC<LucideProps> = (props) => <Github {...props} />;
export const IconLinkedin: React.FC<LucideProps> = (props) => <Linkedin {...props} />;
export const IconTwitter: React.FC<LucideProps> = (props) => <Twitter {...props} />;
export const IconShield: React.FC<LucideProps> = (props) => <Shield {...props} />;
export const IconSmartphone: React.FC<LucideProps> = (props) => <Smartphone {...props} />;
export const IconAlertCircle: React.FC<LucideProps> = (props) => <AlertCircle {...props} />;

// Generic icon wrapper with proper error handling
export const IconWrapper = ({ icon: Icon, ...props }: { icon: React.ComponentType<any> | undefined; [key: string]: any }) => {
  // Handle the case where Icon is undefined or not a valid component
  if (!Icon || typeof Icon !== 'function') {
    console.warn('IconWrapper: Invalid or undefined icon component provided');
    return null; // or return a fallback icon
  }
  
  return <Icon {...props} />;
};

// Alternative version with fallback icon
export const IconWrapperWithFallback = ({ icon: Icon, fallback: Fallback = AlertCircle, ...props }: { 
  icon: React.ComponentType<any> | undefined; 
  fallback?: React.ComponentType<any>;
  [key: string]: any 
}) => {
  const ComponentToRender = Icon || Fallback;
  return <ComponentToRender {...props} />;
};