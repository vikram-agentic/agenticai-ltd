import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Mail, Linkedin } from "lucide-react";
import { MeetingBookingModal } from "./MeetingBookingModal";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Resources", path: "/resources" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Contact Bar */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center py-2 space-x-6">
            <div className="hidden sm:flex items-center space-x-4 text-sm text-muted-foreground">
              <a 
                href="mailto:info@agentic-ai.ltd" 
                className="flex items-center space-x-1 hover:text-primary transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span>info@agentic-ai.ltd</span>
              </a>
              <a 
                href="tel:+447771970567" 
                className="flex items-center space-x-1 hover:text-primary transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>+44 7771 970567</span>
              </a>
              <a 
                href="https://linkedin.com/company/agentic-ai-ltd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-primary transition-colors"
              >
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Agentic AI Logo" className="w-8 h-8" />
            <span className="font-heading font-bold text-xl">
              Agentic AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link
                    to="/about"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/about") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    About
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={location.pathname.startsWith('/services') ? "text-primary bg-accent/50" : ""}>
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2 bg-background z-50">
                      <Link
                        to="/services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">All Services</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View all our AI solutions and services
                        </p>
                      </Link>
                      <Link
                        to="/services/custom-ai-development"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Custom AI Development</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Tailored AI solutions for your business
                        </p>
                      </Link>
                      <Link
                        to="/services/ai-agent-automation"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">AI Agent & Automation</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Intelligent automation solutions
                        </p>
                      </Link>
                      <Link
                        to="/services/specialized-ai-solutions"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Specialized AI Solutions</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Advanced AI for complex challenges
                        </p>
                      </Link>
                      <Link
                        to="/services/industry-specific-ai"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Industry-Specific AI</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          AI solutions tailored to your industry
                        </p>
                      </Link>
                      <Link
                        to="/services/ai-consulting-support"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">AI Consulting & Support</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Expert guidance and ongoing support
                        </p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={location.pathname.startsWith('/case-studies') ? "text-primary bg-accent/50" : ""}>
                    Case Studies
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-1 bg-background z-50">
                      <Link
                        to="/case-studies"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">All Case Studies</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View all success stories across industries
                        </p>
                      </Link>
                      <Link
                        to="/case-studies/financial-services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Financial Services</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fraud detection and risk assessment
                        </p>
                      </Link>
                      <Link
                        to="/case-studies/healthcare"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Healthcare</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Medical imaging and diagnostics
                        </p>
                      </Link>
                      <Link
                        to="/case-studies/retail-ecommerce"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Retail & E-commerce</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Personalization and optimization
                        </p>
                      </Link>
                      <Link
                        to="/case-studies/manufacturing"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Manufacturing</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Predictive maintenance and quality control
                        </p>
                      </Link>
                      
                      <Link
                        to="/portfolio"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Portfolio</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View our successful AI projects
                        </p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/roi-calculator"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/roi-calculator") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    ROI Calculator
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/resources"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/resources") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    Resources
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/blog"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/blog") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    Blog
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/contact"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActive("/contact") ? "text-primary bg-accent/50" : "text-foreground"
                    }`}
                  >
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <MeetingBookingModal 
              triggerText="Schedule Consultation"
              className="bg-gradient-primary hover:opacity-90"
              serviceType="General Inquiry"
            />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive(item.path)
                      ? "text-primary bg-accent/50"
                      : "text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <MeetingBookingModal 
                  triggerText="Schedule Consultation"
                  className="w-full bg-gradient-primary hover:opacity-90"
                  serviceType="General Inquiry"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
