import { VoiceNavigationProvider, VoiceControlButton } from "./VoiceNavigation";

export default function VoiceClientWrapper({ children }) {
  return (
    <VoiceNavigationProvider>
      {children}
      <VoiceControlButton />
    </VoiceNavigationProvider>
  );
}
