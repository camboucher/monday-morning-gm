interface LeagueData {
    rosters: Roster[];
    // users: User[];
    matchups: Matchup[];
    draft: DraftPick[];
    transactions: Transaction[];
    playerStats: Record<string, PlayerStats>;
  }
  
  interface PlayerStats {
    weeklyPoints: number[];
    gamesPlayed: number;
    totalPoints: number;
    isInjured: boolean;
    injuredWeeks: number[];
    startingWeeks: number[];
  }
  
  interface Roster {
    teamId: string;
    players: string[];
    starters: string[];
  }
  
  interface DraftPick {
    teamId: string;
    playerId: string;
    draftSlot: number;
    round: number;
  }
  
  interface Transaction {
    type: 'waiver' | 'trade';
    teamId: string;
    playerId: string;
    faabSpent?: number;
    timestamp: number;
    playersGiven?: string[];
    playersReceived?: string[];
  }
  
  interface Matchup {
    week: number;
    teamId: string;
    points: number;
    opponent: string;
    opponentPoints: number;
  }
  
  interface AnalysisResult {
    teamId: string;
    score: number;
    metrics: Record<string, number>;
    rank: number;
  }
  
  class FantasyLeagueAnalyzer {
    private leagueData: LeagueData;
    private readonly CLOSE_GAME_THRESHOLD = 5; // Points difference for a close game
    private readonly STARTER_THRESHOLD = 0.5; // 50% of weeks as starter to be considered successful
    private readonly EXPECTED_POINTS_BY_ROUND = {
      1: 200, 2: 180, 3: 160, 4: 140, 5: 120, 
      6: 100, 7: 80, 8: 60, 9: 40, 10: 30
    };
  
    constructor(leagueData: LeagueData) {
      this.leagueData = leagueData;
    }
  
    // Main analysis methods remain the same as before...
  
    // Draft Analysis Helpers
    private calculateDraftValueOverExpected(picks: DraftPick[]): number {
      return picks.reduce((total, pick) => {
        const expectedPoints = this.EXPECTED_POINTS_BY_ROUND[pick.round] || 20;
        const actualPoints = this.leagueData.playerStats[pick.playerId]?.totalPoints || 0;
        return total + (actualPoints - expectedPoints);
      }, 0);
    }
  
    private countRetainedDraftPicks(picks: DraftPick[], team: Roster): number {
      return picks.filter(pick => team.players.includes(pick.playerId)).length;
    }
  
    private countSuccessfulStarters(picks: DraftPick[], team: Roster): number {
      return picks.filter(pick => {
        const stats = this.leagueData.playerStats[pick.playerId];
        if (!stats) return false;
        
        const weeksAsStarter = stats.startingWeeks.length;
        const totalWeeks = stats.weeklyPoints.length;
        return weeksAsStarter / totalWeeks >= this.STARTER_THRESHOLD;
      }).length;
    }
  
    // Trade Analysis Helpers
    private getTeamTrades(trades: Transaction[], teamId: string): Transaction[] {
      return trades.filter(trade => 
        trade.teamId === teamId || 
        trade.playersGiven?.some(p => this.getPlayerOwner(p) === teamId)
      );
    }
  
    private calculateTradePointDifferential(trades: Transaction[]): number {
      return trades.reduce((total, trade) => {
        const pointsReceived = (trade.playersReceived || [])
          .reduce((sum, playerId) => 
            sum + (this.leagueData.playerStats[playerId]?.totalPoints || 0), 0);
        
        const pointsGiven = (trade.playersGiven || [])
          .reduce((sum, playerId) => 
            sum + (this.leagueData.playerStats[playerId]?.totalPoints || 0), 0);
        
        return total + (pointsReceived - pointsGiven);
      }, 0);
    }
  
    private countMutuallyBeneficialTrades(trades: Transaction[]): number {
      return trades.filter(trade => {
        const givenPoints = (trade.playersGiven || [])
          .reduce((sum, playerId) => 
            sum + (this.leagueData.playerStats[playerId]?.totalPoints || 0), 0);
        
        const receivedPoints = (trade.playersReceived || [])
          .reduce((sum, playerId) => 
            sum + (this.leagueData.playerStats[playerId]?.totalPoints || 0), 0);
        
        // Trade is beneficial if both teams got at least 80% of the points they gave up
        const ratio = Math.min(givenPoints / receivedPoints, receivedPoints / givenPoints);
        return ratio >= 0.8;
      }).length;
    }
  
    // Waiver Wire Analysis Helpers
    private getTeamWaiverPickups(teamId: string): Transaction[] {
      return this.leagueData.transactions.filter(t => 
        t.type === 'waiver' && t.teamId === teamId
      );
    }
  
    private calculatePickupPoints(pickups: Transaction[]): number {
      return pickups.reduce((total, pickup) => {
        const playerStats = this.leagueData.playerStats[pickup.playerId];
        if (!playerStats) return total;
        
        // Only count points after pickup
        const pickupWeek = this.getWeekFromTimestamp(pickup.timestamp);
        const pointsAfterPickup = playerStats.weeklyPoints
          .slice(pickupWeek - 1)
          .reduce((sum, points) => sum + points, 0);
        
        return total + pointsAfterPickup;
      }, 0);
    }
  
    private countStarterPickups(pickups: Transaction[], team: Roster): number {
      return pickups.filter(pickup => {
        const stats = this.leagueData.playerStats[pickup.playerId];
        if (!stats) return false;
        
        const pickupWeek = this.getWeekFromTimestamp(pickup.timestamp);
        const weeksAsStarterAfterPickup = stats.startingWeeks
          .filter(week => week >= pickupWeek).length;
        const totalWeeksAfterPickup = stats.weeklyPoints.length - pickupWeek + 1;
        
        return weeksAsStarterAfterPickup / totalWeeksAfterPickup >= this.STARTER_THRESHOLD;
      }).length;
    }
  
    private calculateFaabEfficiency(pickups: Transaction[]): number {
      const totalFaab = pickups.reduce((sum, p) => sum + (p.faabSpent || 0), 0);
      if (totalFaab === 0) return 0;
      
      const totalPoints = this.calculatePickupPoints(pickups);
      return totalPoints / totalFaab;
    }
  
    // Injury Analysis Helpers
    private getTeamInjuries(teamId: string): Record<string, PlayerStats> {
      return Object.fromEntries(
        Object.entries(this.leagueData.playerStats)
          .filter(([playerId, stats]) => 
            stats.isInjured && this.getPlayerOwner(playerId) === teamId
          )
      );
    }
  
    private calculateGamesMissed(injuries: Record<string, PlayerStats>): number {
      return Object.values(injuries).reduce((total, stats) => 
        total + (stats.injuredWeeks?.length || 0), 0);
    }
  
    private calculateInjuryPointsLost(injuries: Record<string, PlayerStats>): number {
      return Object.values(injuries).reduce((total, stats) => {
        const avgPointsPerGame = stats.totalPoints / stats.gamesPlayed;
        const missedGames = stats.injuredWeeks.length;
        return total + (avgPointsPerGame * missedGames);
      }, 0);
    }
  
    private calculateDepthImpact(injuries: Record<string, PlayerStats>, team: Roster): number {
      // Calculate percentage of starters injured
      const starterInjuries = Object.entries(injuries)
        .filter(([playerId]) => team.starters.includes(playerId)).length;
      return starterInjuries / team.starters.length;
    }
  
    // Matchup Analysis Helpers
    private getTeamMatchups(teamId: string): Matchup[] {
      return this.leagueData.matchups.filter(m => m.teamId === teamId);
    }
  
    private calculateWinLuck(matchups: Matchup[]): number {
      const actualWins = matchups.filter(m => m.points > m.opponentPoints).length;
      const expectedWins = matchups.reduce((wins, matchup) => {
        // Calculate win probability based on scoring percentile
        const weekMatchups = this.getMatchupsForWeek(matchup.week);
        const avgScore = this.calculateAverageScore(weekMatchups);
        const stdDev = this.calculateStandardDeviation(weekMatchups);
        
        const zScore = (matchup.points - avgScore) / stdDev;
        const winProb = this.normalCDF(zScore);
        return wins + winProb;
      }, 0);
      
      return actualWins - expectedWins;
    }
  
    private calculateScheduleStrength(matchups: Matchup[]): number {
      return matchups.reduce((total, matchup) => 
        total + matchup.opponentPoints, 0) / matchups.length;
    }
  
    private calculateCloseGameRecord(matchups: Matchup[]): number {
      const closeGames = matchups.filter(m => 
        Math.abs(m.points - m.opponentPoints) <= this.CLOSE_GAME_THRESHOLD
      );
      
      if (closeGames.length === 0) return 0;
      
      const closeWins = closeGames.filter(m => m.points > m.opponentPoints).length;
      return closeWins / closeGames.length;
    }
  
    // Utility Helpers
    private getWeekFromTimestamp(timestamp: number): number {
      // Implementation would depend on your season start date
      const seasonStart = new Date('2023-09-07').getTime(); // Example
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      return Math.floor((timestamp - seasonStart) / msPerWeek) + 1;
    }
  
    private getPlayerOwner(playerId: string): string {
      return this.leagueData.rosters.find(r => 
        r.players.includes(playerId)
      )?.teamId || '';
    }
  
    private getMatchupsForWeek(week: number): Matchup[] {
      return this.leagueData.matchups.filter(m => m.week === week);
    }
  
    private calculateAverageScore(matchups: Matchup[]): number {
      const scores = matchups.map(m => m.points);
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  
    private calculateStandardDeviation(matchups: Matchup[]): number {
      const scores = matchups.map(m => m.points);
      const avg = this.calculateAverageScore(matchups);
      const squareDiffs = scores.map(score => Math.pow(score - avg, 2));
      return Math.sqrt(squareDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length);
    }
  
    private normalCDF(z: number): number {
      // Approximation of the normal cumulative distribution function
      const t = 1 / (1 + 0.3275911 * Math.abs(z));
      const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
      return 0.5 * (1 + (z >= 0 ? erf : -erf));
    }
  }