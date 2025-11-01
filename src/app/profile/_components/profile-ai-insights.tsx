"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Bot, Lightbulb, TrendingUp, Zap, CheckCircle2, ArrowRight, Brain, MessageSquare, Send, User } from "lucide-react";
import { useGenerateProfileInsights } from "@/app/profile/_api/use-generate-insights";
import { useChatWithAI } from "@/app/profile/_api/use-chat-with-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ProfileAIInsights() {
  const [insights, setInsights] = useState<string>("");
  const [sections, setSections] = useState<{
    score?: string;
    strengths?: string[];
    improvements?: string[];
    quickWins?: string[];
  }>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const { mutate: generate, isPending } = useGenerateProfileInsights();
  const { mutate: chat, isPending: isChatPending } = useChatWithAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerate = () => {
    generate(undefined, {
      onSuccess: (streamedText: string) => {
        setInsights(streamedText);
        parseInsights(streamedText);
      },
      onError: (error: Error) => {
        console.error("Failed to generate insights:", error);
      },
    });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isChatPending) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsStreaming(true);

    // Add a placeholder for AI response
    const aiPlaceholder: Message = {
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, aiPlaceholder]);

    chat(
      { messages: [...messages, userMessage] },
      {
        onSuccess: (response: string) => {
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: response,
            };
            return newMessages;
          });
          setIsStreaming(false);
        },
        onError: (error: Error) => {
          console.error("Failed to get AI response:", error);
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            };
            return newMessages;
          });
          setIsStreaming(false);
        },
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parseInsights = (text: string) => {
    const parsed: any = {};
    
    // Extract score
    const scoreMatch = text.match(/(?:score|rating):\s*(\d+)(?:\/100)?/i);
    if (scoreMatch) parsed.score = scoreMatch[1];

    // Extract strengths
    const strengthsSection = text.match(/(?:strengths?|what's working well?):\s*([\s\S]*?)(?=\n\n|improvements?|recommendations?|$)/i);
    if (strengthsSection) {
      parsed.strengths = strengthsSection[1]
        .split(/\n/)
        .map(s => s.replace(/^[-•*]\s*/, '').trim())
        .filter(s => s.length > 10);
    }

    // Extract improvements
    const improvementsSection = text.match(/(?:improvements?|recommendations?|areas to improve):\s*([\s\S]*?)(?=\n\n|quick wins?|action items?|$)/i);
    if (improvementsSection) {
      parsed.improvements = improvementsSection[1]
        .split(/\n/)
        .map(s => s.replace(/^[-•*]\s*/, '').trim())
        .filter(s => s.length > 10);
    }

    // Extract quick wins
    const quickWinsSection = text.match(/(?:quick wins?|action items?|immediate steps?):\s*([\s\S]*?)$/i);
    if (quickWinsSection) {
      parsed.quickWins = quickWinsSection[1]
        .split(/\n/)
        .map(s => s.replace(/^[-•*]\s*/, '').trim())
        .filter(s => s.length > 10);
    }

    setSections(parsed);
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">AI Profile Assistant</CardTitle>
              <CardDescription className="text-xs">Get insights and personalized advice</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Bot className="w-3 h-3" />
            Gemini AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="insights" className="text-xs gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat with AI
            </TabsTrigger>
          </TabsList>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-0">
            {!insights ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-base font-semibold mb-2">Get AI-Powered Analysis</h3>
                <p className="text-xs text-muted-foreground mb-5 max-w-sm mx-auto">
                  Our AI will analyze your profile and provide personalized recommendations to help you stand out.
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={isPending}
                  size="sm"
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Insights
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Profile Score */}
                {sections.score && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">AI Profile Score</p>
                        <p className="text-2xl font-bold text-foreground">{sections.score}/100</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Complete
                    </Badge>
                  </div>
                )}

                {/* Strengths */}
                {sections.strengths && sections.strengths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 className="text-sm font-semibold">What's Working Well</h3>
                    </div>
                    <div className="space-y-2">
                      {sections.strengths.map((strength, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs"
                        >
                          <div className="flex gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{strength}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {sections.improvements && sections.improvements.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                      </div>
                      <h3 className="text-sm font-semibold">Recommended Improvements</h3>
                    </div>
                    <div className="space-y-2">
                      {sections.improvements.map((improvement, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs"
                        >
                          <div className="flex gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{improvement}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Wins */}
                {sections.quickWins && sections.quickWins.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Quick Wins</h3>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          Action Items
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {sections.quickWins.map((win, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs"
                        >
                          <div className="flex gap-2">
                            <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{win}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Insights (if parsing didn't extract sections) */}
                {!sections.strengths && !sections.improvements && !sections.quickWins && (
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                      {insights}
                    </p>
                  </div>
                )}

                {/* Re-analyze Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isPending}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs"
                  >
                    {isPending ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Re-analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Re-analyze Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <div className="flex flex-col h-[500px]">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 pr-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <MessageSquare className="w-7 h-7 text-blue-500" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">Chat with AI Assistant</h3>
                    <p className="text-xs text-muted-foreground mb-6 max-w-sm mx-auto">
                      Ask me anything about improving your profile, career advice, or recommendations!
                    </p>
                    <div className="space-y-2 max-w-xs mx-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setInputMessage("How can I improve my profile to attract more opportunities?");
                        }}
                      >
                        <Lightbulb className="w-3.5 h-3.5 mr-2" />
                        How can I improve my profile?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setInputMessage("What skills should I add based on my interests?");
                        }}
                      >
                        <Brain className="w-3.5 h-3.5 mr-2" />
                        What skills should I add?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setInputMessage("Give me tips for writing a better bio.");
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        Tips for my bio
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-blue-500" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-lg p-3 text-xs ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 border border-border/50 text-foreground"
                          }`}
                        >
                          {message.content ? (
                            <p className="whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                              <span className="text-muted-foreground">Thinking...</span>
                            </div>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t border-border/50 pt-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything about your profile..."
                    className="flex-1 h-10 text-sm"
                    disabled={isChatPending || isStreaming}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isChatPending || isStreaming}
                    size="sm"
                    className="px-3"
                  >
                    {isChatPending || isStreaming ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Press Enter to send • AI responses are based on your profile data
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-[10px] text-muted-foreground text-center pt-3 border-t border-border/50 mt-4">
          AI-powered by Gemini • Insights update as you improve your profile
        </p>
      </CardContent>
    </Card>
  );
}
