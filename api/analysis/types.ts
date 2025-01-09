export interface Player {
  player_id: string;
  position: string;
  fantasy_positions: string[];
  status: string;
  injury_status?: string;
}

export interface DraftPick {
  picked_by: string;
  player_id: string;
  round: number;
  draft_slot: number;
}

export interface Transaction {
  type: string;
  status: string;
  roster_ids: number[];
  adds: Record<string, number>;
  drops: Record<string, number>;
  created: number;
}
