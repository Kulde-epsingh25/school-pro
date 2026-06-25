import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      {/* Page Header & Search */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center & Useful Resources</h1>
        <p className="text-muted-foreground mb-6">Find answers to your questions and learn how to use School Pro.</p>
        <input 
          type="search" 
          placeholder="Search for articles..." 
          className="w-full max-w-lg mx-auto p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        />
      </div>

      {/* Grid Layout for the 3 core sections */}
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Section 1 & 2: Articles & FAQs */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <Accordion className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium">What is School Pro?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                School Pro is a comprehensive school management system designed to streamline administrative tasks.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium">How do I reset my portal password?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can reset your password by clicking "Forgot Password" on the login screen or contacting the admin.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Section 3: Contact Cards */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="mailto:support@schoolpro.com" className="p-4 border rounded-md flex items-center bg-card hover:bg-muted transition-colors group">
              <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">Send us an email anytime.</p>
              </div>
            </Link>
            
            <Link href="" className="p-4 border rounded-md flex items-center bg-card hover:bg-muted transition-colors group">
              <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary/20 transition-colors">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm.</p>
              </div>
            </Link>

            <Link href="/live-chat" className="p-4 border rounded-md flex items-center bg-card hover:bg-muted transition-colors group">
              <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary/20 transition-colors">
                <MessageCircle className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with a support agent.</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
