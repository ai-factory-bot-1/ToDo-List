import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { Checkbox } from './TaskRow.jsx';
import { addDays, dueState, formatDue, today } from '../dates.js';

export default function TaskDetail({ task, listName, dispatch, onClose, onDelete }) {
  const [title, setTitle] = useState(task.title);
  const [note, setNote] = useState(task.note);
  const [step, setStep] = useState('');

  useEffect(() => {
    setTitle(task.title);
    setNote(task.note);
    setStep('');
  }, [task.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (p) => dispatch({ type: 'patchTask', id: task.id, patch: p });
  const commitTitle = () => {
    const t = title.trim();
    if (t && t !== task.title) patch({ title: t });
    else setTitle(task.title);
  };

  const addStep = (e) => {
    e.preventDefault();
    const s = step.trim();
    if (s) dispatch({ type: 'addStep', id: task.id, title: s });
    setStep('');
  };

  const inMyDay = task.myDay === today();
  const state = task.done ? null : dueState(task.due);
  const t = today();

  return (
    <aside className="detail" aria-label="Task details">
      <div className="detail-head">
        <span className="label">{listName}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close details">
          <Icon name="x" />
        </button>
      </div>

      <div className="detail-body">
        <section className="card detail-title-card">
          <div className="detail-title-row">
            <Checkbox
              checked={task.done}
              onChange={() => dispatch({ type: 'toggleDone', id: task.id })}
              label={task.done ? 'Mark as not done' : 'Complete task'}
            />
            <textarea
              className={`detail-title${task.done ? ' is-done' : ''}`}
              value={title}
              rows={1}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
              aria-label="Task title"
            />
            <button
              className={`icon-btn star${task.important ? ' is-on' : ''}`}
              onClick={() => dispatch({ type: 'toggleImportant', id: task.id })}
              aria-pressed={task.important}
              aria-label={task.important ? 'Remove importance' : 'Mark as important'}
            >
              <Icon name="star" filled={task.important} />
            </button>
          </div>

          <ul className="steps">
            {task.steps.map((s) => (
              <li key={s.id} className="step">
                <Checkbox
                  small
                  checked={s.done}
                  onChange={() => dispatch({ type: 'toggleStep', id: task.id, stepId: s.id })}
                  label={`Step: ${s.title}`}
                />
                <span className={`step-title${s.done ? ' is-done' : ''}`}>{s.title}</span>
                <button
                  className="icon-btn icon-btn-sm"
                  onClick={() => dispatch({ type: 'deleteStep', id: task.id, stepId: s.id })}
                  aria-label={`Delete step ${s.title}`}
                >
                  <Icon name="x" size={14} />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addStep} className="step-add">
            <Icon name="plus" size={16} />
            <input
              className="bare-input"
              placeholder={task.steps.length ? 'Next step' : 'Add step'}
              value={step}
              onChange={(e) => setStep(e.target.value)}
              aria-label="Add step"
            />
          </form>
        </section>

        <section className="card">
          <button
            className={`detail-action${inMyDay ? ' is-on' : ''}`}
            onClick={() => dispatch({ type: 'toggleMyDay', id: task.id })}
          >
            <Icon name="sun" />
            <span>{inMyDay ? 'Added to My Day' : 'Add to My Day'}</span>
            {inMyDay && <Icon name="x" size={14} className="detail-action-end" />}
          </button>
        </section>

        <section className="card">
          <div className="field-head">
            <span className="label">Due date</span>
            {task.due && (
              <span className={`meta${state === 'overdue' || state === 'today' ? ' meta-flag' : ''}`}>
                {formatDue(task.due)}
              </span>
            )}
          </div>
          <div className="chip-row">
            {[
              ['Today', t],
              ['Tomorrow', addDays(t, 1)],
              ['Next week', addDays(t, 7)],
            ].map(([label, d]) => (
              <button
                key={label}
                className={`chip${task.due === d ? ' is-active' : ''}`}
                onClick={() => patch({ due: d })}
                aria-pressed={task.due === d}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="date-row">
            <input
              type="date"
              className="input"
              value={task.due || ''}
              onChange={(e) => patch({ due: e.target.value || null })}
              aria-label="Pick a due date"
            />
            {task.due && (
              <button className="btn btn-secondary" onClick={() => patch({ due: null })}>
                Remove
              </button>
            )}
          </div>
        </section>

        <section className="card">
          <label className="label" htmlFor="note">
            Note
          </label>
          <textarea
            id="note"
            className="input note"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== task.note && patch({ note })}
            rows={4}
          />
        </section>
      </div>

      <div className="detail-foot">
        <span className="meta">
          {task.done && task.completedAt
            ? `Completed ${new Date(task.completedAt).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
              })}`
            : `Created ${new Date(task.createdAt).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
              })}`}
        </span>
        <button className="icon-btn" onClick={onDelete} aria-label="Delete task">
          <Icon name="trash" />
        </button>
      </div>
    </aside>
  );
}
