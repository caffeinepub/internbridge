export interface Student {
  id: string;
  name: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  password: string;
  idProof: string;
  skills: string[];
  photo: string;
  resume: string;
  resumeFilename: string;
  certificates: Certificate[];
  verified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'more_info';
  assessments: Assessment[];
}

export interface Certificate {
  id: string;
  filename: string;
  data: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'more_info';
}

export interface Assessment {
  testName: string;
  score: number;
  date: string;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  companyName: string;
  ownerName: string;
  ownerIdProof: string;
  dinNumber: string;
  cinNumber: string;
  address: string;
  verified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'more_info';
}

export interface Internship {
  id: string;
  recruiterId: string;
  companyName: string;
  designation: string;
  duration: string;
  stipend: string;
  workType: 'Offline' | 'Online' | 'Hybrid';
  skillsRequired: string[];
  description: string;
  postedDate: string;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  companyName: string;
  designation: string;
  appliedDate: string;
  status: 'applied' | 'under_review' | 'accepted' | 'rejected';
}

export function seedData() {
  const studentsKey = 'internbridge_students';
  const recruitersKey = 'internbridge_recruiters';
  const internshipsKey = 'internbridge_internships';
  const applicationsKey = 'internbridge_applications';

  if (
    localStorage.getItem(studentsKey) &&
    localStorage.getItem(recruitersKey) &&
    localStorage.getItem(internshipsKey) &&
    localStorage.getItem(applicationsKey)
  ) {
    return;
  }

  const students: Student[] = [
    {
      id: 'student-001',
      name: 'Priya Sharma',
      dob: '2001-05-15',
      gender: 'Female',
      email: 'priya@example.com',
      mobile: '9876543210',
      password: 'password123',
      idProof: 'Aadhar',
      skills: ['Python', 'SQL', 'Power BI'],
      photo: '',
      resume: '',
      resumeFilename: 'priya_resume.pdf',
      certificates: [],
      verified: true,
      verificationStatus: 'verified',
      assessments: [
        { testName: 'Python', score: 4, date: '2026-01-15' },
        { testName: 'SQL', score: 5, date: '2026-01-20' },
      ],
    },
    {
      id: 'student-002',
      name: 'Rahul Verma',
      dob: '2002-08-22',
      gender: 'Male',
      email: 'rahul@example.com',
      mobile: '9123456789',
      password: 'password123',
      idProof: 'PAN',
      skills: ['EXCEL', 'Power BI'],
      photo: '',
      resume: '',
      resumeFilename: 'rahul_resume.pdf',
      certificates: [],
      verified: false,
      verificationStatus: 'pending',
      assessments: [],
    },
  ];

  const recruiters: Recruiter[] = [
    {
      id: 'recruiter-001',
      name: 'Anita Patel',
      email: 'anita@techcorp.com',
      phone: '9988776655',
      password: 'password123',
      companyName: 'TechCorp Solutions',
      ownerName: 'Rajesh Patel',
      ownerIdProof: 'PAN',
      dinNumber: 'DIN12345678',
      cinNumber: 'CIN98765432',
      address: '123 Tech Park, Bangalore, Karnataka 560001',
      verified: true,
      verificationStatus: 'verified',
    },
    {
      id: 'recruiter-002',
      name: 'Suresh Kumar',
      email: 'suresh@innovate.in',
      phone: '9876543211',
      password: 'password123',
      companyName: 'Innovate Labs',
      ownerName: 'Suresh Kumar',
      ownerIdProof: 'Aadhar',
      dinNumber: 'DIN87654321',
      cinNumber: 'CIN12345678',
      address: '456 Innovation Hub, Hyderabad, Telangana 500001',
      verified: false,
      verificationStatus: 'pending',
    },
  ];

  const internships: Internship[] = [
    {
      id: 'intern-001',
      recruiterId: 'recruiter-001',
      companyName: 'TechCorp Solutions',
      designation: 'Data Analyst Intern',
      duration: '3 months',
      stipend: '₹15,000/month',
      workType: 'Hybrid',
      skillsRequired: ['Python', 'SQL', 'Power BI'],
      description: 'Work with our data team to analyze business metrics, build dashboards, and generate insights from large datasets. You will collaborate with senior analysts and learn industry best practices.',
      postedDate: '2026-02-01',
    },
    {
      id: 'intern-002',
      recruiterId: 'recruiter-001',
      companyName: 'TechCorp Solutions',
      designation: 'Business Intelligence Intern',
      duration: '6 months',
      stipend: '₹20,000/month',
      workType: 'Online',
      skillsRequired: ['EXCEL', 'Power BI', 'SQL'],
      description: 'Join our BI team to create interactive reports and dashboards. You will work on real business problems and present findings to stakeholders.',
      postedDate: '2026-02-05',
    },
    {
      id: 'intern-003',
      recruiterId: 'recruiter-001',
      companyName: 'TechCorp Solutions',
      designation: 'Python Developer Intern',
      duration: '4 months',
      stipend: '₹18,000/month',
      workType: 'Offline',
      skillsRequired: ['Python', 'SQL'],
      description: 'Develop backend services and automation scripts using Python. Work with REST APIs, databases, and cloud services in a fast-paced startup environment.',
      postedDate: '2026-02-10',
    },
  ];

  const applications: Application[] = [
    {
      id: 'app-001',
      internshipId: 'intern-001',
      studentId: 'student-001',
      studentName: 'Priya Sharma',
      studentEmail: 'priya@example.com',
      companyName: 'TechCorp Solutions',
      designation: 'Data Analyst Intern',
      appliedDate: '2026-02-15',
      status: 'under_review',
    },
    {
      id: 'app-002',
      internshipId: 'intern-002',
      studentId: 'student-001',
      studentName: 'Priya Sharma',
      studentEmail: 'priya@example.com',
      companyName: 'TechCorp Solutions',
      designation: 'Business Intelligence Intern',
      appliedDate: '2026-02-16',
      status: 'applied',
    },
    {
      id: 'app-003',
      internshipId: 'intern-003',
      studentId: 'student-002',
      studentName: 'Rahul Verma',
      studentEmail: 'rahul@example.com',
      companyName: 'TechCorp Solutions',
      designation: 'Python Developer Intern',
      appliedDate: '2026-02-18',
      status: 'applied',
    },
  ];

  if (!localStorage.getItem(studentsKey)) {
    localStorage.setItem(studentsKey, JSON.stringify(students));
  }
  if (!localStorage.getItem(recruitersKey)) {
    localStorage.setItem(recruitersKey, JSON.stringify(recruiters));
  }
  if (!localStorage.getItem(internshipsKey)) {
    localStorage.setItem(internshipsKey, JSON.stringify(internships));
  }
  if (!localStorage.getItem(applicationsKey)) {
    localStorage.setItem(applicationsKey, JSON.stringify(applications));
  }
}

export function getStudents(): Student[] {
  try {
    return JSON.parse(localStorage.getItem('internbridge_students') || '[]');
  } catch { return []; }
}

export function getRecruiters(): Recruiter[] {
  try {
    return JSON.parse(localStorage.getItem('internbridge_recruiters') || '[]');
  } catch { return []; }
}

export function getInternships(): Internship[] {
  try {
    return JSON.parse(localStorage.getItem('internbridge_internships') || '[]');
  } catch { return []; }
}

export function getApplications(): Application[] {
  try {
    return JSON.parse(localStorage.getItem('internbridge_applications') || '[]');
  } catch { return []; }
}

export function saveStudents(students: Student[]) {
  localStorage.setItem('internbridge_students', JSON.stringify(students));
}

export function saveRecruiters(recruiters: Recruiter[]) {
  localStorage.setItem('internbridge_recruiters', JSON.stringify(recruiters));
}

export function saveInternships(internships: Internship[]) {
  localStorage.setItem('internbridge_internships', JSON.stringify(internships));
}

export function saveApplications(applications: Application[]) {
  localStorage.setItem('internbridge_applications', JSON.stringify(applications));
}
