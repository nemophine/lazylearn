'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, User, Palette, Bell, Lock, HelpCircle, ChevronRight, Moon, Globe, Volume2, Shield, Database } from 'lucide-react';

interface SettingsPageProps {
  onLogout?: () => void;
}

export function SettingsPage({ onLogout }: SettingsPageProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const userData = session?.user;

  // If loading, show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view settings.</p>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const settingsSections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, label: 'Edit Profile', description: 'Update your personal information', hasArrow: true },
        { icon: Bell, label: 'Notifications', description: 'Manage email and push notifications', hasToggle: true, enabled: true },
        { icon: Lock, label: 'Privacy & Security', description: 'Control your privacy and security settings', hasArrow: true },
        { icon: Shield, label: 'Two-Factor Authentication', description: 'Add an extra layer of security', hasToggle: true, enabled: false },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Palette, label: 'Theme & Color', description: 'Customize the app appearance', value: 'Light', hasArrow: true },
        { icon: Globe, label: 'Language', description: 'Choose your preferred language', value: 'English', hasArrow: true },
        { icon: Moon, label: 'Dark Mode', description: 'Toggle dark theme', hasToggle: true, enabled: false },
        { icon: Volume2, label: 'Sound Effects', description: 'Enable/disable app sounds', hasToggle: true, enabled: true },
      ]
    },
    {
      title: 'Data & Storage',
      items: [
        { icon: Database, label: 'Data Management', description: 'Manage your data and storage', hasArrow: true },
        { icon: Shield, label: 'Export Data', description: 'Download your personal data', hasArrow: true },
        { icon: Lock, label: 'Clear Cache', description: 'Clear temporary files and cache', hasArrow: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', description: 'Get help and contact support', hasArrow: true },
        { icon: Settings, label: 'About', description: 'App version and legal information', hasArrow: true },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full bg-gray-100 flex items-center justify-center">
              {userData?.image ? (
                <img src={userData.image} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-gray-600">
                  {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{userData?.name || 'User'}</h2>
              <p className="text-gray-600">{userData?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{item.label}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {item.value && (
                              <span className="text-sm text-gray-500">{item.value}</span>
                            )}
                            {item.hasToggle && (
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  defaultChecked={item.enabled}
                                  className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                                  item.enabled ? 'bg-teal-500' : 'bg-gray-300'
                                }`}>
                                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                                    item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                  } mt-0.5`}></div>
                                </div>
                              </div>
                            )}
                            {item.hasArrow && (
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}