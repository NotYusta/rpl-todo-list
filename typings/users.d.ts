

export interface IUserProfile {
    first_name: string;
    last_name: string;
    email: string;
  }
  
  export interface IUser extends IUserProfile {
    // well should just encrypted, meh but yea
    password: string;
    total_xp: number;
    xp: number;
    level: number;
  }