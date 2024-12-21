import './style.css';

import * as Ably from 'ably';
import Alpine from 'alpinejs';

import resolveConfig from "tailwindcss/resolveConfig";
import myTailwindConfig from "../tailwind.config.js";
window.tailwindConfig = resolveConfig(myTailwindConfig);

window.realtimeAbly = new Ably.Realtime({
    authUrl: '/auth'
});

window.Alpine = Alpine;
Alpine.start();