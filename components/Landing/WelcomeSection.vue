<template>
    <div class="container container-padding">
        <div class="row welcome-header-box">
            <h1 class="text-h3 mb-4 primary--text">Welcome to OpenEBench</h1>
            <div class="col-7 row">
                <div class="w-100">
                    <h2 class="text-subtitle-1 mb-5">
                        The ELIXIR gateway to benchmarking communities, software monitoring,
                        and quality metrics for life sciences tools and workflows.
                    </h2>
                </div>
                <div class="col-6">
                    <div class="welcome-avatar">
                        <div class="welcome-avatar__image secondary" alt="benchmark"></div>
                    </div>
                    <p class="body-1">
                        I want to search for benchmarking communities and results
                    </p>
                    <NuxtLink to="/benchmarking" class="custom-btn primary welcome-header-btn">
                        Scientific Benchmarking
                    </NuxtLink>
                </div>
                <div class="col-6">
                    <div class="welcome-avatar secondary">
                        <div class="welcome-avatar__image_secondary" alt="benchmark"></div>
                    </div>
                    <p class="body-1">
                        I want to see how to develop sustainable research tools
                    </p>
                    <NuxtLink to="/observatory" class="custom-btn secondary welcome-header-btn">
                        Tools Observatory
                    </NuxtLink>
                </div>
            </div>
            <div class="col-5">
                <div class="welcome-header-image">
                    <img src="~/assets/images/illustrations/chart-person.svg" alt="welcome-header-image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
    .welcome-avatar {
        border-radius: 50%;
        background-color: #396fba;
        height: 60px;
        width: 60px;
        padding: 5px;
        &.secondary {
            background-color: #f47c21;
        }
        &__image {
            background-color: white;
            height: 100%;
            -webkit-mask: url('~/static/icons/benchmark.svg') no-repeat center;
            mask: url('~/static/icons/benchmark.svg') no-repeat center;
        }
        &__image_secondary {
            background-color: white;
            height: 100%;
            -webkit-mask: url('~/static/icons/observatory.svg') no-repeat center;
            mask: url('~/static/icons/observatory.svg') no-repeat center;
        }
    }
    .welcome-header-image  {
        img {
            width: 100%;
        }
    }
    .welcome-header-box {
        h1 {
            font-weight: 600;
            font-size: 3rem !important;
            line-height: 3.125rem;
        }
        h2 {
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.75rem;
            letter-spacing: .009375em;
        }
    }
    .welcome-header-btn {
        height: 45px;
        width: 100%;
        padding: 7px 30px;
        color: white;
        text-decoration: none;
    }
</style>