import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import './NotificationToast.css';

export function NotificationToast() {
  const { notifications, markAsRead } = useNotificationStore();
  
  const unreadNotifications = notifications.filter(n => !n.read).slice(0, 5);

  useEffect(() => {
    // Auto-dismiss notifications after 5 seconds
    const timers = unreadNotifications.map(notification => {
      return setTimeout(() => {
        markAsRead(notification.id);
      }, 5000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [unreadNotifications, markAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  if (unreadNotifications.length === 0) return null;

  return (
    <div className="notification-container">
      {unreadNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-toast ${notification.type}`}
        >
          <div className="notification-icon">
            {getIcon(notification.type)}
          </div>
          <div className="notification-content">
            <p className="notification-message">{notification.message}</p>
          </div>
          <button
            className="notification-close"
            onClick={() => markAsRead(notification.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
