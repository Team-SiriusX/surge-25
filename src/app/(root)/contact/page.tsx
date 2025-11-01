import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <>
      <div className="relative flex min-h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased">
        {/* Grid Background */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
          )}
        />

        {/* Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <Spotlight
          className="-top-40 right-0 md:-top-20 md:right-60"
          fill="white"
          mirror={true}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 py-20 md:py-32">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-normal text-neutral-300">
            Have questions or feedback? We'd love to hear from you. Our team is here to help.
          </p>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                  <Mail className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">Email Us</h3>
                <p className="text-sm text-neutral-400 mb-3">
                  Get in touch via email for general inquiries.
                </p>
                <a 
                  href="mailto:support@uniconnect.com" 
                  className="text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
                >
                  support@uniconnect.com
                </a>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                  <MessageSquare className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">Live Chat</h3>
                <p className="text-sm text-neutral-400 mb-3">
                  Chat with our support team in real-time.
                </p>
                <Button variant="outline" size="sm" className="border-neutral-700 hover:border-neutral-600">
                  Start Chat
                </Button>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                  <MapPin className="h-6 w-6 text-neutral-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">Visit Us</h3>
                <p className="text-sm text-neutral-400">
                  123 Campus Drive<br />
                  Innovation Hub, Suite 200<br />
                  Tech Valley, CA 94000
                </p>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm">
                <h2 className="mb-6 text-2xl font-bold text-neutral-100">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-300">
                        First Name
                      </label>
                      <Input 
                        placeholder="John" 
                        className="border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-300">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Doe" 
                        className="border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Email
                    </label>
                    <Input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Subject
                    </label>
                    <Input 
                      placeholder="How can we help?" 
                      className="border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-300">
                      Message
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..." 
                      rows={6}
                      className="border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-800/30 p-4">
                  <p className="text-sm text-neutral-400">
                    <strong className="text-neutral-300">Response Time:</strong> We typically respond within 24 hours during business days.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-20 max-w-3xl pb-20">
            <h2 className="mb-8 text-center text-3xl font-bold text-neutral-100">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">
                  How do I create an account?
                </h3>
                <p className="text-sm text-neutral-400">
                  Click on the "Sign Up" button in the navigation bar and choose whether you're a job seeker or opportunity finder. Fill in your details and verify your email to get started.
                </p>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">
                  Is UniConnect free to use?
                </h3>
                <p className="text-sm text-neutral-400">
                  Yes! UniConnect is completely free for students. We believe in making opportunities accessible to everyone on campus.
                </p>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm">
                <h3 className="mb-2 text-lg font-semibold text-neutral-100">
                  How does the AI matching work?
                </h3>
                <p className="text-sm text-neutral-400">
                  Our AI analyzes your profile, skills, interests, and preferences to recommend opportunities that best match your goals. The more you use the platform, the smarter the recommendations become.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
