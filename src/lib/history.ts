/** Bounded undo/redo stacks of immutable snapshots (the share tokens). */
export function createHistory(limit = 50) {
  const past: string[] = [];
  const future: string[] = [];
  return {
    /** Saves where we were before a change; a new change clears the redo stack. */
    record(snapshot: string) {
      if (past[past.length - 1] === snapshot) return;
      past.push(snapshot);
      if (past.length > limit) past.shift();
      future.length = 0;
    },
    undo(current: string): string | undefined {
      const prev = past.pop();
      if (prev !== undefined) future.push(current);
      return prev;
    },
    redo(current: string): string | undefined {
      const next = future.pop();
      if (next !== undefined) past.push(current);
      return next;
    },
    get canUndo() {
      return past.length > 0;
    },
    get canRedo() {
      return future.length > 0;
    },
  };
}
