import { useEffect, useReducer } from 'react';
import { today } from './dates.js';

const STORAGE_KEY = 'synpulse-todo:v1';

export const SMART_LISTS = [
  { id: 'myday', name: 'My Day', icon: 'sun' },
  { id: 'important', name: 'Important', icon: 'star' },
  { id: 'planned', name: 'Planned', icon: 'calendar' },
  { id: 'tasks', name: 'Tasks', icon: 'home' },
];

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function seed() {
  const t = today();
  const work = { id: uid(), name: 'Work' };
  return {
    lists: [work],
    tasks: [
      task({ title: 'Review onboarding checklist', myDay: t, due: t, important: true }),
      task({ title: 'Send weekly status update', myDay: t, listId: work.id }),
      task({
        title: 'Prepare workshop agenda',
        listId: work.id,
        steps: [
          { id: uid(), title: 'Draft outline', done: true },
          { id: uid(), title: 'Book a room', done: false },
        ],
      }),
      task({ title: 'Renew parking permit', done: true, completedAt: Date.now() }),
    ],
  };
}

function task(fields) {
  return {
    id: uid(),
    title: '',
    done: false,
    important: false,
    myDay: null, // date string it was added to My Day; only counts for today
    due: null,
    note: '',
    steps: [],
    listId: 'tasks',
    createdAt: Date.now(),
    completedAt: null,
    ...fields,
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.lists) && Array.isArray(data.tasks)) return data;
    }
  } catch {
    /* fall through to seed */
  }
  return seed();
}

function updateTask(state, id, fn) {
  return {
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...fn(t) } : t)),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'addTask': {
      const { title, view } = action;
      const fields = { title };
      if (view === 'myday') fields.myDay = today();
      else if (view === 'important') fields.important = true;
      else if (view === 'planned') fields.due = today();
      else if (view !== 'tasks') fields.listId = view;
      return { ...state, tasks: [task(fields), ...state.tasks] };
    }
    case 'toggleDone':
      return updateTask(state, action.id, (t) => ({
        done: !t.done,
        completedAt: t.done ? null : Date.now(),
      }));
    case 'toggleImportant':
      return updateTask(state, action.id, (t) => ({ important: !t.important }));
    case 'toggleMyDay':
      return updateTask(state, action.id, (t) => ({
        myDay: t.myDay === today() ? null : today(),
      }));
    case 'patchTask':
      return updateTask(state, action.id, () => action.patch);
    case 'deleteTask':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'addStep':
      return updateTask(state, action.id, (t) => ({
        steps: [...t.steps, { id: uid(), title: action.title, done: false }],
      }));
    case 'toggleStep':
      return updateTask(state, action.id, (t) => ({
        steps: t.steps.map((s) => (s.id === action.stepId ? { ...s, done: !s.done } : s)),
      }));
    case 'deleteStep':
      return updateTask(state, action.id, (t) => ({
        steps: t.steps.filter((s) => s.id !== action.stepId),
      }));
    case 'addList':
      return { ...state, lists: [...state.lists, { id: action.id, name: action.name }] };
    case 'renameList':
      return {
        ...state,
        lists: state.lists.map((l) => (l.id === action.id ? { ...l, name: action.name } : l)),
      };
    case 'deleteList':
      return {
        lists: state.lists.filter((l) => l.id !== action.id),
        tasks: state.tasks.filter((t) => t.listId !== action.id),
      };
    default:
      return state;
  }
}

export function useTodoStore() {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: keep working in memory */
    }
  }, [state]);

  return [state, dispatch];
}

/** Tasks that belong to a view, before search filtering. */
export function tasksForView(tasks, view) {
  const t = today();
  switch (view) {
    case 'myday':
      return tasks.filter((x) => x.myDay === t);
    case 'important':
      return tasks.filter((x) => x.important);
    case 'planned':
      return tasks.filter((x) => x.due);
    default:
      return tasks.filter((x) => x.listId === view);
  }
}
