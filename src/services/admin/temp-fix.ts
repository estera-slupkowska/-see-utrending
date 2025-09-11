// Temporary fix for admin services until SQL schema is applied
// This provides mock data so the app can run without database errors

export const TempAnalyticsService = {
  async getDashboardStats() {
    return {
      users: {
        total: 0,
        growth: '+0%',
        newToday: 0,
        newUsersThisWeek: 0,
        activeUsers: 0
      },
      contests: {
        active: 0,
        draft: 0,
        growth: '+0%'
      },
      submissions: {
        total: 0,
        pending: 0,
        growth: '+0%'
      },
      engagement: {
        totalViews: 0,
        growth: '+0%'
      }
    }
  },

  async getRecentActivity() {
    return []
  }
}

export const TempContestsService = {
  async getContests() {
    return []
  },

  async createContest(data: any, userId: string) {
    console.log('Database not ready. Contest data:', data)
    throw new Error('Please run the SQL script in Supabase first')
  },

  async updateContest() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async deleteContest() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async updateContestStatus() {
    throw new Error('Please run the SQL script in Supabase first')
  }
}

export const TempUsersService = {
  async getUsers() {
    return []
  },

  async getUserStats() {
    return {
      totalUsers: 0,
      newUsersToday: 0,
      newUsersThisWeek: 0,
      activeUsers: 0,
      averageXP: 0,
      byRole: {
        creators: 0,
        brands: 0,
        spectators: 0,
        admins: 0
      },
      topUsers: []
    }
  },

  async updateUserRole() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async updateUserXP() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async updateUserVerification() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async exportUsers() {
    return []
  }
}

export const TempContentService = {
  async getContentBlocks() {
    return []
  },

  async createContentBlock() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async updateContentBlock() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async deleteContentBlock() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async toggleContentBlockVisibility() {
    throw new Error('Please run the SQL script in Supabase first')
  },

  async reorderContentBlock() {
    throw new Error('Please run the SQL script in Supabase first')
  }
}