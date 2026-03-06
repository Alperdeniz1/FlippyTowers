/**
 * Web entry point - uses View-based PhysicsCanvas (no Skia on web).
 * Skia's useDerivedValue + Path fails in worklet context on web.
 */

import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
