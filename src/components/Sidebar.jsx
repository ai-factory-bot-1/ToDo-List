import { useState } from 'react';
import Icon from './Icon.jsx';
import { SMART_LISTS } from '../store.js';

export default function Sidebar({ lists, view, counts, flagCounts, onSelect, onAddList, open }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (n) onAddList(n);
    setName('');
    setAdding(false);
  };

  const item = (id, label, icon) => (
    <li key={id}>
      <button
        className={`nav-item${view === id ? ' is-active' : ''}`}
        onClick={() => onSelect(id)}
        aria-current={view === id ? 'page' : undefined}
      >
        <Icon name={icon} />
        <span className="nav-label">{label}</span>
        {flagCounts[id] > 0 && (
          <span className="nav-flag" title={`${flagCounts[id]} due or overdue`}>
            <span className="dot dot-flag" aria-hidden="true" />
            {flagCounts[id]}
          </span>
        )}
        {counts[id] > 0 && <span className="nav-count">{counts[id]}</span>}
      </button>
    </li>
  );

  return (
    <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Lists">
      <nav>
        <ul className="nav-list">{SMART_LISTS.map((l) => item(l.id, l.name, l.icon))}</ul>
        <div className="nav-rule" />
        <ul className="nav-list">{lists.map((l) => item(l.id, l.name, 'list'))}</ul>
      </nav>

      <div className="sidebar-foot">
        {adding ? (
          <form onSubmit={submit}>
            <input
              className="input"
              autoFocus
              placeholder="List name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={submit}
              onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
              aria-label="New list name"
            />
          </form>
        ) : (
          <button className="nav-item nav-add" onClick={() => setAdding(true)}>
            <Icon name="plus" />
            <span className="nav-label">New list</span>
          </button>
        )}
      </div>
    </aside>
  );
}
