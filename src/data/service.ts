export type ServiceEntry = {
  role: string;
  venue: string;
  venueUrl: string;
  description: string;
};

export const service: ServiceEntry[] = [
  {
    role: 'Invited Reviewer',
    venue: 'NeurIPS 2026',
    venueUrl: 'https://neurips.cc/Conferences/2026',
    description: 'Conference on Neural Information Processing Systems',
  },
  {
    role: 'Invited Reviewer',
    venue: 'CVPR 2026',
    venueUrl: 'https://cvpr.thecvf.com/Conferences/2026',
    description: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition',
  },
  {
    role: 'Invited Reviewer',
    venue: 'ECCV 2026',
    venueUrl: 'https://eccv.ecva.net/',
    description: 'European Conference on Computer Vision',
  },
  {
    role: 'Organizing Committee',
    venue: 'EE Summer School 2023',
    venueUrl: 'assets/certificates/EESS2023.pdf',
    description: 'IISc Bangalore',
  },
];
