import { formatDistanceToNow, format } from 'date-fns';

// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Distance calculation (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

export const formatDistance = (miles) => {
  if (miles < 0.1) return 'nearby';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} mi`;
};

// Post category helpers
export const getCategoryColor = (category) => {
  const colors = {
    safety: 'bg-red-50 text-red-700 border-red-200',
    'lost-pet': 'bg-blue-50 text-blue-700 border-blue-200',
    event: 'bg-green-50 text-green-700 border-green-200',
    question: 'bg-amber-50 text-amber-700 border-amber-200',
    accessibility: 'bg-purple-50 text-purple-700 border-purple-200',
    other: 'bg-stone-50 text-stone-700 border-stone-200',
  };
  return colors[category] || colors.other;
};

export const getCategoryLabel = (category) => {
  const labels = {
    safety: 'Safety',
    'lost-pet': 'Lost Pet',
    event: 'Event',
    question: 'Question',
    accessibility: 'Accessibility',
    other: 'Other',
  };
  return labels[category] || 'Other';
};

// Validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(phone);
};

// String helpers
export const truncate = (str, length = 100) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// URL helpers
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Image upload helpers
export const compressImage = async (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          quality
        );
      };
    };
  });
};

// Local storage helpers
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch {
      return item;
    }
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Geolocation
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Urgency levels
export const getUrgencyColor = (urgency) => {
  const colors = {
    low: 'text-green-600',
    medium: 'text-amber-600',
    high: 'text-orange-600',
    emergency: 'text-red-600',
  };
  return colors[urgency] || colors.low;
};

export const getUrgencyLabel = (urgency) => {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency',
  };
  return labels[urgency] || 'Low';
};
