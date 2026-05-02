import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';

export const Route = createFileRoute('/admin/messages/sent')({
  component: SentPage,
});

function SentPage() {
  return (
    <Card className="glass border-dashed border-glass-border">
      <CardContent className="flex flex-col items-center justify-center py-20 text-center">
        <Send className="h-12 w-12 text-muted-foreground opacity-20" />
        <h3 className="mt-4 text-xl font-semibold">No sent messages</h3>
        <p className="text-muted-foreground mt-1">Direct replies to clients will be shown here in a future update.</p>
      </CardContent>
    </Card>
  );
}
