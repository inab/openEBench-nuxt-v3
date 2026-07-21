<template>
  <div>
    <!-- Main Content -->
    <div class="content p-4">
      <div class="row my-4">
        <h3 class="fw-bold mb-3">The Software Observatory</h3>
      </div>

      <!-- Header -->
      <div class="row mb-5">
        <div class="col">
          <p class="mb-2">
            The Software Observatory aggregates and analyses research software
						metadata across the Life Sciences. It integrates records from
						multiple registries and repositories, resolves duplicates, enriches
						metadata where possible, and computes
						<span class="font-semibold">FAIRsoft</span> indicators to support
						trends analysis and software FAIRness assessment.
          </p>
        </div>
      </div>

      <!-- Get started -->
      <div class="row mb-2">
        <div class="col">
          <h5 class="text-md fw-semibold">Get started ✨</h5>
          <p class="text-sm">
            Begin exploring with these essential features
          </p>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <!-- Trends -->
        <div class="col-12 col-sm-6 col-lg-3">
          <NuxtLink to="/observatory/Trends" class="text-decoration-none text-reset">
            <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow card-hover d-flex flex-column">

              <!-- Icon -->
              <div class="icon-wrap mb-3">
                <UIcon name="i-charm-chart-line" class="size-6 icon-color" />
              </div>

              <h6 class="mb-3 fw-semibold">
                Trends
              </h6>

              <p class="text-sm flex-grow-1 text-muted mb-3">
                Explore ecosystem and community practices over time:
                licensing, repositories, documentation, and more.
              </p>

              <span class="linkish">
                Go to Trends →
              </span>

            </div>
          </NuxtLink>
        </div>

        <!-- FAIRness Scoreboard -->
        <div class="col-12 col-sm-6 col-lg-3">
          <NuxtLink to="/observatory/FAIRness" class="text-decoration-none text-reset">
            <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow card-hover d-flex flex-column">

              <div class="icon-wrap mb-3">
                <UIcon name="i-charm-disc" class="size-6 icon-color" />
              </div>

              <h6 class="mb-3 fw-semibold">
                FAIRness Scoreboard
              </h6>

              <p class="text-sm flex-grow-1 text-muted mb-3">
                See how collections perform across FAIRsoft indicators.
                Filter, compare and share charts.
              </p>

              <span class="linkish">
                Open Scoreboard →
              </span>

            </div>
          </NuxtLink>
        </div>

        <!-- Evaluator -->
        <div class="col-12 col-sm-6 col-lg-3">
          <NuxtLink to="/observatory/Evaluation" class="text-decoration-none text-reset">
            <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow card-hover d-flex flex-column">

              <div class="icon-wrap mb-3">
                <UIcon name="i-cil-check-circle" class="size-6 icon-color" />
              </div>

              <h6 class="mb-3 font-semibold">
                FAIRsoft Evaluator
              </h6>

              <p class="text-sm flex-grow-1 text-muted mb-3">
                Assess an individual tool, review its metadata and export
                improvements in standard formats.
              </p>

              <span class="linkish">
                Open Evaluator →
              </span>

            </div>
          </NuxtLink>
        </div>

        <!-- Data -->
        <div class="col-12 col-sm-6 col-lg-3">
          <NuxtLink to="/observatory/Data" class="text-decoration-none text-reset">
            <div class="h-100 p-4 bg-white border border-gray-100 rounded-lg shadow card-hover d-flex flex-column">

              <div class="icon-wrap mb-3">
                <UIcon name="i-dashicons-database" class="size-6 icon-color" />
              </div>

              <h6 class="mb-3 font-semibold">
                Data
              </h6>

              <p class="text-sm flex-grow-1 text-muted mb-3">
                Inspect metadata completeness, source coverage and statistics
                across the integrated dataset.
              </p>

              <span class="linkish">
                Go to Data →
              </span>

            </div>
          </NuxtLink>
        </div>
      </div>

      <hr>

      <!-- Get started -->
      <div class="row mt-4">
        <div class="col-12">
          <p class="text-sm">
            Learn more about the Observatory methodology, data sources, FAIRsoft
				    indicators, and developer resources on the <NuxtLink to="/software" class="linkish">About page</NuxtLink>
          </p> 
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
</script>

<style scoped>
.content {
  margin-top: 20px;
}

.title {
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
}

.citation-article {
  font-size: 1rem !important;
}

a {
  color: #0b579f;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  color: #6a98c4;
}

.linkish {
	color: #0b579f;
	font-weight: 600;
	opacity: 0.95;
}

.icon-color{
  color: #0b579f;
}
</style>
