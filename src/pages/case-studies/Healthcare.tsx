import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Activity, Stethoscope, Brain, Clock, Users } from "lucide-react";

const Healthcare = () => {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    window.open("https://calendly.com/vikram-agentic-ai/30min", "_blank");
  };

  const handleContactUs = () => {
    navigate("/contact");
  };

  const caseStudies = [
    {
      title: "Radiology AI Diagnostic Assistant",
      client: "Metropolitan Medical Center",
      challenge: "Radiologists overwhelmed with 2,000+ scans daily, leading to diagnostic delays and potential missed critical findings.",
      solution: "Deployed computer vision AI system for automated medical image analysis with priority flagging for urgent cases and diagnostic assistance.",
      results: [
        "60% faster initial diagnostic review",
        "95% accuracy in detecting critical findings",
        "40% reduction in patient wait times",
        "99.2% sensitivity for emergency cases",
        "35% improvement in radiologist productivity"
      ],
      technologies: ["TensorFlow", "DICOM Processing", "PyTorch", "NVIDIA Clara", "FastAPI"],
      timeline: "5 months",
      investment: "$285,000"
    },
    {
      title: "Electronic Health Record Intelligence",
      client: "Regional Health Network",
      challenge: "Physicians spending 3+ hours daily on documentation, reducing patient interaction time and causing provider burnout.",
      solution: "Implemented NLP-powered EHR system with voice recognition, automated clinical note generation, and intelligent data extraction.",
      results: [
        "75% reduction in documentation time",
        "90% accuracy in automated coding",
        "2.5 hours additional patient time per physician",
        "45% improvement in provider satisfaction",
        "$2.3M annual cost savings"
      ],
      technologies: ["OpenAI GPT", "Microsoft LUIS", "HL7 FHIR", "MongoDB", "Docker"],
      timeline: "7 months",
      investment: "$420,000"
    },
    {
      title: "Predictive Patient Monitoring System",
      client: "St. Mary's Hospital ICU",
      challenge: "Critical patient deterioration often detected too late, leading to increased mortality and longer ICU stays.",
      solution: "Built real-time AI monitoring system analyzing vital signs, lab results, and patient history to predict deterioration 4-6 hours in advance.",
      results: [
        "50% reduction in unexpected cardiac arrests",
        "30% decrease in ICU mortality rates",
        "25% shorter average ICU stays",
        "85% early warning accuracy",
        "$1.8M savings in emergency interventions"
      ],
      technologies: ["Apache Kafka", "Scikit-learn", "Redis", "PostgreSQL", "React"],
      timeline: "4 months",
      investment: "$190,000"
    }
  ];

  const industryStats = [
    { icon: Heart, metric: "95%", label: "Diagnostic Accuracy Achieved" },
    { icon: Clock, metric: "60%", label: "Average Time Savings" },
    { icon: Activity, metric: "40%", label: "Workflow Efficiency Improvement" },
    { icon: Stethoscope, metric: "25+", label: "Healthcare Facilities Served" },
    { icon: Brain, metric: "99.2%", label: "Critical Case Detection Rate" },
    { icon: Users, metric: "15,000+", label: "Healthcare Professionals Supported" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Heart className="w-4 h-4 mr-2" />
            Healthcare Case Studies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI-Powered Healthcare Innovation
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how leading healthcare organizations are using AI to improve patient outcomes, enhance diagnostic accuracy, and optimize clinical workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleScheduleConsultation}
              className="bg-gradient-primary hover:opacity-90"
            >
              Schedule Healthcare AI Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleContactUs}
            >
              Request Healthcare Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare AI Impact</h2>
            <p className="text-muted-foreground">
              Measurable improvements in patient care and operational efficiency.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Case Studies */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Healthcare Success Stories</h2>
            <p className="text-muted-foreground">
              Real-world implementations transforming patient care and clinical outcomes.
            </p>
          </div>
          
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                      <p className="text-muted-foreground font-medium">{study.client}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{study.timeline}</Badge>
                        <Badge variant="secondary">{study.investment}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-destructive mb-2">Clinical Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-primary mb-2">AI Solution</h4>
                        <p className="text-muted-foreground">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {study.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-primary p-6 rounded-xl text-white">
                    <h4 className="font-bold text-xl mb-4">Clinical Outcomes</h4>
                    <ul className="space-y-3">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Healthcare with AI?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join leading healthcare organizations leveraging AI to improve patient outcomes and operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={handleScheduleConsultation}
            >
              Schedule Healthcare Assessment
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              onClick={handleContactUs}
            >
              Request Healthcare Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Healthcare;