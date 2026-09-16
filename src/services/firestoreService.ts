import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { Habit, Goal, DailyTask, CalendarEvent, UserProfile } from '../types';

// Save or sync user profile
export async function syncUserProfileToFirestore(user: UserProfile) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(
      userRef,
      {
        ...user,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving user profile to Firestore:', err);
  }
}

// Subscribe to real-time habits
export function subscribeToUserHabits(
  userId: string,
  onUpdate: (habits: Habit[]) => void
) {
  const q = query(collection(db, 'habits'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Habit[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id || docSnap.id,
          title: data.title,
          subtitle: data.subtitle,
          streak: data.streak ?? 1,
          completed: !!data.completed,
          category: data.category || 'mind',
          timeBlock: data.timeBlock || 'morning',
          icon: data.icon || 'Sparkles'
        });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore habits snapshot warning:', error);
    }
  );
}

// Upsert Habit
export async function saveHabitToFirestore(userId: string, habit: Habit) {
  try {
    const docRef = doc(db, 'habits', habit.id);
    await setDoc(
      docRef,
      {
        ...habit,
        userId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving habit to Firestore:', err);
  }
}

// Delete Habit
export async function deleteHabitFromFirestore(habitId: string) {
  try {
    await deleteDoc(doc(db, 'habits', habitId));
  } catch (err) {
    console.error('Error deleting habit from Firestore:', err);
  }
}

// Subscribe to real-time tasks
export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: DailyTask[]) => void
) {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: DailyTask[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id || docSnap.id,
          title: data.title,
          completed: !!data.completed,
          time: data.time || '10:00',
          priority: data.priority || 'normal',
          category: data.category || 'trabajo',
          tag: data.tag || undefined
        });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore tasks snapshot warning:', error);
    }
  );
}

// Upsert Task
export async function saveTaskToFirestore(userId: string, task: DailyTask) {
  try {
    const docRef = doc(db, 'tasks', task.id);
    await setDoc(
      docRef,
      {
        ...task,
        userId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving task to Firestore:', err);
  }
}

// Delete Task
export async function deleteTaskFromFirestore(taskId: string) {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (err) {
    console.error('Error deleting task from Firestore:', err);
  }
}

// Subscribe to real-time goals
export function subscribeToUserGoals(
  userId: string,
  onUpdate: (goals: Goal[]) => void
) {
  const q = query(collection(db, 'goals'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Goal[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id || docSnap.id,
          title: data.title,
          category: data.category || 'finance',
          categoryLabel: data.categoryLabel || 'Metas',
          badge: data.badge || '+0',
          current: data.current ?? 0,
          target: data.target ?? 100,
          unit: data.unit || '',
          prefix: data.prefix || '',
          color: data.color || 'cyan',
          image: data.image || '',
          timeline: data.timeline || '2026'
        });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore goals snapshot warning:', error);
    }
  );
}

// Upsert Goal
export async function saveGoalToFirestore(userId: string, goal: Goal) {
  try {
    const docRef = doc(db, 'goals', goal.id);
    await setDoc(
      docRef,
      {
        ...goal,
        userId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving goal to Firestore:', err);
  }
}

// Delete Goal
export async function deleteGoalFromFirestore(goalId: string) {
  try {
    await deleteDoc(doc(db, 'goals', goalId));
  } catch (err) {
    console.error('Error deleting goal from Firestore:', err);
  }
}

// Subscribe to real-time events
export function subscribeToUserEvents(
  userId: string,
  onUpdate: (events: CalendarEvent[]) => void
) {
  const q = query(collection(db, 'events'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CalendarEvent[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: data.id || docSnap.id,
          title: data.title,
          type: data.type || 'event',
          date: data.date || '2026-09-15',
          timeStart: data.timeStart || '09:00',
          timeEnd: data.timeEnd || '10:00',
          allDay: !!data.allDay,
          color: data.color || 'cyan',
          desc: data.desc || '',
          tag: data.tag || '',
          completed: !!data.completed
        });
      });
      if (items.length > 0) {
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore events snapshot warning:', error);
    }
  );
}

// Upsert Event
export async function saveEventToFirestore(userId: string, event: CalendarEvent) {
  try {
    const docRef = doc(db, 'events', event.id);
    await setDoc(
      docRef,
      {
        ...event,
        userId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Error saving event to Firestore:', err);
  }
}

// Delete Event
export async function deleteEventFromFirestore(eventId: string) {
  try {
    await deleteDoc(doc(db, 'events', eventId));
  } catch (err) {
    console.error('Error deleting event from Firestore:', err);
  }
}
