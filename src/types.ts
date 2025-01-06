import { ReactElement } from "react";

export interface InsightPage {
    title: string;
    icon: ReactElement;
    description: string;
    detail: string;
    bg_color: string;
}

export enum InsightPages {
    BEST_DRAFT = "Best_Draft",
    BEST_LINEUP_DECISIONS = "Best_Lineup_Decisions",
    BEST_TRADER = "Best_Trader",
    BEST_WAIVER_WIRE_ = "Best_Waiver_Wire",
    WORST_INJURY_LUCK = "Worst_Injury_Luck",
    WORST_MATCHUP_LUCK = "Worst_Matchup_Luck"
}

export interface TimelineMoment {
    week: number;
    title: string;
    description: string;
    icon: ReactElement;
}