import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Pill, Stethoscope, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserSelection() {
  const { toast } = useToast();

  const handleComingSoon = (role: string) => {
    toast({
      title: "Coming Soon",
      description: `${role} dashboard is currently under development.`,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-slate-50/50">
      <div className="max-w-5xl w-full text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
          Welcome to AIyuv
        </h1>
        <p className="text-lg text-slate-600">
          Please select your role to continue to the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Patients Card */}
        <Link href="/patient">
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 bg-white"
            data-testid="card-role-patient"
          >
            <CardHeader className="pt-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Patients</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <CardDescription className="text-base text-slate-600 mb-6">
                Access your health checks, track symptoms, and get personalized wellness guidance.
              </CardDescription>
              <div className="flex items-center justify-center text-primary font-medium group-hover:gap-2 transition-all">
                Enter Portal <ChevronRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Pharmaceutical Admin Card */}
        <div onClick={() => handleComingSoon("Pharmaceutical Admin")}>
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 bg-white"
            data-testid="card-role-pharma"
          >
            <CardHeader className="pt-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Pill className="w-10 h-10 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Pharmaceutical Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <CardDescription className="text-base text-slate-600 mb-6">
                Manage inventory, track medicine distribution, and monitor supply chain analytics.
              </CardDescription>
              <div className="flex items-center justify-center text-slate-400 font-medium">
                Coming Soon
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clinical Admin Card */}
        <div onClick={() => handleComingSoon("Clinical Admin")}>
          <Card 
            className="group cursor-pointer border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 bg-white"
            data-testid="card-role-clinical"
          >
            <CardHeader className="pt-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-10 h-10 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Clinical Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <CardDescription className="text-base text-slate-600 mb-6">
                Review patient cases, manage consultations, and oversee diagnostic quality.
              </CardDescription>
              <div className="flex items-center justify-center text-slate-400 font-medium">
                Coming Soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16 text-slate-400 text-sm">
        Secure medical-grade platform • HIPAA compliant environment
      </div>
    </div>
  );
}
