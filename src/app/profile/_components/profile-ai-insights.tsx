"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Bot, Lightbulb, TrendingUp, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { useGenerateProfileInsights } from "@/app/profile/_api/use-generate-insights";

export function ProfileAIInsights() {
  const [insights, setInsights] = useState<string>("");
  const [sections, setSections] = useState<{
    score?: string;
    strengths?: string[];
    improvements?: string[];
    quickWins?: string[];
  }>({});
  
  const { mutate: generate, isPending } = useGenerateProfileInsights();

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
    <Card className="bg-neutral-950/50 border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg font-semibold">AI Profile Insights</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-blue-950/40 text-blue-400 border-blue-800">
          <Bot className="h-3 w-3 mr-1" />
          Powered by Gemini
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {!insights ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Get AI-Powered Profile Analysis</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
              Our AI will analyze your profile and provide personalized recommendations to help you stand out to employers.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Score */}
            {sections.score && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">AI Profile Score</p>
                    <p className="text-2xl font-bold text-white">{sections.score}/100</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-600">
                  Analysis Complete
                </Badge>
              </div>
            )}

            {/* Strengths */}
            {sections.strengths && sections.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-white">What's Working Well</h3>
                </div>
                <div className="space-y-2">
                  {sections.strengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-green-950/20 border border-green-800/30 text-sm text-neutral-200"
                    >
                      <div className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
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
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-white">Recommended Improvements</h3>
                </div>
                <div className="space-y-2">
                  {sections.improvements.map((improvement, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-yellow-950/20 border border-yellow-800/30 text-sm text-neutral-200"
                    >
                      <div className="flex gap-2">
                        <ArrowRight className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
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
                  <Zap className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-white">Quick Wins</h3>
                  <Badge variant="secondary" className="text-xs bg-blue-950/50 text-blue-400">
                    Action Items
                  </Badge>
                </div>
                <div className="space-y-2">
                  {sections.quickWins.map((win, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/30 text-sm text-neutral-200"
                    >
                      <div className="flex gap-2">
                        <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{win}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Insights (if parsing didn't extract sections) */}
            {!sections.strengths && !sections.improvements && !sections.quickWins && (
              <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
                <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
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
                className="border-blue-800 text-blue-400 hover:bg-blue-950/50"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Re-analyze Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-800">
          AI-generated insights • Analysis updates as you improve your profile
        </p>
      </CardContent>
    </Card>
  );
}
