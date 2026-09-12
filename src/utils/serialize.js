const mapJob = (job) => {
  const j = job && job.toJSON ? job.toJSON() : job || {};
  const applications = Array.isArray(j.applications) ? j.applications : [];
  return {
    ...j,
    salaryMin: j.salary_min ?? j.salaryMin ?? null,
    salaryMax: j.salary_max ?? j.salaryMax ?? null,
    postedDate: j.created_at ?? j.postedDate ?? "",
    applicationsCount:
      Array.isArray(j.applications)
        ? j.applications.length
        : j.applicationsCount ?? 0,
    applications,
  };
};

const mapApplication = (app) => {
  const a = app && app.toJSON ? app.toJSON() : app || {};
  const seeker = a.seeker || a.applicant || {};
  const applicant = {
    ...seeker,
    skills: seeker.profile?.skills || [],
  };
  return {
    ...a,
    jobId: a.job_id ?? a.jobId ?? null,
    role: a.offered_role || a.role || null,
    appliedAt: a.created_at ?? a.appliedAt ?? "",
    coverLetter: a.message || a.coverLetter || "",
    cvUrl: seeker.profile?.cv_url || a.cvUrl || null,
    applicant,
  };
};

module.exports = { mapJob, mapApplication };