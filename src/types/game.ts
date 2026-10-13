export type Game = "difficulty-menu" | "loading" | "playing" | "won" | "lost";

export type Difficulty = {
  level: "easy" | "medium" | "hard";
  cards: number;
};

export type Cards = "closed" | "animating" | "open";
