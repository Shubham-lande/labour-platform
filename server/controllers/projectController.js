const Project = require('../models/Project');
const LabourProfile = require('../models/LabourProfile');
const WorkUpdate = require('../models/WorkUpdate');
const Attendance = require('../models/Attendance');
const { getDBStatus } = require('../config/db');
const {
  getFallbackProjects,
  addFallbackProject,
  getFallbackProjectById,
  assignFallbackWorkersToProject,
  updateFallbackProjectStatus,
  addFallbackWorkUpdate,
  getFallbackWorkUpdates,
  getFallbackAttendance,
} = require('./fallbackStore');

// @desc    Create a new Project / Work Order
// @route   POST /api/projects
// @access  Private (Customer / Admin)
const createProject = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const {
      name,
      category,
      description,
      location,
      requiredSkills,
      workerCount,
      startDate,
      deadline,
      budget,
      priority,
    } = req.body;

    if (!name || !category || !startDate || !deadline || !budget) {
      return res.status(400).json({ success: false, message: 'Please provide all required project fields.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const newPrj = addFallbackProject({
        customer: customerId,
        customerName: req.user.fullName || 'Apex Buildcon Ltd',
        name,
        category,
        description: description || '',
        location: location || { address: 'Plot 4B Tech Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
        requiredSkills: requiredSkills || [],
        workerCount: workerCount || 1,
        startDate,
        deadline,
        budget: parseInt(budget, 10),
        priority: priority || 'medium',
      });

      return res.status(201).json({
        success: true,
        message: `Project "${name}" created successfully!`,
        project: newPrj,
      });
    }

    const project = await Project.create({
      customer: customerId,
      name,
      category,
      description,
      location,
      requiredSkills,
      workerCount: workerCount || 1,
      startDate,
      deadline,
      budget,
      priority: priority || 'medium',
      status: 'created',
      progressPercentage: 0,
      activityHistory: [
        {
          action: 'Project Created',
          performedBy: req.user.fullName || 'Customer Enterprise',
          details: 'Initial project requirements configured',
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: `Project "${name}" created successfully!`,
      project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get List of Projects with Tab Filtering
// @route   GET /api/projects
// @access  Private / Public
const getProjects = async (req, res) => {
  try {
    const { filter = 'all' } = req.query;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const projects = getFallbackProjects(filter);
      return res.json({ success: true, count: projects.length, data: projects });
    }

    let query = {};
    if (filter === 'active') {
      query.status = { $in: ['in_progress', 'work_started', 'labour_assigned', 'paused'] };
    } else if (filter === 'upcoming') {
      query.status = { $in: ['created', 'scheduled'] };
    } else if (filter === 'completed') {
      query.status = { $in: ['completed', 'customer_approved', 'closed'] };
    } else if (filter === 'cancelled') {
      query.status = 'cancelled';
    }

    const projects = await Project.find(query).sort('-createdAt');
    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Project Details
// @route   GET /api/projects/:id
// @access  Private / Public
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const project = getFallbackProjectById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      const updates = getFallbackWorkUpdates(id);
      const attendance = getFallbackAttendance(null, id);

      return res.json({
        success: true,
        data: {
          ...project,
          updates,
          attendance,
        },
      });
    }

    const project = await Project.findById(id).populate('customer', 'fullName email mobileNumber avatar');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updates = await WorkUpdate.find({ project: id }).sort('-createdAt');
    const attendance = await Attendance.find({ project: id }).sort('-createdAt');

    return res.json({
      success: true,
      data: {
        ...project.toObject(),
        updates,
        attendance,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign Labourers to Project (Single or Multiple)
// @route   POST /api/projects/:id/assign
// @access  Private (Customer / Admin)
const assignLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const { workers } = req.body; // Array of { workerId, workerName, roleTitle }

    if (!workers || !Array.isArray(workers) || workers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one worker to assign.' });
    }

    const isMongoDB = getDBStatus();

    // Backend Validation: Prevent assigning unavailable/busy workers
    if (isMongoDB) {
      for (const w of workers) {
        const profile = await LabourProfile.findOne({ userId: w.workerId });
        if (profile && profile.availabilityStatus !== 'available') {
          return res.status(400).json({
            success: false,
            message: `Cannot assign worker "${w.workerName}": Worker status is currently ${profile.availabilityStatus.toUpperCase()}. Only available workers can be assigned.`,
          });
        }
      }
    }

    if (!isMongoDB) {
      const updatedPrj = assignFallbackWorkersToProject(id, workers);
      if (!updatedPrj) return res.status(404).json({ success: false, message: 'Project not found' });

      return res.json({
        success: true,
        message: `Successfully assigned ${workers.length} worker(s) to project!`,
        project: updatedPrj,
      });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    workers.forEach((w) => {
      const exists = project.assignedWorkers.some((aw) => aw.workerId.toString() === w.workerId.toString());
      if (!exists) {
        project.assignedWorkers.push({
          workerId: w.workerId,
          workerName: w.workerName,
          assignmentStatus: 'assigned',
          assignedAt: new Date(),
        });
      }
    });

    if (project.status === 'created') {
      project.status = 'labour_assigned';
    }

    project.activityHistory.unshift({
      action: 'Labour Assigned',
      performedBy: req.user.fullName || 'Customer Contractor',
      details: `Assigned ${workers.length} worker(s) to project`,
    });

    await project.save();

    return res.json({
      success: true,
      message: `Successfully assigned ${workers.length} worker(s) to project!`,
      project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Advance / Update Project Status Workflow (Stepper)
// @route   PUT /api/projects/:id/status
// @access  Private (Customer / Labour / Admin)
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionDetails } = req.body;

    const validStatuses = [
      'created',
      'labour_assigned',
      'scheduled',
      'work_started',
      'in_progress',
      'paused',
      'completed',
      'customer_approved',
      'closed',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const updatedPrj = updateFallbackProjectStatus(id, status, actionDetails);
      if (!updatedPrj) return res.status(404).json({ success: false, message: 'Project not found' });

      return res.json({
        success: true,
        message: `Project status updated to ${status.toUpperCase().replace('_', ' ')}!`,
        project: updatedPrj,
      });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.status = status;
    if (status === 'completed' || status === 'customer_approved') {
      project.progressPercentage = 100;
    }

    project.activityHistory.unshift({
      action: `Status: ${status.toUpperCase().replace('_', ' ')}`,
      performedBy: req.user.fullName || 'User',
      details: actionDetails || `Project status updated to ${status}`,
    });

    await project.save();

    return res.json({
      success: true,
      message: `Project status updated to ${status.toUpperCase().replace('_', ' ')}!`,
      project,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Work Update with Timeline Feed & Progress Percentage
// @route   POST /api/projects/:id/updates
// @access  Private (Labour / Admin)
const addWorkUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, photoUrl, progressPercentage } = req.body;
    const workerId = req.user._id || req.user.id;

    if (!description || progressPercentage === undefined) {
      return res.status(400).json({ success: false, message: 'Description and progress percentage are required.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const newUpd = addFallbackWorkUpdate(id, {
        worker: workerId,
        workerName: req.user.fullName || 'Rajesh Kumar',
        description,
        photoUrl: photoUrl || '',
        progressPercentage: parseInt(progressPercentage, 10),
      });

      return res.status(201).json({
        success: true,
        message: 'Work progress update added successfully!',
        update: newUpd,
      });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const newUpd = await WorkUpdate.create({
      project: id,
      worker: workerId,
      workerName: req.user.fullName || 'Skilled Worker',
      description,
      photoUrl: photoUrl || '',
      progressPercentage: parseInt(progressPercentage, 10),
    });

    project.progressPercentage = parseInt(progressPercentage, 10);
    if (project.status === 'scheduled' || project.status === 'work_started') {
      project.status = 'in_progress';
    }

    project.activityHistory.unshift({
      action: 'Work Update Added',
      performedBy: req.user.fullName || 'Worker',
      details: `${description} (${progressPercentage}%)`,
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: 'Work progress update added successfully!',
      update: newUpd,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  assignLabour,
  updateProjectStatus,
  addWorkUpdate,
};
