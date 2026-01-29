import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizQuestions } from "@/lib/quiz-data";
import type { QuizAnswer, DoshaType } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Leaf, Loader2 } from "lucide-react";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<DoshaType | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (answers: QuizAnswer[]) => {
      const response = await apiRequest("POST", "/api/quiz/submit", { answers });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("doshaResult", JSON.stringify(data));
      setLocation("/results");
    },
  });

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleOptionSelect = (dosha: DoshaType) => {
    setSelectedOption(dosha);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswer: QuizAnswer = {
      questionId: question.id,
      selectedDosha: selectedOption,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      submitMutation.mutate(updatedAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[currentQuestion - 1];
      setSelectedOption(prevAnswer?.selectedDosha || null);
      setAnswers(answers.slice(0, -1));
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
        return "border-blue-500 bg-blue-100 dark:border-blue-500 dark:bg-blue-900/50 ring-2 ring-blue-500/30";
      case "pitta":
        return "border-red-500 bg-red-100 dark:border-red-500 dark:bg-red-900/50 ring-2 ring-red-500/30";
      case "kapha":
        return "border-green-500 bg-green-100 dark:border-green-500 dark:bg-green-900/50 ring-2 ring-green-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4 pb-24 md:pb-8">
      <div className="container max-w-3xl mx-auto smooth-appear">
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
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors duration-200 hover-elevate ${
                    selectedOption === option.dosha
                      ? getDoshaSelectedColor(option.dosha)
                      : getDoshaColor(option.dosha)
                  }`}
                  data-testid={`button-option-${index}`}
                >
                  <span className="text-foreground">{option.text}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="gap-2"
            data-testid="button-previous"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption || submitMutation.isPending}
            className="gap-2"
            data-testid="button-next"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : isLastQuestion ? (
              <>
                See Results
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
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
