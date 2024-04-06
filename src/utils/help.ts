import { TaskType } from "./types";

export function filterTasksBySearch(
  tasks: TaskType[],
  searchValue: string | null
): TaskType[] {
  if (!searchValue || !tasks) {
    return tasks || [];
  }

  const queryTokens = searchValue.toLowerCase().split(" ");
  const searchedTasks: TaskType[] = tasks.filter((task) => {
    const taskName = task.title.toLowerCase();

    // Optionally, concatenate other searchable string fields from the task here

    if (taskName.includes(searchValue.toLowerCase())) {
      return true;
    }

    const taskTokens = taskName.split(" ");

    // Check if any query token has a small Levenshtein distance to any task token
    return queryTokens.some((queryToken) =>
      taskTokens.some(
        (taskToken) =>
          levenshteinDistance(queryToken, taskToken) < taskToken.length / 2
      )
    );
  });

  return searchedTasks;
}

export const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};
