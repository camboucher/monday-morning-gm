import { ReactElement } from "react";

export interface InsightPage {
    title: string;
    icon: ReactElement;
    description: string;
    detail: string;
    bg_color: string;
}

export interface TimelineMoment {
    week: number;
    title: string;
    description: string;
    icon: ReactElement;
}