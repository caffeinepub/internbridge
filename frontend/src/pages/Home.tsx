import React from 'react';
import { ArrowRight, CheckCircle, Search, Shield, Zap, Users, Award, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeProps {
  navigate: (page: string) => void;
}

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Skill Verification',
    description: 'Admin-verified skill badges give recruiters confidence in your abilities and help you stand out.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Smart Matching',
    description: 'Our platform matches students with internships based on verified skills and preferences.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Easy Applications',
    description: 'Apply to multiple internships with a single click. Track all your applications in one place.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Skill Assessments',
    description: 'Take skill tests in Excel, SQL, Power BI, and Python to earn verified badges on your profile.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Verified Employers',
    description: 'All recruiters are verified by our admin team, ensuring legitimate internship opportunities.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Career Growth',
    description: 'Build your portfolio with real-world experience and launch your career with confidence.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const stats = [
  { value: '500+', label: 'Active Internships' },
  { value: '2,000+', label: 'Students Placed' },
  { value: '150+', label: 'Verified Companies' },
  { value: '95%', label: 'Satisfaction Rate' },
];

export function Home({ navigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/30">
              <Star className="w-3.5 h-3.5 fill-white" />
              India's #1 Skill-Based Internship Platform
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Bridge the Gap Between{' '}
              <span className="text-yellow-300">Skills</span> and{' '}
              <span className="text-yellow-300">Opportunities</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with top companies, showcase your verified skills, and land your dream internship. 
              Join thousands of students who've launched their careers with InternBridge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('search')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-base shadow-lg"
              >
                Find Internships
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('register-recruiter')}
                className="border-white/50 text-white hover:bg-white/10 font-semibold px-8 py-3 text-base backdrop-blur-sm"
              >
                Hire Talent
                <Users className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose <span className="gradient-text">InternBridge</span>?
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              We've built the most comprehensive platform to connect skilled students with the right opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-slate-100 bg-white card-hover shadow-card">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg">Get started in just 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Register as a student, upload your resume, and list your skills.' },
              { step: '02', title: 'Get Verified', desc: 'Take skill assessments and get your profile verified by our admin team.' },
              { step: '03', title: 'Land Your Internship', desc: 'Browse verified internships and apply with a single click.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-white text-xl">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students and companies already using InternBridge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('register')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('search')}
              className="border-white/50 text-white hover:bg-white/10 font-semibold px-8"
            >
              Browse Internships
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">InternBridge</span>
            </div>
            <p className="text-sm text-center">
              © {new Date().getFullYear()} InternBridge. Built with{' '}
              <span className="text-red-400">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'internbridge')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-4 text-sm">
              <button onClick={() => navigate('search')} className="hover:text-white transition-colors">Internships</button>
              <button onClick={() => navigate('login')} className="hover:text-white transition-colors">Login</button>
              <button onClick={() => navigate('register')} className="hover:text-white transition-colors">Register</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
