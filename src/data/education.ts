import type { IconName } from '../components/Icon';

export type Education = {
  degree: string;
  school: string;
  details: string;
  courses?: string;
  advisor?: { name: string; href: string; label?: string };
};

export const education: Education[] = [
  {
    degree: 'M.Tech in Artificial Intelligence',
    school: 'Indian Institute of Science (IISc), Bangalore',
    details: '2022 - 2024 · CGPA: 8.0/10.0',
    advisor: { label: 'Thesis advisor', name: 'Prof. Soma Biswas', href: 'https://www.linkedin.com/in/soma-biswas-b58749b' },
    courses:
      'Pattern Recognition & Neural Networks, Computer Vision, Digital Image Processing, Deep Learning for NLP, LLMs for Practical NLP, Stochastic Models, Optimization',
  },
  {
    degree: 'B.Tech in Electrical Engineering',
    school: 'Bhagalpur College of Engineering, Bhagalpur',
    details: '2018 - 2021 · CGPA: 8.75/10.0',
    advisor: { name: 'Prof. Arjun Kumar', href: 'https://spnrecararia.ac.in/FacultyofElectricalEngg.aspx' },
  },
  {
    degree: 'Diploma in Electrical Engineering',
    school: 'Government Polytechnic Muzaffarpur, Muzaffarpur',
    details: '2015 - 2018 · 77.73%',
  },
];

export type Achievement = {
  icon: Extract<IconName, 'star' | 'medal' | 'certificate'>;
  value: string;
  title: string;
  subtitle: string;
  link?: { href: string; ariaLabel: string };
};

export const achievements: Achievement[] = [
  {
    icon: 'star',
    value: 'AIR 221',
    title: 'GATE EE 2022',
    subtitle: 'Score: 803 | Marks: 73/100',
    link: {
      href: 'assets/certificates/GATE_EE_2022.pdf',
      ariaLabel: 'View GATE EE 2022 certificate',
    },
  },
  {
    icon: 'star',
    value: 'AIR 227',
    title: 'GATE IN 2022',
    subtitle: 'Score: 670 | Marks: 67.33/100',
    link: {
      href: 'assets/certificates/GATE_IN_2022.pdf',
      ariaLabel: 'View GATE IN 2022 certificate',
    },
  },
  {
    icon: 'medal',
    value: 'Rank 1',
    title: 'BCECE LE 2018',
    subtitle: 'State Lateral Entry Exam',
  },
  {
    icon: 'certificate',
    value: 'Agents Course',
    title: 'HuggingFace',
    subtitle: 'AI Agents Development',
    link: {
      href: 'assets/certificates/HF_Agents_Course.jpeg',
      ariaLabel: 'View HuggingFace Agents Course certificate',
    },
  },
  {
    icon: 'certificate',
    value: 'miniCON AI Infra',
    title: 'Marktechpost',
    subtitle: 'AI Infrastructure',
    link: {
      href: 'https://credsverse.com/credentials/6adc8979-a5be-4dd7-ad48-b5549379960a',
      ariaLabel: 'View Marktechpost miniCON AI Infra certificate',
    },
  },
  {
    icon: 'certificate',
    value: 'OpenCV Bootcamp',
    title: 'OpenCV University',
    subtitle: 'Computer Vision',
    link: {
      href: 'https://courses.opencv.org/certificates/96b14b2e0a6e4ea390aebb15125cd218',
      ariaLabel: 'View OpenCV Bootcamp certificate',
    },
  },
];
