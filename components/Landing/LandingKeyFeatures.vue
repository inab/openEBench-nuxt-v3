<template>
    <div class="w-100 landingkey-features">
        <div class="container">
            <h2 class="text-h4 mb-15">What does OpenEBench offer?</h2>
            <div class="row">
                <div class="col col-6">
                    <div class="welcome-header-image">
                        <img src="~/assets/images/illustrations/404.svg" alt="welcome-header-image" />
                    </div>
                </div>
                <div class="col col-6">
                    <div class="col-row">
                        <div class="rounder-icon">
                            <UIcon name="i-heroicons-check-16-solid" /> 
                        </div>
                        <span class="landingkey-features__text">
                            Supporting community-driven benchmarking
                        </span>
                    </div>
                    <div class="col-row">
                        <div class="rounder-icon">
                            <UIcon name="i-heroicons-check-16-solid" />
                        </div>
                        <span class="landingkey-features__text">
                            Monitoring of software quality in life sciences
                        </span>
                    </div>
                    <div class="col-row">
                        <div class="rounder-icon">
                            <UIcon name="i-heroicons-check-16-solid" />
                        </div>
                        <span class="landingkey-features__text">
                            Contributing towards the adoption of best practices for research
                            software development
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>

<style scoped lang="scss">
.col-row {
    display: flex;
    font-size: 25px;
    align-items: center;
    cursor: pointer;
    position: relative;
    .rounder-icon {
        border-radius: 50%;
        background-color: #f47c21;
        height: 35px;
        width: 35px;
        min-width: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            color: white;
            font-size: 25px;
            font-weight: 600;
        }
    }
    span {
        padding-left: 20px;
    }
    &:not(:first-child){
        margin-top: 20px;
    }
    &::after {
        .landingkey-features__text {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: #0087ca;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
        }
    }
    &:hover::after {
        .landingkey-features__text {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
    }
}
</style>