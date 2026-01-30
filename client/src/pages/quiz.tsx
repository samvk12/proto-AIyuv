import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { quizQuestions } from "@/lib/quiz-data";
import type { QuizAnswer, DoshaType } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Leaf, Loader2, RotateCcw } from "lucide-react";

const STORAGE_KEY = "quizProgress";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<DoshaType | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const autoAdvanceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.answers && parsed.answers.length > 0) {
          setShowRestorePrompt(true);
        }
      } catch (e) {}
    }
  }, []);

  // Save progress on answer change
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentQuestion,
        answers,
      }));
    }
  }, [answers, currentQuestion]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }
    };
  }, []);

  const submitMutation = useMutation({
    mutationFn: async (answers: QuizAnswer[]) => {
      const response = await apiRequest("POST", "/api/quiz/submit", { answers });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("doshaResult", JSON.stringify(data));
      setLocation("/results");
    },
  });

  const restoreProgress = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || []);
        setCurrentQuestion(parsed.currentQuestion || 0);
        // Restore selected option for current question
        const currentAnswer = parsed.answers?.[parsed.currentQuestion];
        if (currentAnswer) {
          setSelectedOption(currentAnswer.selectedDosha);
        }
      } catch (e) {}
    }
    setShowRestorePrompt(false);
  };

  const startFresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers([]);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowRestorePrompt(false);
  };

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleOptionSelect = (dosha: DoshaType) => {
    if (isAutoAdvancing) return; // Prevent rapid clicks
    
    setSelectedOption(dosha);
    setIsAutoAdvancing(true);

    // Auto-advance after 400ms for smooth UX
    autoAdvanceTimer.current = setTimeout(() => {
      const newAnswer: QuizAnswer = {
        questionId: question.id,
        selectedDosha: dosha,
      };

      const updatedAnswers = [...answers.slice(0, currentQuestion), newAnswer];
      setAnswers(updatedAnswers);

      if (isLastQuestion) {
        submitMutation.mutate(updatedAnswers);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      }
      setIsAutoAdvancing(false);
    }, 400);
  };

  const handlePrevious = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      setIsAutoAdvancing(false);
    }
    
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[currentQuestion - 1];
      setSelectedOption(prevAnswer?.selectedDosha || null);
    } else {
      setLocation("/");
    }
  };

  const getDoshaColor = (dosha: DoshaType) => {
    switch (dosha) {
      case "vata":
        return "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/30";
      case "pitta":
        return "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30";
      case "kapha":
        return "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30";
    }
  };

  const getDoshaSelectedColor = (dosha: DoshaType) => {
    switch (dosha) {
      case "vata":
        return "border-blue-500 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/50 ring-2 ring-blue-500/30 scale-[1.02]";
      case "pitta":
        return "border-red-500 bg-red-100 dark:border-red-500 dark:bg-red-900/50 ring-2 ring-red-500/30 scale-[1.02]";
      case "kapha":
        return "border-green-500 bg-green-100 dark:border-green-500 dark:bg-green-900/50 ring-2 ring-green-500/30 scale-[1.02]";
    }
  };

  // Restore prompt
  if (showRestorePrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="text-center space-y-2">
              <RotateCcw className="w-8 h-8 text-primary mx-auto" />
              <h2 className="text-xl font-serif font-semibold">Continue your quiz?</h2>
              <p className="text-muted-foreground text-sm">
                You have a quiz in progress. Would you like to continue or start over?
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={startFresh} className="flex-1" data-testid="button-start-fresh">
                Start Over
              </Button>
              <Button onClick={restoreProgress} className="flex-1" data-testid="button-restore">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading/submitting state
  if (submitMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-semibold">Analyzing Your Dosha</h2>
            <p className="text-muted-foreground text-sm">Discovering your unique constitution...</p>
          </div>
          <div className="space-y-2 max-w-xs mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4 pb-24 md:pb-8">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-serif font-bold text-2xl">Dosha Quiz</span>
          </div>
          <p className="text-muted-foreground">
            Discover your unique mind-body constitution
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardContent className="pt-8 pb-6 px-6">
            <div className="mb-2">
              <span className="text-sm font-medium text-primary">{question.category}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-8" data-testid="text-question">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option.dosha)}
                  disabled={isAutoAdvancing}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedOption === option.dosha
                      ? getDoshaSelectedColor(option.dosha)
                      : getDoshaColor(option.dosha)
                  } ${isAutoAdvancing && selectedOption === option.dosha ? "animate-pulse" : ""}`}
                  data-testid={`button-option-${index}`}
                >
                  <span className="text-foreground">{option.text}</span>
                </button>
              ))}
            </div>
            
            {/* Auto-advance indicator */}
            <p className="text-xs text-center text-muted-foreground mt-4">
              Tap an answer to automatically continue
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="gap-2"
            data-testid="button-previous"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentQuestion === 0 ? "Exit" : "Previous"}
          </Button>

          {/* Show manual next button as fallback */}
          <div className="text-xs text-muted-foreground flex items-center">
            {selectedOption && !isAutoAdvancing && (
              <span>Auto-advancing...</span>
            )}
          </div>
        </div>

        {submitMutation.isError && (
          <p className="text-center text-destructive mt-4" data-testid="text-error">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
