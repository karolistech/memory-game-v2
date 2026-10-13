export type Pokemon = {
  id: number;
  name: string;
  type: string;
  height: number;
  weight: number;

  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };

  abilities: string[];
  image: string;
  cry: string;
  description: string;
};
