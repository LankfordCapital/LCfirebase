
'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useUI } from '@/contexts/ui-context';

export default function ChatLauncher() {
  const { openAssistant } = useUI();

  return (
    <Button
      onClick={() => openAssistant()}
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50"
      size="icon"
    >
      <MessageSquare className="h-8 w-8" />
      <span className="sr-only">Open Chat</span>
    </Button>
  );
}
