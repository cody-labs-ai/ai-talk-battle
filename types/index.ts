export interface Character {
  id: string;
  emoji: string;
  iconName?: string;
  name: string;
  description: string;
  systemPrompt: string;
}

export interface Mode {
  id: string;
  emoji: string;
  name: string;
  description: string;
  rules: string;
}

export interface Message {
  id: string;
  character: Character;
  content: string;
  timestamp: Date;
}
