
import React, { useState } from 'react';
import AuthModal from './AuthModal';
import { BrainIcon, TargetIcon, LightbulbIcon, PlusIcon, ArrowRightIcon, BriefcaseIcon, QuestionMarkCircleIcon } from './icons';

interface LandingPageProps {
  onLogin: (data: any) => void;
  onRegister: (data: any) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-brand-content-bg p-6 rounded-lg border border-gray-200 shadow-sm h-full">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-brand-accent/10 p-2 rounded-full">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
        </div>
        <p className="text-brand-subtle">{children}</p>
    </div>
);

const FaqItem: React.FC<{ q: string; a: string; }> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-brand-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{q}</span>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    <PlusIcon className="w-6 h-6 text-brand-accent" />
                </span>
            </button>
            {isOpen && (
                <div className="mt-3 text-brand-subtle">
                    <p>{a}</p>
                </div>
            )}
        </div>
    );
};


const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const [modalView, setModalView] = useState<'login' | 'register' | null>(null);

  return (
    <div className="h-full w-full overflow-y-auto bg-brand-secondary">
      {modalView && (
        <AuthModal
          initialView={modalView}
          onClose={() => setModalView(null)}
          onLogin={onLogin}
          onRegister={onRegister}
        />
      )}
      
      {/* Header */}
      <header className="p-4 md:p-6 bg-brand-secondary/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-primary tracking-wider">ElicitSim.</h1>
            <div className="flex items-center gap-4">
                <button onClick={() => setModalView('login')} className="text-brand-primary font-semibold hover:text-brand-accent transition-colors">
                    Login
                </button>
                <button onClick={() => setModalView('register')} className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                    Register <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-5xl md:text-7xl font-bold text-brand-primary leading-tight mb-4">
                    Master the Art of Conversation.
                </h2>
                <p className="text-brand-subtle mb-8 text-lg md:text-xl max-w-3xl mx-auto">
                    Hone your elicitation and anti-elicitation skills with our advanced AI-powered training simulator. Engage in realistic scenarios, receive instant feedback, and become a more effective communicator.
                </p>
                <button onClick={() => setModalView('register')} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl">
                    Start Training Now
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-bold text-brand-primary">A Smarter Way to Train</h3>
                     <p className="text-brand-subtle mt-4 text-lg">Go beyond theory with interactive, AI-driven practice.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard title="Adaptive AI Personas" icon={<BrainIcon className="w-6 h-6 text-brand-accent" />}>
                        Engage with unique characters, each with distinct psychological profiles, strengths, and weaknesses.
                    </FeatureCard>
                    <FeatureCard title="Dual Training Modes" icon={<TargetIcon className="w-6 h-6 text-brand-accent" />}>
                        Practice both extracting information (Elicitation) and protecting it (Anti-Elicitation) in dynamic conversations.
                    </FeatureCard>
                    <FeatureCard title="Instant Analysis" icon={<LightbulbIcon className="w-6 h-6 text-brand-accent" />}>
                        Receive AI-driven feedback on your technique, missed opportunities, and overall performance after every session.
                    </FeatureCard>
                     <FeatureCard title="Custom Scenarios" icon={<PlusIcon className="w-6 h-6 text-brand-accent" />}>
                        Import your own persona profiles and intelligence targets to train in environments that mirror your real-world challenges.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4">
             <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-bold text-brand-primary">Three Simple Steps to Mastery</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8 md:gap-16 relative">
                    {/* Dashed line connecting steps - visible on desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                        <svg width="100%" height="2"><line x1="0" y1="1" x2="100%" y2="1" stroke="#d1d5db" strokeWidth="2" strokeDasharray="8 8"/></svg>
                    </div>
                    <div className="text-center relative bg-brand-secondary p-4 rounded-lg">
                        <div className="w-16 h-16 bg-brand-accent text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-secondary">01</div>
                        <h4 className="text-2xl font-bold text-brand-primary mb-2">Choose Mode</h4>
                        <p className="text-brand-subtle">Select whether you want to practice eliciting information or defending against it.</p>
                    </div>
                    <div className="text-center relative bg-brand-secondary p-4 rounded-lg">
                        <div className="w-16 h-16 bg-brand-accent text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-secondary">02</div>
                        <h4 className="text-2xl font-bold text-brand-primary mb-2">Engage AI</h4>
                        <p className="text-brand-subtle">Start a conversation with an AI persona and pursue your objective.</p>
                    </div>
                    <div className="text-center relative bg-brand-secondary p-4 rounded-lg">
                        <div className="w-16 h-16 bg-brand-accent text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-brand-secondary">03</div>
                        <h4 className="text-2xl font-bold text-brand-primary mb-2">Get Feedback</h4>
                        <p className="text-brand-subtle">Receive an instant, detailed analysis of your performance and key takeaways.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Built For Professionals Section */}
         <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-bold text-brand-primary">Built for Professionals</h3>
                     <p className="text-brand-subtle mt-4 text-lg">Gain a competitive edge in any field where information is key.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard title="Security & Intel" icon={<BriefcaseIcon className="w-6 h-6 text-brand-accent" />}>
                        Practice human intelligence (HUMINT) gathering, threat assessment, and identifying vulnerabilities in a safe environment.
                    </FeatureCard>
                    <FeatureCard title="Sales & Negotiation" icon={<BriefcaseIcon className="w-6 h-6 text-brand-accent" />}>
                        Master discovery calls, uncover client needs, and navigate difficult objections without risking real deals.
                    </FeatureCard>
                    <FeatureCard title="HR & Recruitment" icon={<BriefcaseIcon className="w-6 h-6 text-brand-accent" />}>
                        Improve interviewing techniques, vet candidates more effectively, and learn to spot inconsistencies.
                    </FeatureCard>
                     <FeatureCard title="Journalism & Research" icon={<BriefcaseIcon className="w-6 h-6 text-brand-accent" />}>
                        Hone your skills in conducting interviews, verifying information, and building rapport with sources.
                    </FeatureCard>
                </div>
            </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-bold text-brand-primary">Don't Just Take Our Word For It</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-brand-content-bg p-8 rounded-lg border border-gray-200">
                        <p className="text-brand-subtle italic text-lg">"This is the most realistic training I've had outside of live exercises. The ability to upload our own target profiles makes it an invaluable tool for our security team."</p>
                        <div className="mt-4 font-bold text-right">
                            <p className="text-brand-primary">- Alex Chen</p>
                            <p className="text-brand-accent text-sm">Corporate Security Analyst</p>
                        </div>
                    </div>
                    <div className="bg-brand-content-bg p-8 rounded-lg border border-gray-200">
                        <p className="text-brand-subtle italic text-lg">"ElicitSim has completely changed how I prep for sales calls. I can practice handling objections against different personality types. My confidence has skyrocketed."</p>
                        <div className="mt-4 font-bold text-right">
                            <p className="text-brand-primary">- Samantha Jones</p>
                            <p className="text-brand-accent text-sm">Enterprise Account Executive</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <h3 className="text-4xl md:text-5xl font-bold text-brand-primary">Frequently Asked Questions</h3>
                </div>
                <div>
                    <FaqItem
                        q="Is my training data private?"
                        a="Absolutely. All conversations and imported data are processed in real-time and are not stored or used for any other purpose. Your training sessions are confidential."
                    />
                    <FaqItem
                        q="How does the AI work?"
                        a="ElicitSim is powered by Google's advanced Gemini models. We provide the AI with a detailed persona profile and a secret objective, and it generates responses dynamically to create a realistic, unscripted conversation."
                    />
                    <FaqItem
                        q="Can I really add my own scenarios?"
                        a="Yes. Our data import feature allows you to upload JSON files containing custom persona profiles and target information, enabling you to tailor the training to your specific industry and challenges."
                    />
                     <FaqItem
                        q="Is this suitable for teams?"
                        a="While currently designed for individual use, the principles and practices are highly beneficial for teams. We are actively developing team-based features and analytics for enterprise clients."
                    />
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
             <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-primary leading-tight mb-4">
                    Ready to Elevate Your Skills?
                </h2>
                <p className="text-brand-subtle mb-8 text-lg md:text-xl max-w-3xl mx-auto">
                    Stop guessing, start practicing. Join now and gain the confidence to handle any high-stakes conversation.
                </p>
                <button onClick={() => setModalView('register')} className="bg-brand-accent hover:bg-brand-accent/80 text-white font-bold py-4 px-8 rounded-lg transition-colors text-xl">
                    Get Started for Free
                </button>
            </div>
        </section>
        
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-brand-subtle text-sm bg-white">
          <p>&copy; {new Date().getFullYear()} ElicitSim. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
