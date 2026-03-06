/**
 * Injects global styles for web to fix viewport and prevent scroll.
 * Only renders on web.
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export function WebLayoutFix() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const style = document.createElement('style');
    style.textContent = `
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
      #root {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
