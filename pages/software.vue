<template>
  <div class="team">
  <BreadcrumbsBar :breadcrumbs-array="routeArray" />
    <div class="container">
      <div class="w-100">
  
        <h2 class="text-primaryOeb-500 mb-4">The Software Observatory</h2>

        <p class="mb-2">
          OpenEBench aggregates and analyses research software metadata across the
          Life Sciences. A single pipeline integrates records from multiple
          registries and repositories, resolves duplicates, enriches metadata
          where possible, and computes
          <span class="font-semibold">FAIRsoft</span> indicators. This
          consolidated dataset powers both the
          <NuxtLink to="/tool">Tools catalogue</NuxtLink> and the
          <NuxtLink to="/observatory">Software Observatory</NuxtLink> 
          supporting software discovery, trends analysis, and FAIRness assessment.
        </p>

        <!-- Quick navigation -->
        <div class="row mb-5 mt-4">
          <div class="col-12">
            <div class="p-4 bg-white border border-gray-100 rounded-lg shadow">
              <h5 class="text-lg fw-semibold mb-3">On this page</h5>

              <div class="d-flex flex-wrap gap-5">
                <a href="#methodology" class="toc-link">Methodology</a>
                <a href="#fairsoft" class="toc-link">FAIRsoft indicators</a>
                <a href="#developers" class="toc-link">For developers</a>
                <a href="#cite" class="toc-link">How to cite</a>
                <a href="#terms" class="toc-link">Terms of use</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Methodology -->
        <section id="methodology" class="section">
          <h4 class="section-title">
            Methodology
          </h4>

          <p class="card-content-vs text-sm text-gray-700 mb-4">
            OpenEBench builds an analysis-ready dataset by ingesting software
            metadata from multiple sources, harmonising and enriching it,
            resolving duplicates, and computing FAIRsoft indicators. The same
            dataset feeds both the Tools catalogue and the Software Observatory,
            so the catalogue entries, dashboards, and evaluations all draw on a
            single consolidated source.
          </p>

          <div class="d-flex justify-content-center my-4">
            <img
              src="assets/images/observatory/pipeline.png"
              alt="Overview of the Software Observatory data pipeline"
              class="img-fluid methodology-img px-4"
            >
          </div>

          <p class="text-sm text-muted mb-4">
            Overview of the main and auxiliary pipelines that consolidate and
            enrich software metadata into the single dataset shared by the Tools
            catalogue and the Software Observatory.
          </p>

          <ul class="card-content-vs mb-4">
            <li><strong>Ingest</strong> metadata from multiple registries andrepositories.</li>
            <li><strong>Normalise &amp; enrich</strong> key fields to improveconsistency across sources.</li>
            <li><strong>Block candidates</strong> using heuristics to reducecomparisons for identity resolution.</li>
            <li><strong>Resolve duplicates</strong> with automated decisions (LLMs)and human review for conflicts.</li>
            <li><strong>Merge</strong> into unique software entries and compute<strong>FAIRsoft</strong> indicators and summary statistics.</li>
          </ul>

          <p class="text-sm">
            Find more details on the methodology in the preprint
            <a
              href="https://arxiv.org/abs/2510.05705"
              target="_blank"
              rel="noopener noreferrer"
              class="linkish"
            >
              arXiv:2510.05705
            </a>.
          </p>
        </section>

        <!-- FAIRsoft -->
        <section id="fairsoft" class="section">
          <h4 class="section-title">
            FAIRsoft indicators
          </h4>

          <p class="card-content-vs text-sm text-gray-700 mb-3">
            OpenEBench uses <strong>FAIRsoft</strong> as a practical implementation
            of the FAIR principles for research software. Indicators are computed
            from available metadata and surfaced on individual entries in the Tools
            catalogue, as aggregated views (dashboards) in the Software Observatory,
            and as tool-level assessments through the FAIRsoft Evaluator.
          </p>

          <p class="card-content-vs text-sm text-gray-700 mb-0">
            More information is available in the
            <a
              href="https://inab.github.io/FAIRsoft_indicators/"
              target="_blank"
              rel="noopener noreferrer"
              class="linkish"
            >
              FAIRsoft documentation
            </a>
            and in the publication
            <a
              href="https://doi.org/10.1093/bioinformatics/btae464"
              target="_blank"
              rel="noopener noreferrer"
              class="linkish"
            >
              <em>
                "FAIRsoft – A practical implementation of FAIR principles for research
                software"
              </em>
            </a>.
          </p>
        </section>

        <!-- Developers -->
        <section id="developers" class="section">
          <h4 class="section-title">
            For developers
          </h4>

          <p class="card-content-vs text-sm text-gray-700 mb-4">
            If you want to integrate this software metadata into your own
            workflows, you can access the records and evaluation results via the
            REST APIs and follow the programmatic evaluation documentation for
            computing FAIRsoft indicators.
          </p>

          <div class="row g-4">

            <!-- GitHub Metadata API -->
            <div class="col-12 col-md-4">
              <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow d-flex flex-column">

                <div class="d-flex align-items-center mb-3">
                  <UIcon
                    name="i-mdi-source-repository"
                    class="icon-color size-6 me-2 flex-shrink-0"
                  />
                  <h6 class="mb-0 fw-semibold">GitHub Metadata API</h6>
                </div>
                <p class="text-sm text-muted mb-4">Extract rich metadata from GitHub repositories.</p>
                <a
                  href="https://observatory.openebench.bsc.es/github-metadata-api/api-docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="linkish mt-auto"
                >API documentation</a>
              </div>
            </div>

            <!-- Software Observatory API -->
            <div class="col-12 col-md-4">
              <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow d-flex flex-column">
                <div class="d-flex align-items-center mb-3">
                  <UIcon name="i-mdi-api" class="icon-color size-6 me-2 flex-shrink-0"/>
                  <h6 class="mb-0 fw-semibold">Software Observatory API</h6>
                </div>
                <p class="text-sm text-muted mb-4">
                  Access integrated software metadata, statistics and FAIRsoftevaluation results.
                </p>

                <a
                  href="https://observatory.openebench.bsc.es/api/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="linkish mt-auto"
                >
                  API documentation
                </a>
              </div>
            </div>

            <!-- FAIRsoft -->
            <div class="col-12 col-md-4">
              <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow d-flex flex-column">

                <div class="d-flex align-items-center mb-3">
                  <UIcon name="i-mdi-code-tags"class="icon-color size-6 me-2 flex-shrink-0"/>
                  <h6 class="mb-0 fw-semibold">Programmatic FAIRsoft evaluation</h6>
                </div>

                <p class="text-sm text-muted mb-3">
                  Learn how to compute FAIRsoft indicators programmatically,
                  either through the Observatory APIs or with the
                  <a
                    href="https://github.com/inab/fairsoft-core"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="linkish mt-auto"
                  >
                    fairsoft-core
                  </a>
                  library. Includes guides for evaluating GitHub repositories and
                  existing metadata.
                </p>
                <a
                  href="https://inab.github.io/FAIRsoft_indicators/calculating_fairsoft_scores/programmatic_evaluation/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="linkish"
                >
                  View the documentation
                </a>
              </div>
            </div>

          </div>
        </section>

        <!-- Citation -->
        <section id="cite" class="section">
          <h4 class="section-title">
            How to cite
          </h4>

          <p class="card-content-vs text-sm text-gray-700 mb-4">
            If you use the Software Observatory in your work, please cite the
            following publication:
          </p>

          <div class="p-4 bg-white border border-gray-100 rounded-lg shadow">
            <h6 class="fw-semibold mb-3">
              The Software Observatory: aggregating and analysing software
              metadata for trend computation and FAIR assessment
            </h6>

            <p class="mb-1">
              Eva Martín del Pico, Josep Lluís Gelpí, Salvador
              Capella-Gutiérrez
            </p>

            <p class="mb-1">
              <em>arXiv preprint</em>, 2025.
            </p>

            <p class="mb-0">
              arXiv:
              <a
                href="https://arxiv.org/abs/2510.05705"
                target="_blank"
                rel="noopener noreferrer"
                class="linkish"
              >
                2510.05705
              </a>
            </p>
          </div>
        </section>

        <!-- Terms -->
        <section id="terms" class="section">
          <h4 class="section-title">
            Terms of use
          </h4>

          <p class="card-content-vs text-sm text-gray-700 mb-0">
            All data is distributed under a
            <a
              href="https://creativecommons.org/licenses/by-nd/2.0/"
              target="_blank"
              rel="noopener noreferrer"
              class="linkish"
            >
              CC-BY-ND
            </a>
            license.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadcrumbsBar from "@/components/Common/BreadcrumbsBar.vue";

const routeArray: { label: string; isActualRoute: boolean }[] = [
  { label: "About", isActualRoute: true },
  { label: "Software", isActualRoute: true },
];

</script>

<style scoped>
.toc-link {
  color: #0b579f;
  font-weight: 600;
  text-decoration: none;
  transition: color .2s ease;
}

.toc-link:hover {
  color: #6a98c4;
  text-decoration: underline;
}

html {
  scroll-behavior: smooth;
}

.section {
  padding-top: 10px;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-content-vs {
  font-size: 0.95rem;
  line-height: 1.8;
}

.methodology-img {
  max-height: 400px;
  width: auto;
}

.icon-color {
  color: #0b579f;
}

.linkish {
  color: #0b579f;
  font-weight: 500;
}

.linkish:hover {
  color: #6a98c4;
  text-decoration: underline;
}
</style>