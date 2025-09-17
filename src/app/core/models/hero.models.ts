export interface Hero {
  id: string;
  name: string;
  realName?: string;
  powers: string[];
  effectiveness: number;
  weaknesses: string[];
  isAlive: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
