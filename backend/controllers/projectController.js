const Project = require('../models/Project');
const { calculateSkillMatch } = require('../utils/mathUtils');

const createProject = async (req, res, next) => {
  try {
    const { title, description, requiredSkills } = req.body;
    const project = await Project.create({
      title,
      description,
      requiredSkills: requiredSkills || [],
      ownerId: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({})
      .populate({
        path: 'ownerId',
        select: 'name email isDemo',
        match: { isDemo: { $ne: true }, email: { $not: /demo/i } }
      });
    
    // Filter out projects where the owner was excluded by the populate match
    const realProjects = projects.filter(p => p.ownerId);
    res.json(realProjects);
  } catch (error) {
    next(error);
  }
};

const applyToProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userSkills } = req.body; // Passing user skill array in body payload for checking
    
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Discrete Mathematics Concept: Skill Matching calculation
    const matchScore = calculateSkillMatch(userSkills, project.requiredSkills);
    
    // Validation ADA Concept: Score evaluation limit logic mock (50%)
    if (matchScore >= 50) {
      if (!project.applicants.includes(req.user.id)) {
        project.applicants.push(req.user.id);
        await project.save();
      }
      res.json({ message: 'Successfully applied', matchScore });
    } else {
      res.status(400).json({ message: 'Skill match too low to apply', matchScore });
    }
  } catch (error) {
    next(error);
  }
};

const getUserApplications = async (req, res, next) => {
  try {
    const projects = await Project.find({ applicants: req.user.id })
      .populate('ownerId', 'name');
    
    // Transform to match frontend expectation (appliedDate status etc)
    const applications = projects.map(p => ({
      id: p._id,
      title: p.title,
      status: 'Under Review', // Mock status for now as we don't have a status field in Project applicants array
      appliedDate: p.createdAt.toISOString().split('T')[0]
    }));
    
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, applyToProject, getUserApplications };
