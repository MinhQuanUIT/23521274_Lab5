import { useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Moon, Sun, Bell, BellOff, User, Save } from 'lucide-react';
import './SettingsPage.css';

export function SettingsPage() {
  const { theme, notifications: notifEnabled, toggleTheme, toggleNotifications } = useSettingsStore();
  const { user, updateUser } = useAuthStore();
  const addNotification = useNotificationStore(state => state.addNotification);

  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');

  const handleSaveProfile = () => {
    if (user) {
      updateUser({
        ...user,
        name: userName,
        email: userEmail
      });
      addNotification({
        type: 'success',
        message: 'Profile updated successfully',
        read: false
      });
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    addNotification({
      type: 'info',
      message: `Theme changed to ${theme === 'light' ? 'dark' : 'light'} mode`,
      read: false
    });
  };

  const handleNotificationToggle = () => {
    toggleNotifications();
    addNotification({
      type: 'info',
      message: `Notifications ${notifEnabled ? 'disabled' : 'enabled'}`,
      read: false
    });
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Manage your application preferences</p>
      </header>

      <div className="settings-content">
        {/* User Profile Section */}
        <div className="settings-section">
          <div className="section-header">
            <User size={24} />
            <h2>User Profile</h2>
          </div>
          <div className="section-body">
            <div className="form-group">
              <label htmlFor="userName">Name</label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userEmail">Email</label>
              <input
                id="userEmail"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role || 'User'}
                disabled
                className="disabled-input"
              />
            </div>
            <button className="btn-save" onClick={handleSaveProfile}>
              <Save size={20} />
              Save Profile
            </button>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="settings-section">
          <div className="section-header">
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
            <h2>Appearance</h2>
          </div>
          <div className="section-body">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Theme</h3>
                <p>Choose between light and dark mode</p>
              </div>
              <button 
                className={`toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={handleThemeToggle}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            <div className="theme-preview">
              <span className="theme-label">Current theme:</span>
              <span className="theme-value">{theme === 'light' ? 'Light' : 'Dark'}</span>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <div className="section-header">
            {notifEnabled ? <Bell size={24} /> : <BellOff size={24} />}
            <h2>Notifications</h2>
          </div>
          <div className="section-body">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Enable Notifications</h3>
                <p>Receive pop-up notifications for important events</p>
              </div>
              <button 
                className={`toggle-btn ${notifEnabled ? 'active' : ''}`}
                onClick={handleNotificationToggle}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>
            <div className="notification-info">
              <p className="info-text">
                {notifEnabled 
                  ? '✓ You will receive notifications for sales, product updates, and system alerts' 
                  : '✗ Notifications are currently disabled'}
              </p>
            </div>
          </div>
        </div>

        {/* System Info Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2>System Information</h2>
          </div>
          <div className="section-body">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Version:</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Login:</span>
                <span className="info-value">{new Date().toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID:</span>
                <span className="info-value">{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
