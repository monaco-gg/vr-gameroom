//TODO: MRC customize

import { AppConfig } from '../../utils/loaderConfig';
import { ReactNode } from 'react';

interface GradientEventProps {
  children: ReactNode;
  className?: string;
}

export const GradientEvent = ({ children, className = '' }: GradientEventProps) => {
  const eventStyle = AppConfig?.styles?.components?.event ?? {};

  const gradient = `radial-gradient(circle,
                      ${eventStyle.gradientColor?.from || '#0a011849'},
                      ${eventStyle.gradientColor?.via || '#6e4aff77'},
                      ${eventStyle.gradientColor?.to || '#0a011864'} 
                    )`;

  const borderColor = eventStyle.borderColor || '#6d4aff';
  
  return (
    <div
     className={`py-8 px-4 animate-gradient rounded-3xl border-4 border-event-border ${className}`}
      style={{
        background: gradient       
      }}
    >
      {children}
    </div>
  );
};