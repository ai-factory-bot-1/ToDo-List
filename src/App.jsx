import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import Sidebar from './components/Sidebar.jsx';
import TaskRow from './components/TaskRow.jsx';
import TaskDetail from './components/TaskDetail.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import { SMART_LISTS, tasksForView, uid, useTodoStore } from './store.js';
import { dueState, formatLongToday } from './dates.js';

const needsYou = (t) => !t.done && ['overdue', 'today'].includes(dueState(t.due));

export default function App() {
  const [state, dispatch] = useTodoStore();
  const [view, setView] = useState('myday');
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [renaming, setRenaming] = useState(false);

  const { lists, tasks } = state;
  const listName = (id) =>
    SMART_LISTS.find((l) => l.id === id)?.name ?? lists.find((l) => l.id === id)?.name ?? '';
  const customList = lists.find((l) => l.id === view);

  // If the current custom list was deleted, fall back to Tasks.
  useEffect(() => {
    if (!SMART_LISTS.some((l) => l.id === view) && !customList) setView('tasks');
  }, [view, customList]);

  const allViews = useMemo(() => [...SMART_LISTS.map((l) => l.id), ...lists.map((l) => l.id)], [lists]);

  const { counts, flagCounts } = useMemo(() => {
    const counts = {};
    const flagCounts = {};
    for (const v of allViews) {
      const open = tasksForView(tasks, v).filter((t) => !t.done);
      counts[v] = open.length;
      flagCounts[v] = open.filter(needsYou).length;
    }
    return { counts, flagCounts };
  }, [tasks, allViews]);

  const searching = query.trim().length > 0;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? tasks.filter(
          (t) => t.title.toLowerCase().includes(q) || t.note.toLowerCase().includes(q)
        )
      : tasksForView(tasks, view);
    const byCreated = (a, b) => b.createdAt - a.createdAt;
    const open = base.filter((t) => !t.done);
    open.sort(
      view === 'planned' && !q
        ? (a, b) => a.due.localeCompare(b.due) || byCreated(a, b)
        : byCreated
    );
    const done = base.filter((t) => t.done).sort((a, b) => b.completedAt - a.completedAt);
    return { open, done };
  }, [tasks, view, query]);

  const selected = tasks.find((t) => t.id === selectedId) || null;
  const closeDetail = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !confirm) {
        setSelectedId(null);
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirm]);

  const selectView = (id) => {
    setView(id);
    setQuery('');
    setSelectedId(null);
    setNavOpen(false);
    setRenaming(false);
  };

  const addTask = (e) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    dispatch({ type: 'addTask', title, view });
    setDraft('');
  };

  const addList = (name) => {
    const id = uid();
    dispatch({ type: 'addList', id, name });
    selectView(id);
  };

  const askDeleteTask = (task) =>
    setConfirm({
      title: `Delete "${task.title}"?`,
      body: 'You won’t be able to undo this.',
      confirmLabel: 'Delete task',
      onConfirm: () => {
        dispatch({ type: 'deleteTask', id: task.id });
        setSelectedId(null);
        setConfirm(null);
      },
    });

  const askDeleteList = (list) => {
    const n = tasks.filter((t) => t.listId === list.id).length;
    setConfirm({
      title: `Delete "${list.name}"?`,
      body:
        n === 0
          ? 'This list is empty. You won’t be able to undo this.'
          : `${n} ${n === 1 ? 'task' : 'tasks'} will be deleted with it. You won’t be able to undo this.`,
      confirmLabel: 'Delete list',
      onConfirm: () => {
        dispatch({ type: 'deleteList', id: list.id });
        setConfirm(null);
        selectView('tasks');
      },
    });
  };

  const flagged = visible.open.filter(needsYou).length;
  const title = searching ? `Results for “${query.trim()}”` : listName(view);

  return (
    <div className={`app${selected ? ' has-detail' : ''}`}>
      <header className="topbar">
        <button
          className="icon-btn nav-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-label="Toggle lists"
          aria-expanded={navOpen}
        >
          <Icon name="menu" />
        </button>
        <span className="wordmark" aria-label="Synpulse">
          synpulse
        </span>
        <span className="topbar-app">To Do</span>
        <label className="search">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search tasks"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedId(null);
            }}
            aria-label="Search tasks"
          />
        </label>
      </header>

      <Sidebar
        lists={lists}
        view={searching ? null : view}
        counts={counts}
        flagCounts={flagCounts}
        onSelect={selectView}
        onAddList={addList}
        open={navOpen}
      />
      {navOpen && <div className="scrim scrim-nav" onClick={() => setNavOpen(false)} />}

      <main className="main">
        <div className="main-inner">
          <div className="page-head">
            <div className="page-title-wrap">
              {renaming && customList ? (
                <input
                  className="title-input"
                  autoFocus
                  defaultValue={customList.name}
                  aria-label="List name"
                  onBlur={(e) => {
                    const n = e.target.value.trim();
                    if (n) dispatch({ type: 'renameList', id: customList.id, name: n });
                    setRenaming(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') setRenaming(false);
                  }}
                />
              ) : (
                <h1 className="h1">{title}</h1>
              )}
              <p className="page-sub">
                {view === 'myday' && !searching && <span>{formatLongToday()}</span>}
                {view === 'myday' && !searching && <span className="sep">·</span>}
                <span>
                  {visible.open.length === 0
                    ? 'Nothing open.'
                    : `${visible.open.length} open`}
                </span>
                {flagged > 0 && (
                  <>
                    <span className="sep">·</span>
                    <span className="flag-count">
                      <span className="dot dot-flag" aria-hidden="true" />
                      {flagged} {flagged === 1 ? 'needs' : 'need'} you today
                    </span>
                  </>
                )}
              </p>
            </div>
            {customList && !searching && (
              <div className="page-actions">
                <button
                  className="icon-btn"
                  onClick={() => setRenaming(true)}
                  aria-label="Rename list"
                >
                  <Icon name="pencil" />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => askDeleteList(customList)}
                  aria-label="Delete list"
                >
                  <Icon name="trash" />
                </button>
              </div>
            )}
          </div>

          {!searching && (
            <form className="add-task" onSubmit={addTask}>
              <Icon name="plus" />
              <input
                className="bare-input"
                placeholder="Add a task"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Add a task"
              />
              <button className="btn btn-primary" disabled={!draft.trim()}>
                Add
              </button>
            </form>
          )}

          {visible.open.length > 0 && (
            <ul className="task-list card">
              {visible.open.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  listName={listName(t.listId)}
                  showList={searching || SMART_LISTS.some((l) => l.id === view && l.id !== 'tasks')}
                  selected={t.id === selectedId}
                  onSelect={setSelectedId}
                  dispatch={dispatch}
                />
              ))}
            </ul>
          )}

          {visible.open.length === 0 && visible.done.length === 0 && (
            <div className="empty">
              <p className="h3">
                {searching
                  ? 'No tasks match your search.'
                  : view === 'myday'
                  ? 'Your day is clear.'
                  : 'No tasks here yet.'}
              </p>
              <p className="meta">
                {searching
                  ? 'Try a different word, or clear the search.'
                  : 'Add one above. Press Enter to save it.'}
              </p>
            </div>
          )}

          {visible.done.length > 0 && (
            <section className="completed">
              <button
                className="completed-toggle"
                onClick={() => setShowCompleted((s) => !s)}
                aria-expanded={showCompleted}
              >
                <Icon name="chevron" size={14} className={showCompleted ? 'rot-90' : ''} />
                <span className="label">Completed</span>
                <span className="completed-count">{visible.done.length}</span>
              </button>
              {showCompleted && (
                <ul className="task-list card">
                  {visible.done.map((t) => (
                    <TaskRow
                      key={t.id}
                      task={t}
                      listName={listName(t.listId)}
                      showList={searching || view !== t.listId}
                      selected={t.id === selectedId}
                      onSelect={setSelectedId}
                      dispatch={dispatch}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </main>

      {selected && (
        <>
          <div className="scrim scrim-detail" onClick={closeDetail} />
          <TaskDetail
            task={selected}
            listName={listName(selected.listId)}
            dispatch={dispatch}
            onClose={closeDetail}
            onDelete={() => askDeleteTask(selected)}
          />
        </>
      )}

      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
