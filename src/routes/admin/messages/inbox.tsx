import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MoreHorizontal, Loader2, Calendar, Building, DollarSign, Reply, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Route = createFileRoute('/admin/messages/inbox')({
  component: InboxPage,
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
  status: 'unread' | 'read' | 'archived';
  replies: ReplyData[];
  createdAt: string;
}

function InboxPage() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:5000/api/messages/inbox', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
      else throw new Error(data.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: 'read' } : m));
      }
    } catch (err) {}
  };

  const handleSendReply = async (id: string) => {
    if (!replyContent.trim() || !user?.token) return;

    setIsReplying(true);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ content: replyContent })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Reply sent successfully');
        setMessages(messages.map(m => m._id === id ? data.data : m));
        setReplyingTo(null);
        setReplyContent('');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.token) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== id));
        toast.success('Message deleted permanently');
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <Card className="glass border-dashed border-glass-border">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Mail className="h-12 w-12 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-xl font-semibold">No messages yet</h3>
            <p className="text-muted-foreground mt-1">When someone contacts you, their message will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        messages.map((msg) => (
          <Card 
            key={msg._id} 
            className={msg.status === 'unread' ? 'glass border-primary/30 shadow-lg shadow-primary/5' : 'glass border-glass-border'}
            onClick={() => msg.status === 'unread' && markAsRead(msg._id)}
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg font-bold">{msg.name}</CardTitle>
                  {msg.status === 'unread' && <Badge className="bg-primary text-primary-foreground">New</Badge>}
                  {msg.replies?.length > 0 && <Badge variant="outline" className="text-accent border-accent/30">Replied</Badge>}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {msg.email}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(msg.createdAt), 'MMM d, h:mm a')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplyingTo(replyingTo === msg._id ? null : msg._id);
                  }}
                >
                  <Reply className="h-4 w-4" /> Reply
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-red-400 hover:text-red-400 hover:bg-red-400/10"
                      onClick={(e) => e.stopPropagation()}
                      disabled={deletingId === msg._id}
                    >
                      {deletingId === msg._id 
                        ? <Loader2 className="h-4 w-4 animate-spin" /> 
                        : <Trash2 className="h-4 w-4" />}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass border-glass-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the message from <strong>{msg.name}</strong>. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm bg-white/5 p-3 rounded-xl border border-glass-border">
                {msg.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{msg.company}</span>
                  </div>
                )}
                {msg.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium text-accent">{msg.budget}</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 bg-white/5 p-4 rounded-xl border border-glass-border/50">
                {msg.details}
              </div>

              {/* Previous Replies */}
              {msg.replies?.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Previous Replies</h5>
                  {msg.replies.map((reply, i) => (
                    <div key={i} className="bg-primary/5 border border-primary/10 p-3 rounded-xl ml-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-primary">Replied by {reply.sentBy}</span>
                        <span className="text-[10px] text-muted-foreground">{format(new Date(reply.sentAt), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <AnimatePresence>
                {replyingTo === msg._id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3 p-4 glass rounded-2xl border-primary/20">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                        <Send className="h-4 w-4" /> 
                        Sending reply to {msg.email}
                      </div>
                      <Textarea 
                        placeholder="Type your reply here..."
                        className="min-h-[120px] bg-white/5 border-glass-border focus:border-primary/50"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={isReplying || !replyContent.trim()}
                          onClick={() => handleSendReply(msg._id)}
                        >
                          {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          Send Email
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
