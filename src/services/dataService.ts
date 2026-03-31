import { UserProfile, Grade, Attendance, News, UserRole, ClassPerformance, StudentTrend } from '../types';

let currentUser: UserProfile | null = null;

const STORAGE_KEYS = {
  USER: 'aqbobek_user',
  GRADES: 'aqbobek_grades',
  ATTENDANCE: 'aqbobek_attendance',
  NEWS: 'aqbobek_news',
  ACHIEVEMENTS: 'aqbobek_achievements',
  CLASSES: 'aqbobek_classes'
};

const getLocal = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveLocal = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const dataService = {
  getCurrentUser: (): UserProfile | null => {
    if (!currentUser) {
      currentUser = getLocal<UserProfile | null>(STORAGE_KEYS.USER, null);
    }
    return currentUser;
  },

  login: async (name: string, email: string, role: UserRole = 'student'): Promise<UserProfile> => {
    const profile: UserProfile = {
      uid: 'user_' + Math.random().toString(36).substring(2, 9),
      email,
      role,
      name,
      xp: 1250,
      level: 5,
      streak: 12,
      lastActive: new Date().toISOString()
    };
    currentUser = profile;
    saveLocal(STORAGE_KEYS.USER, profile);
    return profile;
  },

  logout: () => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getGrades: (studentId: string): Grade[] => {
    return getLocal<Grade[]>(STORAGE_KEYS.GRADES, []);
  },

  addGrade: (grade: Omit<Grade, 'id'>) => {
    const grades = getLocal<Grade[]>(STORAGE_KEYS.GRADES, []);
    const newGrade = { ...grade, id: `grade_${Math.random().toString(36).substring(2, 9)}_${Date.now()}` };
    saveLocal(STORAGE_KEYS.GRADES, [newGrade, ...grades]);
    return newGrade;
  },

  getAttendance: (studentId: string): Attendance[] => {
    return getLocal<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
  },

  addAttendance: (record: Omit<Attendance, 'id'>) => {
    const records = getLocal<Attendance[]>(STORAGE_KEYS.ATTENDANCE, []);
    const newRecord = { ...record, id: `att_${Math.random().toString(36).substring(2, 9)}_${Date.now()}` };
    saveLocal(STORAGE_KEYS.ATTENDANCE, [newRecord, ...records]);
    return newRecord;
  },

  getNews: (): News[] => {
    return getLocal<News[]>(STORAGE_KEYS.NEWS, []);
  },

  addNews: (item: Omit<News, 'id'>) => {
    const news = getLocal<News[]>(STORAGE_KEYS.NEWS, []);
    const newItem = { ...item, id: `news_${Math.random().toString(36).substring(2, 9)}_${Date.now()}` };
    saveLocal(STORAGE_KEYS.NEWS, [newItem, ...news]);
    return newItem;
  },

  subscribeToNews: (callback: (news: News[]) => void) => {
    const news = getLocal<News[]>(STORAGE_KEYS.NEWS, []);
    callback(news);
    // In a real app, we'd use a real event emitter
    const interval = setInterval(() => {
      callback(getLocal<News[]>(STORAGE_KEYS.NEWS, []));
    }, 2000);
    return () => clearInterval(interval);
  },

  subscribeToGrades: (studentId: string, callback: (grades: Grade[]) => void) => {
    callback(getLocal<Grade[]>(STORAGE_KEYS.GRADES, []));
    const interval = setInterval(() => {
      callback(getLocal<Grade[]>(STORAGE_KEYS.GRADES, []));
    }, 2000);
    return () => clearInterval(interval);
  },

  getClassesPerformance: (): ClassPerformance[] => {
    const classes = ['11A', '11B', '10A', '10B', '9A', '9B', '9C'];
    return classes.map(id => ({
      id,
      name: `Класс ${id}`,
      avgScore: Math.floor(Math.random() * 30) + 70, // 70-100
      studentCount: Math.floor(Math.random() * 10) + 20, // 20-30
      trend: Math.random() > 0.6 ? 'up' : (Math.random() > 0.3 ? 'down' : 'stable')
    }));
  },

  getTopStudents: (): UserProfile[] => {
    return [
      { uid: 's1', name: 'Alikhanov A.', email: 'a@a.com', role: 'student', xp: 2500, level: 10, streak: 45, lastActive: new Date().toISOString() },
      { uid: 's2', name: 'Berikova D.', email: 'b@b.com', role: 'student', xp: 2300, level: 9, streak: 30, lastActive: new Date().toISOString() },
      { uid: 's3', name: 'Smagulov T.', email: 'c@c.com', role: 'student', xp: 2100, level: 8, streak: 15, lastActive: new Date().toISOString() },
    ];
  },

  getStudentDynamics: (): StudentTrend[] => {
    return [
      {
        name: 'Alikhanov A.',
        data: [
          { month: 'Sep', score: 75 },
          { month: 'Oct', score: 78 },
          { month: 'Nov', score: 82 },
          { month: 'Dec', score: 85 },
          { month: 'Jan', score: 88 },
          { month: 'Feb', score: 92 },
        ]
      },
      {
        name: 'Berikova D.',
        data: [
          { month: 'Sep', score: 88 },
          { month: 'Oct', score: 85 },
          { month: 'Nov', score: 82 },
          { month: 'Dec', score: 80 },
          { month: 'Jan', score: 78 },
          { month: 'Feb', score: 75 },
        ]
      }
    ];
  }
};
