import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Crown, 
  Check, 
  CreditCard, 
  Calendar,
  Download,
  Star,
  Zap,
  Shield,
  Clock,
  Users
} from 'lucide-react';

interface BillingPageProps {
  user: any;
  onUpgrade: (plan: string) => void;
  onBack: () => void;
}

export function BillingPage({ user, onUpgrade, onBack }: BillingPageProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      credits: 20,
      features: [
        'Basic image processing',
        'Standard export formats',
        'Community support',
        'Watermarked outputs',
        '5 projects storage'
      ],
      popular: false,
      current: user?.subscription_tier === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 5, yearly: 50 },
      credits: 1000,
      features: [
        'All processing modes',
        'High-quality exports',
        'Priority support',
        'No watermarks',
        'Unlimited projects',
        'Batch processing',
        'API access',
        'Advanced settings'
      ],
      popular: true,
      current: user?.subscription_tier === 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 15, yearly: 150 },
      credits: 10000,
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'White-label options',
        'Advanced analytics',
        'Team collaboration',
        'Custom AI models',
        'Priority processing'
      ],
      popular: false,
      current: user?.subscription_tier === 'enterprise'
    }
  ];

  const billingHistory = [
    {
      id: 1,
      date: '2024-12-15',
      amount: 5.00,
      plan: 'Pro Monthly',
      status: 'paid',
      invoice: 'INV-001'
    },
    {
      id: 2,
      date: '2024-11-15',
      amount: 5.00,
      plan: 'Pro Monthly',
      status: 'paid',
      invoice: 'INV-002'
    },
    {
      id: 3,
      date: '2024-10-15',
      amount: 5.00,
      plan: 'Pro Monthly',
      status: 'paid',
      invoice: 'INV-003'
    }
  ];

  const handleUpgrade = () => {
    onUpgrade(selectedPlan);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Plans</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your subscription and billing information</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan & Usage */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Current Plan
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {user?.subscription_tier || 'Free'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Credits</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.credits_remaining || 0} remaining
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                </div>
                {user?.subscription_tier !== 'free' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Next Billing</span>
                    <span className="font-medium text-gray-900 dark:text-white">Jan 15, 2025</span>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                This Month's Usage
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Credits Used</span>
                    <span className="text-gray-900 dark:text-white">
                      {20 - (user?.credits_remaining || 0)} / 20
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((20 - (user?.credits_remaining || 0)) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {50 - (user?.credits_remaining || 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Images Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      0
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">API Calls</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="lg:col-span-2">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs text-green-600 dark:text-green-400">Save 17%</span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -4 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 transition-all ${
                    plan.popular 
                      ? 'border-blue-500 scale-105' 
                      : plan.current
                      ? 'border-green-500'
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

                  {plan.current && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      ${plan.price[billingCycle]}
                      <span className="text-lg text-gray-500 dark:text-gray-400">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {plan.credits.toLocaleString()} processing credits
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      if (!plan.current) handleUpgrade();
                    }}
                    disabled={plan.current}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.current
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.current ? 'Current Plan' : plan.price[billingCycle] === 0 ? 'Downgrade' : 'Upgrade'}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Billing History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Billing History
                </h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Plan</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {item.plan}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline">
                            {item.invoice}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}