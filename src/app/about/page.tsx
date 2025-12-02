import { Scale, Users, Target, Heart, Shield, FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/30 dark:to-background py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <Scale className="h-10 w-10" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                About ComplainCraft
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Empowering Bangladeshi consumers to stand up for their rights through AI-powered complaint generation
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  ComplainCraft (দাবী) is dedicated to making consumer rights protection accessible to everyone in Bangladesh. 
                  We believe that every citizen deserves the right to file formal complaints against businesses that violate 
                  consumer protection laws.
                </p>
                <p className="text-lg leading-relaxed">
                  Our platform uses intelligent analysis to help you generate professional, legally sound complaints in both 
                  English and Bengali, ensuring that your voice is heard by the National Consumer Rights Protection Directorate.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">What We Do</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Legal Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We analyze your complaint and identify violations of the Consumer Rights Protection Act, 2009, 
                    ensuring your complaint is backed by proper legal references.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Professional Drafts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate formal complaint letters in proper Bengali format that can be submitted directly to 
                    the National Consumer Rights Protection Directorate.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User-Friendly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No legal expertise required. Our intuitive form guides you through the process step-by-step, 
                    with dynamic fields based on your issue type.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Free & Accessible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ComplainCraft is completely free to use. We believe consumer rights protection should be 
                    accessible to everyone, regardless of their financial situation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Why We Built ComplainCraft</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Many consumers in Bangladesh face difficulties when trying to file formal complaints against businesses. 
                  The process can be intimidating, especially if you don't know the proper format or which laws have been violated.
                </p>
                <p className="leading-relaxed">
                  We created ComplainCraft to bridge this gap. By simplifying the complaint generation process and providing 
                  instant legal analysis, we empower consumers to take action against unfair business practices, fraud, 
                  overpricing, and other violations of their rights.
                </p>
                <p className="leading-relaxed">
                  Our vision is a Bangladesh where every consumer knows their rights and has the tools to protect them.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Protect Your Consumer Rights?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of Bangladeshi consumers who are standing up for their rights with ComplainCraft.
            </p>
            <a href="/">
              <Button size="lg" className="text-lg px-8">
                Create Your Complaint Now
              </Button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
