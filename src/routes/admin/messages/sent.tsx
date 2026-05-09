import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Mail, Calendar, Building, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const Route = createFileRoute('/admin/messages/sent')({
  component: SentPage,
});

interface ReplyData {
  content: string;
  sentAt: string;
  sentBy: string;
}

interface MessageData {
  _id: string;
  name: string;
  email: string;
  company?: string;
  budget?: string;
  details: string;
  replies: ReplyData[];
  updatedAt: string;
}

function SentPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSent = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch('http://localhost:5000/api/messages/sent', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) setMessages(data);
        else throw new Error(data.message);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load sent messages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSent();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="glass border-dashed border-glass-border">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <Send className="h-12 w-12 text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-xl font-semibold">No sent replies yet</h3>
          <p className="text-muted-foreground mt-1">Replies you send from the Inbox will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <Card key={msg._id} className="glass border-glass-border">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">To: {msg.name}</CardTitle>
                  <Badge variant="outline" className="text-xs text-accent border-accent/30">
                    {msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {msg.email}</span>
                  {msg.company && <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {msg.company}</span>}
                </div>
              </div>
              <button
                onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                className="glass p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground"
              >
                {expandedId === msg._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </CardHeader>

          {expandedId === msg._id && (
            <CardContent className="space-y-4 pt-0">
              {/* Original Message */}
              <div className="bg-white/5 border border-glass-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Original Message</p>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{msg.details}</p>
              </div>

              {/* Replies */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Your Replies</p>
                {msg.replies.map((reply, i) => (
                  <div key={i} className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Send className="h-3 w-3 text-primary" />
                        <span className="text-xs font-semibold text-primary">Sent by {reply.sentBy}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(reply.sentAt), 'MMM d, yyyy · h:mm a')}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
