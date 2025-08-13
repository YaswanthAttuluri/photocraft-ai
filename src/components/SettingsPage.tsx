import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Bell, 
  Shield, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Palette,
  Zap,
  Save
} from 'lucide-react';

interface SettingsPageProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onUpdateSettings: (settings: any) => void;
  onBack: () => void;
}

export function SettingsPage({ theme, onThemeToggle, onUpdateSettings, onBack }: SettingsPageProps) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      processing: true,
      marketing: false
    },
    privacy: {
      analytics: true,
      crashReports: true,
      publicProfile: false
    },
    processing: {
      autoSave: true,
      highQuality: false,
      watermark: true,
      compression: 'medium'
    },
    interface: {
      language: 'en',
      autoPreview: true,
      showTips: true,
      compactMode: false
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    onUpdateSettings(settings);
  };

  const handleResetSettings = () => {
    setSettings({
      notifications: {
        email: true,
        push: false,
        processing: true,
        marketing: false
      },
      privacy: {
        analytics: true,
        crashReports: true,
        publicProfile: false
      },
      processing: {
        autoSave: true,
        highQuality: false,
        watermark: true,
        compression: 'medium'
      },
      interface: {
        language: 'en',
        autoPreview: true,
        showTips: true,
        compactMode: false
      }
    });
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Customize your PhotoCraft AI experience</p>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                </div>
                <button
                  onClick={onThemeToggle}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compact Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use a more compact interface</p>
                </div>
                <ToggleSwitch
                  enabled={settings.interface.compactMode}
                  onChange={(value) => handleSettingChange('interface', 'compactMode', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Show Tips</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Display helpful tips and tutorials</p>
                </div>
                <ToggleSwitch
                  enabled={settings.interface.showTips}
                  onChange={(value) => handleSettingChange('interface', 'showTips', value)}
                />
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Processing</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Auto-save Projects</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save your work</p>
                </div>
                <ToggleSwitch
                  enabled={settings.processing.autoSave}
                  onChange={(value) => handleSettingChange('processing', 'autoSave', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Auto Preview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Show live preview while editing</p>
                </div>
                <ToggleSwitch
                  enabled={settings.interface.autoPreview}
                  onChange={(value) => handleSettingChange('interface', 'autoPreview', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">High Quality Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use maximum quality (slower)</p>
                </div>
                <ToggleSwitch
                  enabled={settings.processing.highQuality}
                  onChange={(value) => handleSettingChange('processing', 'highQuality', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Compression Level</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Default export compression</p>
                </div>
                <select
                  value={settings.processing.compression}
                  onChange={(e) => handleSettingChange('processing', 'compression', e.target.value)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="lossless">Lossless</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.email}
                  onChange={(value) => handleSettingChange('notifications', 'email', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Processing Complete</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Notify when processing finishes</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.processing}
                  onChange={(value) => handleSettingChange('notifications', 'processing', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Marketing Updates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive product updates and offers</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notifications.marketing}
                  onChange={(value) => handleSettingChange('notifications', 'marketing', value)}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Help improve our service</p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.analytics}
                  onChange={(value) => handleSettingChange('privacy', 'analytics', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Crash Reports</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send crash reports automatically</p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.crashReports}
                  onChange={(value) => handleSettingChange('privacy', 'crashReports', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Public Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to others</p>
                </div>
                <ToggleSwitch
                  enabled={settings.privacy.publicProfile}
                  onChange={(value) => handleSettingChange('privacy', 'publicProfile', value)}
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3 mb-6">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Reset Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reset all settings to default values</p>
                </div>
                <button
                  onClick={handleResetSettings}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Reset Settings
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Clear All Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Delete all projects and processing history</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Clear Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}