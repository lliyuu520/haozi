import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import weekday from 'dayjs/plugin/weekday';
import { cloneDeep } from 'lodash';

// 配置 dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(weekday);

// 格式化日期时间
export const formatDateTime = (
  date: string | Date | Dayjs,
  format = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(date).format(format);
};

// 格式化日期
export const formatDate = (date: string | Date | Dayjs): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

// 格式化时间
export const formatTime = (date: string | Date | Dayjs): string => {
  return dayjs(date).format('HH:mm:ss');
};

// 相对时间
export const formatRelativeTime = (date: string | Date | Dayjs): string => {
  return dayjs(date).fromNow();
};

// 文件大小格式化
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 数字千分位格式化
export const formatNumber = (num: number | string): string => {
  return Number(num).toLocaleString('zh-CN');
};

// 金额格式化
export const formatMoney = (
  amount: number | string,
  currency = '¥',
  precision = 2
): string => {
  const num = Number(amount);
  return `${currency}${num.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// 手机号脱敏
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 邮箱脱敏
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  if (username.length <= 3) return email;
  const maskedUsername = username.slice(0, 3) + '***';
  return `${maskedUsername}@${domain}`;
};

// 身份证脱敏
export const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 8) return idCard;
  return idCard.slice(0, 4) + '**********' + idCard.slice(-4);
};

// 银行卡脱敏
export const maskBankCard = (cardNo: string): string => {
  if (!cardNo || cardNo.length < 8) return cardNo;
  return cardNo.slice(0, 4) + ' **** **** ' + cardNo.slice(-4);
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  return cloneDeep(obj);
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
};

// 获取文件扩展名
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

// 检查文件类型
export const getFileType = (filename: string): string => {
  const ext = getFileExtension(filename).toLowerCase();

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];
  const audioExts = ['mp3', 'wav', 'flac', 'aac', 'ogg'];
  const docExts = ['doc', 'docx', 'pdf', 'txt', 'rtf'];
  const excelExts = ['xls', 'xlsx', 'csv'];
  const pptExts = ['ppt', 'pptx'];
  const zipExts = ['zip', 'rar', '7z', 'tar', 'gz'];

  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (docExts.includes(ext)) return 'document';
  if (excelExts.includes(ext)) return 'excel';
  if (pptExts.includes(ext)) return 'presentation';
  if (zipExts.includes(ext)) return 'archive';

  return 'other';
};

// 颜色工具
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// URL 参数处理
export const getQueryParam = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get(name);
};

export const setQueryParam = (name: string, value: string): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState({}, '', url.toString());
};

// 本地存储工具
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('localStorage 设置失败:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;

    localStorage.clear();
  }
};