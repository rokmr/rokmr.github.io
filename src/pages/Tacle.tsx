import { useEffect } from 'react';

const A = 'tacle/assets';

/** Renders LaTeX in captions once MathJax has loaded (script is in the head). */
declare global {
  interface Window {
    MathJax?: { typesetPromise?: () => Promise<void> };
  }
}

export function Tacle() {
  useEffect(() => {
    document.body.classList.add('tacle-route');
    window.MathJax?.typesetPromise?.().catch(() => {});
    return () => document.body.classList.remove('tacle-route');
  }, []);

  return (
    <div className="tacle-page">
      <div className="header">
        <div className="logo-container">
          <div className="logo">
            <img src={`/${A}/WACV-2025-Logo.png`} alt="WACV 2025 conference logo" />
          </div>
          <div className="logo">
            <img src={`/${A}/IISc.png`} alt="Indian Institute of Science logo" />
          </div>
        </div>
        <h1 className="title">
          TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning
        </h1>
        <div className="authors">Jayateja Kalla*, Rohit Kumar*, and Soma Biswas</div>
        <div className="affiliation">Indian Institute of Science, Bangalore, India.</div>
        <div className="equal-contribution">* Equal contribution</div>
        <div className="conference">WACV 2025</div>

        <div className="links">
          <a
            href="https://openaccess.thecvf.com/content/WACV2025/papers/Kalla_TACLE_Task_and_Class-Aware_Exemplar-Free_Semi-Supervised_Class_Incremental_Learning_WACV_2025_paper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="button pdf"
          >
            <i className="fas fa-file-pdf" style={{ color: '#b31b1b' }} /> Paper
          </a>
          <a
            href="https://openaccess.thecvf.com/content/WACV2025/supplemental/Kalla_TACLE_Task_and_WACV_2025_supplemental.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="button pdf"
          >
            <i className="fas fa-file-alt" style={{ color: '#b31b1b' }} /> Supplementary
          </a>
          <a
            href="https://arxiv.org/pdf/2407.08041"
            target="_blank"
            rel="noopener noreferrer"
            className="button arxiv"
          >
            <i className="ai ai-arxiv" /> arXiv
          </a>
          <a
            href="https://github.com/rokmr/TACLE"
            target="_blank"
            rel="noopener noreferrer"
            className="button github"
          >
            <i className="fab fa-github" /> GitHub
          </a>
          <a href={`/${A}/wacv25-0789.pdf`} className="button poster">
            <i className="fas fa-file-image" style={{ color: '#b31b1b' }} /> Poster
          </a>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Abstract</h2>
        <p>
          We propose a novel TACLE (TAsk and CLass-awarE) framework to address the relatively
          unexplored and challenging problem of exemplar-free semi-supervised class incremental
          learning. In this scenario, at each new task, the model has to learn new classes from both
          (few) labeled and unlabeled data without access to exemplars from previous classes. In
          addition to leveraging the capabilities of pre-trained models, TACLE proposes a novel
          task-adaptive threshold, thereby maximizing the utilization of the available unlabeled data
          as incremental learning progresses. Additionally, to enhance the performance of the
          under-represented classes within each task, we propose a class-aware weighted cross-entropy
          loss. We also exploit the unlabeled data for classifier alignment, which further enhances
          the model performance. Extensive experiments on benchmark datasets, namely CIFAR10,
          CIFAR100, and ImageNet-Subset100 demonstrate the effectiveness of the proposed TACLE
          framework. We further showcase its effectiveness when the unlabeled data is imbalanced and
          also for the extreme case of one labeled example per class.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Introduction</h2>
        <img src={`/${A}/intro.png`} alt="Method Overview" />
        <p className="caption">
          Difference between Class Incremental Learning (CIL), Semi-Supervised CIL (SS-CIL), and
          Exemplar-Free Semi-Supervised CIL (EFSS-CIL) settings.
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Methodology</h2>
        <p>
          Two stages of training are used in TACLE. In the first stage, the model is trained on both
          the labeled data and high-confidence unlabeled data (selected using task-adaptive
          thresholding) of the current task using a class-aware weighted cross-entropy loss. In the
          second stage, the model is fine-tuned on the unlabeled data of the current task using a
          task-adaptive thresholding strategy.
        </p>

        <img src={`/${A}/stage1.png`} alt="Stage 1" />
        <p className="caption">
          <i>
            Stage 1: Training on labeled and high-confidence unlabeled data using class-aware
            weighted cross-entropy loss
          </i>
        </p>

        <img src={`/${A}/stage2.png`} alt="Stage 2" />
        <p className="caption">
          <i>Stage 2: Fine-tuning on unlabeled data using task-adaptive thresholding</i>
        </p>
      </div>

      <div className="section">
        <h2 className="section-title">Results</h2>
        <div className="results-container">
          <div className="result-item">
            <h3>CIFAR Results</h3>
            <img src={`/${A}/CIFAR_Results.png`} alt="CIFARResults" />
            <p className="caption">
              <i>
                {`Average incremental accuracy on CIFAR10 after 5 tasks and CIFAR100 after 10 tasks for SS-CIL. The number in brackets indicates the number of exemplars; our approach does not use any exemplars. Here, \\(\\star\\): models trained from scratch, †: models initialized with MoCo v3 pretrained weights, and ‡: models initialized with ImageNet pretrained weights; RN18: ResNet18 architecture, FT: fixed threshold, i.e. FixMatch.`}
              </i>
            </p>
          </div>
        </div>

        <div className="results-container">
          <div className="result-item">
            <h3>ImageNet-100 Results</h3>
            <img src={`/${A}/ImageNet100_Results.png`} alt="ImageNet-100 Results" />
            <p className="caption">
              <i>
                {`Comparison of average incremental accuracy on ImageNet-Subset100 after 20 tasks for SS-CIL. The number in brackets: buffer size; \\(\\star\\): models trained from scratch and †: model initialized with MoCo v3 pretrained weights.`}
              </i>
            </p>
          </div>
        </div>

        <div className="results-container">
          <div className="result-item">
            <h3>Ablation Study</h3>
            <img src={`/${A}/Ablation_Results.png`} alt="Ablation Study Results" />
            <p className="caption">
              <i>
                {`Ablation study on CIFAR100 dataset with \\(0.8\\%\\) labeled data. The average incremental accuracy is reported at the end of 10 tasks. The proposed components are denoted as C1: task-wise dynamic threshold, C2: class-aware CE loss, C3: exploiting unlabeled data in stage 2.`}
              </i>
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Citation</h2>
        <pre>{`@article{kalla2024tacle,
    title={TACLE: Task and Class-aware Exemplar-free Semi-supervised Class Incremental Learning},
    author={Kalla, Jayateja and Kumar, Rohit and Biswas, Soma},
    journal={arXiv preprint arXiv:2407.08041},
    year={2024}
    }`}</pre>
      </div>

      <div className="section">
        <h2 className="section-title">Acknowledgements</h2>
        <p>
          This work is partly supported through a research grant from SERB, Department of Science and
          Technology, Govt. of India (SPF/2021/000118).
        </p>
      </div>
    </div>
  );
}
