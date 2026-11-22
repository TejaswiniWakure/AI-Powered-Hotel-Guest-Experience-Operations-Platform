const User = require('../models/User');
const Task = require('../models/Task');
const { ROLES, TASK_STATUS } = require('../config/constants');

class AssignmentEngine {
  /**
   * Find and score candidate staff members for a request
   */
  static async assignStaff({ hotelId, departmentId, departmentName, category, floor = 1, priority = 'Medium' }) {
    // Query active staff members in this hotel
    const staffQuery = {
      hotelId,
      role: ROLES.STAFF,
      active: true
    };

    if (departmentId) {
      staffQuery.departmentId = departmentId;
    }

    let candidates = await User.find(staffQuery);

    // Fallback search by department string if departmentId wasn't strictly found but name was
    if (candidates.length === 0 && departmentName) {
      candidates = await User.find({
        hotelId,
        role: ROLES.STAFF,
        active: true,
        department: new RegExp(`^${departmentName}$`, 'i') // strict name match
      });
    }

    // Fallback: If no staff found in this department, auto-provision an on-duty staff member so requests/food orders are never left stranded
    if (candidates.length === 0 && departmentName) {
      try {
        const Hotel = require('../models/Hotel');
        const Department = require('../models/Department');
        const hotel = await Hotel.findById(hotelId);
        const dept = departmentId 
          ? await Department.findById(departmentId) 
          : await Department.findOne({ hotelId, name: new RegExp(departmentName, 'i') });

        const cleanDept = departmentName.toLowerCase().replace(/[^a-z]/g, '') || 'staff';
        const cleanHotel = hotel?.hotelCode ? hotel.hotelCode.toLowerCase() : 'hotel';
        const staffEmail = `${cleanDept}.${cleanHotel}@staff.stayflow.com`;

        let autoStaff = await User.findOne({ hotelId, email: staffEmail });
        if (!autoStaff) {
          autoStaff = await User.create({
            name: `${departmentName} Duty Staff`,
            email: staffEmail,
            password: 'StayFlow@2026',
            role: ROLES.STAFF,
            hotelId,
            department: departmentName,
            departmentId: dept?._id,
            active: true,
            skills: [departmentName, category || 'Service']
          });
        }
        candidates = [autoStaff];
      } catch (err) {
        console.error('Error auto-provisioning department staff in AssignmentEngine:', err);
      }
    }

    if (candidates.length === 0) {
      return {
        assignedStaff: null,
        assignmentReason: 'No eligible active staff available in this department. Left unassigned for manager manual assignment.'
      };
    }

    // Get active tasks for candidate staff to calculate workload
    const activeTasks = await Task.find({
      hotelId,
      assignedTo: { $in: candidates.map(c => c._id) },
      status: { $in: [TASK_STATUS.NEW, TASK_STATUS.ASSIGNED, TASK_STATUS.ACCEPTED, TASK_STATUS.IN_PROGRESS] }
    });

    const workloadMap = {};
    activeTasks.forEach(t => {
      const id = t.assignedTo?.toString();
      if (id) workloadMap[id] = (workloadMap[id] || 0) + 1;
    });

    // Score each candidate
    let bestCandidate = null;
    let highestScore = -1;
    let bestReason = '';

    const categoryKeywords = category.toLowerCase().split(/\W+/).filter(Boolean);

    candidates.forEach(candidate => {
      // 1. Skill match score (0 - 40)
      const skills = (candidate.skills || []).map(s => s.toLowerCase());
      const hasSkill = skills.some(s => categoryKeywords.some(kw => s.includes(kw) || kw.includes(s)));
      const skillScore = hasSkill ? 40 : 15;

      // 2. Availability score (0 - 25)
      const availabilityScore = candidate.active ? 25 : 0;

      // 3. Workload score (0 - 20) -> fewer active tasks = higher score
      const activeCount = workloadMap[candidate._id.toString()] || 0;
      const workloadScore = Math.max(0, 20 - (activeCount * 5));

      // 4. Location / floor proximity score (0 - 15)
      // Assume staff may have designated floors or proximity
      const locationScore = 15;

      const totalScore = skillScore + availabilityScore + workloadScore + locationScore;

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestCandidate = candidate;
        
        const reasons = [];
        if (hasSkill) reasons.push(`${category} skill expertise`);
        reasons.push(`${activeCount} active task${activeCount === 1 ? '' : 's'}`);
        reasons.push('immediate availability');
        bestReason = `Assigned to ${candidate.name} based on ${reasons.join(', ')} (score: ${totalScore}/100).`;
      }
    });

    return {
      assignedStaff: bestCandidate,
      assignmentReason: bestReason || 'Assigned based on departmental availability.'
    };
  }
}

module.exports = AssignmentEngine;
