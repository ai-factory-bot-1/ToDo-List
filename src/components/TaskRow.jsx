import Icon from './Icon.jsx';
import { dueState, formatDue, today } from '../dates.js';

export function Checkbox({ checked, onChange, label, small = false }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`check${checked ? ' is-checked' : ''}${small ? ' check-sm' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
    >
      {checked && <Icon name="check" size={small ? 11 : 13} />}
    </button>
  );
}

export default function TaskRow({ task, listName, selected, showList, onSelect, dispatch }) {
  const state = task.done ? null : dueState(task.due);
  const needsYou = state === 'overdue' || state === 'today';
  const stepsDone = task.steps.filter((s) => s.done).length;

  const meta = [];
  if (showList && listName) meta.push(<span key="list">{listName}</span>);
  if (task.myDay === today() && showList) meta.push(<span key="md">My Day</span>);
  if (task.steps.length)
    meta.push(
      <span key="steps">
        {stepsDone} of {task.steps.length}
      </span>
    );
  if (task.due)
    meta.push(
      <span key="due" className={needsYou ? 'meta-flag' : ''}>
        {formatDue(task.due)}
      </span>
    );
  if (task.note) meta.push(<Icon key="note" name="note" size={13} />);

  return (
    <li
      className={`task-row${selected ? ' is-selected' : ''}${needsYou ? ' needs-you' : ''}${
        task.done ? ' is-done' : ''
      }`}
    >
      <Checkbox
        checked={task.done}
        onChange={() => dispatch({ type: 'toggleDone', id: task.id })}
        label={task.done ? `Mark "${task.title}" as not done` : `Complete "${task.title}"`}
      />
      <button className="task-main" onClick={() => onSelect(task.id)}>
        <span className="task-title">{task.title}</span>
        {meta.length > 0 && (
          <span className="task-meta">
            {meta.flatMap((m, i) => (i ? [<span key={`s${i}`} className="sep">·</span>, m] : [m]))}
          </span>
        )}
      </button>
      <button
        className={`icon-btn star${task.important ? ' is-on' : ''}`}
        onClick={() => dispatch({ type: 'toggleImportant', id: task.id })}
        aria-pressed={task.important}
        aria-label={task.important ? 'Remove importance' : 'Mark as important'}
      >
        <Icon name="star" filled={task.important} />
      </button>
    </li>
  );
}
