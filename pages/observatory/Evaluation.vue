<template>
  <div>
  <NuxtLayout :name="layout">
    <template #fairsoft>
      <div class="p-4">
        <div class="row my-4">
          <div class="col-12">
            <h5 class="mb-3">Welcome to the FAIRsoft Evaluator!</h5>
            <p style="line-height: 1.9" class="mb-0 mt-0">
              Enhance the FAIRness of your software. Here’s how you can use our tool:
            </p>

            <ul style="line-height: 1.9" class="mb-0 mt-0 text-sm list-disc">
              <li>
                <strong class="text-primaryOeb-600">Retrieve Metadata:</strong>
                Automatically pull data from either the Software Ecosystem database
						    or your project’s GitHub repository.
              </li>
              <li>
                <strong class="text-primaryOeb-600">Refine & Review:</strong>
                Easily adjust and verify the metadata to ensure accuracy.
              </li>
              <li>
                <strong class="text-primaryOeb-600">Evaluate:</strong>
                Get instant FAIRsoft scores and see pass/fail results for each criterion to
						    measure your software’s compliance.
              </li>
              <li>
                <strong class="text-primaryOeb-600">Act:</strong>
                Export the metadata or citation for your software or directly improve the project by making
						    a pull request on GitHub.
              </li>
            </ul>

            <h6 class="mt-4 font-bold">Ready to start?</h6>
            Follow the steps below! 👇
          </div>

          <div class="col-12 mt-5">
            <EvaluationStepper/>
          </div>
        </div>
      </div>
    </template>
  </NuxtLayout>
  </div>
</template>
  
<script setup lang="ts">
const layout = 'observatory'
import EvaluationStepper from "@/components/Observatory/evaluation/EvaluationStepper.vue"
  
</script>
