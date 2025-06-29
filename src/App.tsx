import React, { useState } from 'react';
import { MessageSquare, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

interface GeneratedComment {
  type: string;
  content: string;
}

interface CommentsResponse {
  comments: GeneratedComment[];
}

function App() {
  const [post, setPost] = useState('');
  const [comments, setComments] = useState<GeneratedComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateComments = async () => {
    if (!post.trim()) return;

    setIsLoading(true);
    try {
      // Use the hosted Supabase function URL directly
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase configuration missing');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ post }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: CommentsResponse = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('Error generating comments:', error);
      alert('Failed to generate comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Magnetic Comment': 'bg-purple-100 text-purple-800 border-purple-200',
      'Credibility Comment': 'bg-blue-100 text-blue-800 border-blue-200',
      'Resonance Comment': 'bg-green-100 text-green-800 border-green-200',
      'Funny/Smart Punchline': 'bg-orange-100 text-orange-800 border-orange-200',
      'Subtle CTA Comment': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Jugnu AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your Gen-Z, chai-loving personal branding ghostwriter. Generate strategic LinkedIn comments that build authority, spark engagement, and grow your network.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Paste Your LinkedIn Post
            </h2>
          </div>
          
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            placeholder="Paste the LinkedIn post you want to comment on here..."
            className="w-full h-40 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
          />
          
          <button
            onClick={generateComments}
            disabled={!post.trim() || isLoading}
            className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Comments...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Strategic Comments
              </>
            )}
          </button>
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Your Strategic Comments
              </h3>
              <p className="text-gray-600">
                Five unique comments designed to build your personal brand
              </p>
            </div>

            <div className="grid gap-6">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getTypeColor(comment.type)}`}>
                        {comment.type}
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(comment.content, index)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built with ☕ and AI magic • Powered by Jugnu's strategic frameworks
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;