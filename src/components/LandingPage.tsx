import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Palette, 
  Scissors, 
  Camera, 
  MessageSquare, 
  Sparkles,
  Shield,
  Clock,
  Users,
  Star,
  ArrowRight,
  Check,
  Crown,
  Cpu,
  Globe,
  Download
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onModeSelect?: (mode: string) => void;
}

export function LandingPage({ onGetStarted, onModeSelect }: LandingPageProps) {
  const features = [
    {
      id: 'cartoonify',
      icon: Palette,
      title: '🎨 AI Cartoonify',
      description: 'Transform your photos into stunning cartoon masterpieces with advanced AI artistry. Perfect for avatars, social media, and creative projects.',
      gradient: 'from-pink-500 via-purple-500 to-rose-500'
    },
    {
      id: 'background',
      icon: Scissors,
      title: '✂️ Magic Eraser',
      description: 'Remove backgrounds like magic! Our AI instantly detects and removes backgrounds with pixel-perfect precision. No green screen needed.',
      gradient: 'from-blue-500 via-teal-500 to-cyan-400'
    },
    {
      id: 'passport',
      icon: Camera,
      title: '📸 ID Photo Studio',
      description: 'Create professional passport and ID photos that meet official requirements for any country. Visa applications made easy!',
      gradient: 'from-green-500 via-emerald-500 to-teal-500'
    },
    {
      id: 'meme',
      icon: MessageSquare,
      title: '😂 Viral Meme Maker',
      description: 'Create internet-breaking memes with custom text, fonts, and styling. From classic formats to trending templates - go viral!',
      gradient: 'from-purple-500 via-indigo-500 to-blue-600'
    },
    {
      id: 'enhance',
      icon: Sparkles,
      title: '✨ Photo Enhancer Pro',
      description: 'Transform ordinary photos into extraordinary masterpieces. Enhance colors, sharpness, and quality with professional-grade AI.',
      gradient: 'from-yellow-400 via-orange-500 to-red-500'
    },
    {
      id: 'restore',
      icon: Cpu,
      title: '🔮 Time Machine',
      description: 'Bring precious memories back to life! Our AI restoration technology repairs old, damaged, or faded photos like magic.',
      gradient: 'from-amber-500 via-orange-600 to-red-600'
    }
  ];

  const stats = [
    { number: '2.5M+', label: 'Images Processed' },
    { number: '50K+', label: 'Happy Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '<2s', label: 'Avg Processing' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Graphic Designer',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'PhotoCraft AI has revolutionized my workflow. The cartoonify feature is incredible!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Social Media Manager',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'The meme generator and background removal tools are exactly what I needed.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Content Creator',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      content: 'Professional results in seconds. This platform is a game-changer!',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: 0,
      credits: 20,
      features: [
        'Basic image processing',
        'Standard export formats',
        'Community support',
        'Watermarked outputs'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: 5,
      credits: 1000,
      features: [
        'All processing modes',
        'High-quality exports',
        'Priority support',
        'No watermarks',
        'Batch processing',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 15,
      credits: 10000,
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'White-label options',
        'Advanced analytics'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI Technology
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Images with
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional-grade image processing tools powered by cutting-edge AI. 
              Create stunning visuals, remove backgrounds, generate memes, and more – all in your browser.
              <br />
              <span className="text-blue-500 dark:text-blue-300 font-semibold">
                🚀 Now in Beta - Special Launch Pricing Available!
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                Watch Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-gray-600 dark:text-gray-300">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-gray-600 dark:text-gray-300">Instant Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-gray-600 dark:text-gray-300">Works Offline</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful AI Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto">
              Everything you need to create, edit, and enhance images with professional results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700"
              >
                <button
                  onClick={() => onModeSelect?.(feature.id)}
                  className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 hover:scale-110 transition-transform cursor-pointer`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </button>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-200 leading-relaxed">
                  {feature.description}
                </p>
                <button
                  onClick={() => onModeSelect?.(feature.id)}
                  className="mt-4 w-full py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-500 text-gray-700 dark:text-white rounded-lg hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-500 dark:hover:to-gray-400 transition-all font-medium"
                >
                  Try {feature.title}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="gallery" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Gallery & Testimonials
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              See what our users are saying and examples of their work
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-300 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-200">
              Choose the plan that fits your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 transition-all ${
                  plan.popular 
                    ? 'border-blue-500 scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    ${plan.price}
                    <span className="text-lg text-gray-500 dark:text-gray-300">/month</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-200">
                    {plan.credits} processing credits
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-500'
                  }`}
                >
                  {plan.price === 0 ? 'Start Free' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="api" className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              API & Integration
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Integrate PhotoCraft AI into your applications with our powerful REST API
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">API Features:</h3>
              <ul className="text-blue-100 space-y-2">
                <li>• RESTful API with comprehensive documentation</li>
                <li>• All processing modes available via API</li>
                <li>• Batch processing capabilities</li>
                <li>• Webhook support for async operations</li>
                <li>• SDKs for popular programming languages</li>
                <li>• Enterprise-grade security and reliability</li>
              </ul>
            </div>
            <div className="bg-green-50/10 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center">
              <h3 className="text-lg font-semibold text-white mb-2">🚀 Beta Launch Special!</h3>
              <p className="text-blue-100 text-sm">
                We're currently in beta testing. Join now for early access and special pricing!
                <br />
                <span className="font-semibold">Pro Plan: Just $5/month • Enterprise: $15/month</span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 mx-auto"
            >
              <span>Get API Access</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}