import { build } from 'esbuild';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const modules = ['resume', 'experience', 'education', 'publications', 'site'];
const contents = modules.map(name => `import * as ${name} from './src/data/${name}.ts';`).join('\n') + '\nexport default {' + modules.join(',') + '};';
const bundle = await build({ stdin: { contents, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', write: false });
const { default: data } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const { site, socialUrls } = data.site;
const applied = process.argv.includes('--applied');
const tex = value => String(value ?? '').replace(/[–—‑]/g, '-').replace(/[&%$#_{}~^\\]/g, c => ({'&':'\\&','%':'\\%','$':'\\$','#':'\\#','_':'\\_','{':'\\{','}':'\\}','~':'\\textasciitilde{}','^':'\\textasciicircum{}','\\':'\\textbackslash{}'}[c]));
const absolute = href => href.startsWith('/') ? site.origin + href : href.startsWith('assets/') ? site.origin + '/' + href : href;
const link = (url, label) => `\\href{${absolute(url).replace(/[%#]/g, '\\$&')}}{${tex(label)}}`;
const entry = (left, right) => `\\entry{${left}}{${tex(right)}}`;
const section = name => `\\sectiontitle{${name}}`;
const bulletText = value => {
  let result = tex(value);
  for (const [label, url] of [['Support RAG Agent','/work/agentic-rag/'], ['Almanac','/work/almanac/'], ['LLM inference planner','/work/inference-planner/']]) result = result.replace(tex(label), link(url,label));
  return result;
};
const jobBlocks = data.experience.experience.map(job => {
  if (applied && !data.resume.appliedResume.bulletIndexes[job.id]) return '';
  const bullets = ((applied ? data.resume.appliedResume.bulletIndexes[job.id] : job.resumeBulletIndexes) ?? job.bullets.map((_, i) => i)).map(i => (applied ? data.resume.appliedResume.bulletOverrides[job.id]?.[i] : undefined) ?? job.bullets[i]).filter(Boolean);
  const managers = job.managers ? `{\\small ${job.managers.length === 1 ? 'Manager' : 'Managers'}: ${job.managers.map(manager => link(manager.href, manager.name)).join(', ')}}\\par` : '';
  return `${entry(tex(job.title) + ' · ' + (job.companyUrl ? link(job.companyUrl, job.company) : tex(job.company)), job.date)}\n{\\small ${tex(job.location)}}\\par\n${managers}\n\\begin{itemize}\n${bullets.map(b => '\\item '+bulletText(b)).join('\n')}\n\\end{itemize}`;
});
const projects = data.resume.resumeProjects.map(p => `\\begin{tabularx}{\\linewidth}{@{}Xr@{}}\\sffamily\\bfseries ${tex(p.title)} & {\\small ${link(p.href,'Case study')}}\\end{tabularx}\\par\n${tex(p.summary)}\\par\\vspace{6pt}`).join('\n');
const education = data.education.education.filter(ed => !applied || !ed.degree.startsWith('Diploma')).map(ed => {
  const [dates, grade] = ed.details.split(' · ');
  const advisor = ed.advisor ? `{\\small ${tex(ed.advisor.label ?? 'Advisor')}: ${link(ed.advisor.href, ed.advisor.name)}}\\par` : '';
  return `${entry(tex(ed.degree), dates)}\n${tex(ed.school)}${ed.degree.startsWith('Diploma') ? '' : ' · '+tex(grade)}\\par\n${advisor}\n\\vspace{4pt}`;
}).join('\n');
const publications = data.publications.publications.map(pub => {
  const links = pub.links.filter(l => ['Paper','Code','Website'].includes(l.label)).map(l => `\\mbox{${link(l.href,l.label==='Website'?'Project page':l.label)}}`).join(' \\quad ');
  const authors = data.resume.resumePublicationAuthors(pub).map(a => (a.self ? `\\textbf{${tex(a.name)}}` : tex(a.name)) + (a.suffix ? '$^{*}$' : '')).join(', ');
  const heading = applied ? `${tex(data.publications.paperName(pub))} · ${tex(pub.venueShort)}` : tex(pub.title);
  const byline = applied ? authors : `${authors} · ${tex(pub.venueShort)}`;
  return `\\begin{minipage}{\\linewidth}\\RaggedRight\n\\textsf{\\textbf{${heading}}}\\par\n{\\small ${byline}}\\par\n${tex(data.resume.resumePublicationHighlight(pub.title))}\\par\n{\\small ${links}}\n\\end{minipage}\\par\\vspace{${applied ? 3 : 7}pt}`;
}).join('\n');
const portfolioBody = String.raw`${section('Summary')}
${tex(data.resume.resumeSummary)}
${section('Skills')}
${data.resume.resumeSkills.map(g=>'\\textsf{\\textbf{'+tex(g.name)+':}} '+tex(g.items.join(', '))+'\\par').join('\n')}
${section('Publications')}
${publications}
{\small * Equal contribution.}\par
{\small Invited reviewer: NeurIPS, CVPR \& ECCV 2026.}
${section('Experience')}
${jobBlocks[0]}
\newpage
${section('Experience (continued)')}
${jobBlocks.slice(1).join('\n\\vspace{4pt}\n')}
${section('Projects')}
${projects}
${section('Education')}
${education}
${section('Achievements')}
GATE 2022: AIR 221 (Electrical), AIR 227 (Instrumentation).
`;
const appliedBody = String.raw`${section('Summary')}
${tex(data.resume.appliedResume.summary)}
${section('Skills')}
${data.resume.resumeSkills.map(g=>'\\textsf{\\textbf{'+tex(g.name)+':}} '+tex(g.items.join(', '))+'\\par').join('\n')}
${section('Experience')}
${jobBlocks.filter(Boolean).join('\n\\vspace{3pt}\n')}
${section('Publications')}
${publications}
{\small * Equal contribution. Invited reviewer: NeurIPS, CVPR \& ECCV 2026.}
${section('Education')}
${education}
{\small GATE 2022: AIR 221 (Electrical), AIR 227 (Instrumentation).}
`;
const document = String.raw`\documentclass[${applied ? '10pt' : '11pt'},a4paper]{article}
\usepackage[top=${applied ? 12 : 16}mm,bottom=${applied ? 12 : 16}mm,left=${applied ? 15 : 17}mm,right=${applied ? 15 : 17}mm]{geometry}
\usepackage{fontspec}
\setmainfont{texgyrepagella-regular.otf}[BoldFont=texgyrepagella-bold.otf,ItalicFont=texgyrepagella-italic.otf,Ligatures=NoCommon]
\setsansfont{texgyreheros-regular.otf}[BoldFont=texgyreheros-bold.otf,Ligatures=NoCommon]
\usepackage{fontawesome5}
\usepackage{xcolor,hyperref,enumitem,tabularx,fancyhdr,needspace,ragged2e}
\definecolor{accent}{HTML}{24545B}
\hypersetup{colorlinks=true,urlcolor=accent,pdftitle={Rohit Kumar - Resume},pdfauthor={Rohit Kumar}}
\setlength{\parindent}{0pt}
\setlength{\parskip}{2pt}
\linespread{${applied ? 1 : 1.02}}
\raggedbottom
\setlength{\emergencystretch}{2em}
\clubpenalty=10000
\widowpenalty=10000
\setlength{\tabcolsep}{0pt}
\setlist[itemize]{leftmargin=14pt,itemsep=${applied ? 2 : 3}pt,topsep=${applied ? 3 : 5}pt,parsep=0pt}
\pagestyle{fancy}\fancyhf{}\renewcommand{\headrulewidth}{0pt}\fancyfoot[R]{\small\thepage}
\newcommand{\sectiontitle}[1]{\par\addvspace{${applied ? 5 : 9}pt}\Needspace{4\baselineskip}{\sffamily\bfseries\large\color{accent}#1}\par\vspace{1pt}{\color{accent}\hrule height .35pt}\vspace{4pt}}
\newcommand{\entry}[2]{\Needspace{5\baselineskip}\begin{tabularx}{\linewidth}{@{}Xr@{}}\sffamily\bfseries #1 & \small #2\end{tabularx}\par}
\begin{document}
\setlength{\RaggedRightRightskip}{0pt plus 1fil}
\RaggedRight
{\sffamily\bfseries\fontsize{${applied ? 24 : 26}}{${applied ? 27 : 29}}\selectfont Rohit Kumar}\par
{\sffamily ${tex(applied ? data.resume.appliedResume.headline : data.resume.resumeHeadline)}}\par
\vspace{3pt}
{\small \faEnvelope\ ${link('mailto:'+site.email,site.email)}\quad \faGlobe\ ${link(site.origin,'rohit.vision')}\quad \faGithub\ ${link(socialUrls.github,'GitHub')}\quad \faLinkedin\ ${link(socialUrls.linkedin,'LinkedIn')}}
${applied ? appliedBody : portfolioBody}
\end{document}
`;
const outDir = resolve('output/pdf');
await mkdir(outDir,{recursive:true});
const baseName = applied ? 'Rohit-Kumar-Applied-AI' : 'Rohit-Kumar-Resume';
const texPath = resolve(outDir,baseName+'.tex');
await writeFile(texPath,document);
if(process.argv.includes('--source-only')) { console.log(texPath); process.exit(0); }
const compiler = spawnSync('tectonic',['--keep-logs','--outdir',outDir,texPath],{stdio:'inherit'});
if(compiler.error)throw compiler.error;
if(compiler.status!==0)process.exit(compiler.status ?? 1);

if (!applied) {
  await mkdir(resolve("public/assets"),{recursive:true});
  await copyFile(resolve(outDir,baseName+".pdf"),resolve("public/assets/Rohit-Kumar-Resume.pdf"));
}
console.log(resolve(outDir,baseName+".pdf"));
