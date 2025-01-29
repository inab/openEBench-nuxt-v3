<template>
  <div>
    <!-- Main Content -->
    <div class="content p-4">
      <div class="row my-4">
        <h3 class="fw-bold mb-3">About the Software Observatory</h3>
      </div>

      <div class="row">
        <div class="col">
          <p class="mb-6 ">
            The Software Observatory is designed as a dynamic tool to
            systematically monitor, assess, and elevate the quality of Life
            Sciences research software. Our mission is not just to observe but to
            actively foster the adoption of best practices in software development
            within the Life Sciences community.
          </p>

          <h6 class="text-xl fw-bold ">Observatory API</h6>
          <p class="mb-6">
            Software Metadata, statistics and FAIRsoft evaluation are made
            available through the
            <a target="_blank" href=" https://observatory.openebench.bsc.es/api/docs">Software Observatory API</a>.
          </p>
          <h6 class="text-xl fw-bold">GitHub Metadata API</h6>
          <p class="mb-6">
            Extraction of metadata from GitHub repositories and the addition of
            files to GitHub repositories is done through the
            <a target="_blank" href="https://observatory.openebench.bsc.es/github-metadata-api/api-docs/">GitHub
              Metadata API</a>.
          </p>
          <h6 class="text-xl fw-bold">Terminology</h6>
          <p class="mb-6">
            The Software Observatory uses the following terminology:
          </p>

          <ul class="mt-2">
            <li class="mb-2">
              <span class="highlight-info">Canonical Tool/Software</span>:
              abstract notion of a given research software, as a computational
              solution that has been implemented and given an identity name by its
              author/s.
            </li>
            <li class="mb-2">
              <span class="highlight-info">Instance of a canonical tool/software:</span>
              Each of the different ways in which a canonical tool is implemented,
              in terms of the way a user interacts with it, e.g. command-line
              applications, web applications, libraries; availability, e.g.
              desktop and/or web applications; or differences in the code that are
              not big enough to justify considering them as distinct tools, e.g.
              different versions of the same software.
            </li>
            <li class="mb-2">
              <span class="highlight-info">Primary Sources</span>: sources used to
              discover software and build an initial collection of instances.
            </li>
            <li class="mb-2">
              <span class="highlight-info">Secondary sources</span>: sources mined
              to further enrich the initial collection of software metadata. They
              are identified through cross-references.
            </li>
          </ul>

          <h6 class="text-xl fw-bold">Citation</h6>
          <p class="mb-6">
            <span class="citation-article mt-0">FAIRsoft - A practical implementation of FAIR
              principles for research software</span><br />
            Eva Martín del Pico, Josep Lluís Gelpí, Salvador Capella-Gutiérrez<br />
            <i>Bioinformatics</i>, Volume 40, Issue 8, August 2024, btae464;
            doi:<a target="_blank" href=" https://doi.org/10.1093/bioinformatics/btae464">10.1093/bioinformatics/btae464</a>
          </p>

          <h6 class="text-xl fw-bold">Terms of Use</h6>
          <p class="mb-6">
            All data is distributed under a
            <a target="_blank" href="https://creativecommons.org/licenses/by-nd/2.0/">
              CC-BY-ND</a>
            license.
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

.highlight-info {
  color: #0b579f;
  font-weight: 600;
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
</style>
