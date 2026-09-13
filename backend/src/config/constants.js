module.exports = {
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff',
    GUEST: 'guest'
  },
  
  HOTEL_STATUS: {
    TRIAL: 'trial',
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    CANCELLED: 'cancelled'
  },

  SUBSCRIPTION_PLANS: {
    ESSENTIAL: 'essential',
    PROFESSIONAL: 'professional',
    ENTERPRISE: 'enterprise'
  },

  PRIORITY_LEVELS: {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
  },

  DEFAULT_SLA_MINUTES: {
    Critical: 15,
    High: 30,
    Medium: 60,
    Low: 120
  },

  REQUEST_STATUS: {
    NEW: 'new',
    ASSIGNED: 'assigned',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ESCALATED: 'escalated'
  },

  TASK_STATUS: {
    NEW: 'new',
    ASSIGNED: 'assigned',
    ACCEPTED: 'accepted',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ESCALATED: 'escalated'
  },

  SLA_STATUS: {
    ON_TRACK: 'on_track',
    AT_RISK: 'at_risk',
    BREACHED: 'breached'
  },

  ROOM_TYPES: ['standard', 'deluxe', 'suite', 'family'],
  ROOM_STATUS: ['available', 'occupied', 'maintenance', 'inactive'],
  
  KNOWLEDGE_CATEGORIES: ['faq', 'sop', 'policy', 'menu', 'emergency', 'facility']
};
