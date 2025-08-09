import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Download, TrendingUp, Clock, DollarSign } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MeetingBookingModal } from "@/components/MeetingBookingModal";
import { Button } from "@/components/ui/button";

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    industry: "",
    employees: "",
    currentEfficiency: "",
    investment: "",
    timeframe: ""
  });
  
  const [showResults, setShowResults] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: ""
  });

  const industries = [
    { value: "financial", label: "Financial Services", avgROI: 340 },
    { value: "healthcare", label: "Healthcare", avgROI: 285 },
    { value: "manufacturing", label: "Manufacturing", avgROI: 420 },
    { value: "retail", label: "Retail & E-commerce", avgROI: 290 },
    { value: "technology", label: "Technology", avgROI: 380 },
    { value: "other", label: "Other", avgROI: 300 }
  ];

  const calculateROI = () => {
    const employees = parseInt(formData.employees) || 0;
    const efficiency = parseInt(formData.currentEfficiency) || 0;
    const investment = parseInt(formData.investment) || 0;
    const selectedIndustry = industries.find(i => i.value === formData.industry);
    
    const avgSalary = 65000;
    const inefficiencyFactor = (100 - efficiency) / 100;
    const annualWaste = employees * avgSalary * inefficiencyFactor * 0.3;
    
    const aiEfficiencyGain = 0.4; // 40% efficiency improvement
    const annualSavings = annualWaste * aiEfficiencyGain;
    
    const roi = ((annualSavings - investment) / investment) * 100;
    const paybackMonths = investment / (annualSavings / 12);
    
    return {
      annualSavings: Math.round(annualSavings),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      industryROI: selectedIndustry?.avgROI || 300,
      productivityGain: Math.round(aiEfficiencyGain * 100)
    };
  };

  const handleCalculate = () => {
    if (leadForm.name && leadForm.email && leadForm.company) {
      setShowResults(true);
    }
  };

  const results = showResults ? calculateROI() : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">ROI Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the potential return on investment for implementing AI solutions in your business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, industry: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.employees}
                  onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="efficiency">Current Process Efficiency (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  placeholder="e.g., 70"
                  min="1"
                  max="100"
                  value={formData.currentEfficiency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentEfficiency: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="investment">Expected AI Investment ($)</Label>
                <Input
                  id="investment"
                  type="number"
                  placeholder="e.g., 150000"
                  value={formData.investment}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="timeframe">Implementation Timeframe</Label>
                <Select value={formData.timeframe} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, timeframe: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="12-months">12 Months</SelectItem>
                    <SelectItem value="18-months">18+ Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!showResults && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold">Get Your Detailed ROI Report</h3>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Your company"
                        value={leadForm.company}
                        onChange={(e) => setLeadForm(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button 
                onClick={handleCalculate} 
                className="w-full"
                disabled={!formData.industry || !formData.employees || !formData.currentEfficiency || !formData.investment || (!showResults && (!leadForm.name || !leadForm.email || !leadForm.company))}
              >
                {showResults ? "Recalculate ROI" : "Calculate My ROI"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Your ROI Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showResults && results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.roi}%
                      </div>
                      <div className="text-sm text-muted-foreground">Annual ROI</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${results.annualSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Savings</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                        <Clock className="h-5 w-5 mr-1" />
                        {results.paybackMonths}
                      </div>
                      <div className="text-sm text-muted-foreground">Months to Payback</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {results.productivityGain}%
                      </div>
                      <div className="text-sm text-muted-foreground">Productivity Gain</div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Industry Benchmark</h4>
                    <p className="text-sm text-muted-foreground">
                      Companies in your industry typically see an average ROI of{" "}
                      <Badge variant="outline">{results.industryROI}%</Badge> from AI implementations.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Detailed Report
                    </Button>
                    <MeetingBookingModal 
                      triggerText="Schedule ROI Consultation"
                      className="w-full"
                      serviceType="ROI Consultation"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Fill out the form to see your personalized ROI projection</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI experts will help you realize these projected savings and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MeetingBookingModal 
                  triggerText="Get Free Consultation"
                  triggerSize="lg"
                  serviceType="ROI Consultation"
                />
                <Button size="lg" variant="outline" onClick={() => window.location.href = '/case-studies'}>
                  View Success Stories
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ROICalculator;
