<template>
    <div class="navbar w-full p-0">
        <div class="bg-white w-full h-100">
            <div class="mx-auto">
                <div class="flex items-center nav-wrapper px-4">
                    <div class="text-lg font-bold">
                        <NuxtLink to="/" class="navbar-brand">
                            <img src="/assets/images/opeb_logo.gif" alt="OpenEBench" width="80" class="navbar-logo d-inline-block align-top" />
                        </NuxtLink>
                    </div>
                    <nav class="flex-grow">
                        <div class="nav-mobile">
                            <button class="navbar-burger flex items-center text-blue-600 p-3" id="navbar-toggle"
                            :class="[toggleMenu?'active':'collapsing']"
                            @click="handleToggleMenu">
                                <span></span>
                            </button>
                        </div>
                        <div :class="{'nav-offcanvas': true, 'show': toggleMenu}">
                            <div class="nav-list-items top-full">
                                <ul class="nav-list-items-ul w-100">
                                    <li>
                                        <NuxtLink to="/benchmarking" class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                                        @click="closeMenu">
                                            <span>Benchmarking</span>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink to="/projects" class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                                        @click="closeMenu">
                                            <span>Projects</span>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink to="/tool" class="nav-link flex md:inline-flex items-center hover:bg-gray-50"
                                        @click="closeMenu">
                                            <span>Tools</span>
                                        </NuxtLink>
                                    </li>
                                    <li class="relative parent">
                                        <div class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-2">
                                            <span>Observatory</span>
                                            <font-awesome-icon :icon="['fas', 'chevron-down']" size="sm" />
                                        </div>
                                        <ul class="child transition duration-300 md:absolute top-full left-0 md:w-40 bg-white md:shadow-lg md:rounded-b">
                                            <li>
                                                <ul class="my-2">
                                                    <li v-for="(item, index) in subMenuEntriesObservatory" class="hover:bg-gray-100 ps-3 text-sm"
                                                        :key="index">
                                                        <NuxtLink :to="item.to">
                                                            {{ item.title }}
                                                        </NuxtLink>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="relative parent">
                                        <div class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-3">
                                            <span>About</span>
                                            <font-awesome-icon :icon="['fas', 'chevron-down']" size="sm"/>
                                        </div>
                                        <ul class="child transition duration-300 md:absolute top-full left-0 md:w-28 bg-white md:shadow-lg md:rounded-b">
                                            <li>
                                                <ul class="my-2">
                                                    <li v-for="(item, index) in subMenuEntriesAbout" class="hover:bg-gray-100 ps-3 text-sm "
                                                        :key="index">
                                                        <NuxtLink :to="item.to">
                                                            {{ item.title }}
                                                        </NuxtLink>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div class="nav-list-items-direct top-full hidden sm:flex">
                                <button class="text-primaryOeb-500 border-1 border-primaryOeb-800 hover:bg-primaryOeb-50 font-medium rounded-md text-sm px-3 py-2 me-2">
                                    <a :href="runtimeConfig.public.VRE_URI" target="_blank" @click="closeMenu" class="text-primaryOeb-500" style="text-decoration: none;">
                                        <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" size="sm" class="mr-2"/>
                                        Benchmark your tool
                                    </a>
                                </button>
                                <button @click="handleLogin" class="ripple text-white bg-primaryOeb-500 hover:bg-primaryOeb-400 font-medium rounded-md text-sm px-3 py-2">
                                    <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" size="sm" class="mr-2" />
                                    Login
                                    <span class="ripple-effect"></span>
                                </button>
                            </div>
                        </div>
                        <!-- Overlay div -->
                        <div v-if="toggleMenu" class="nav-overlay" @click="handleToggleMenu"></div>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import menuEntries from '~/components/Header/HeaderMenu/menuEntries';
import subMenuEntriesObservatory from './HeaderMenu/subMenuEntriesObservatory';
import subMenuEntriesAbout from './HeaderMenu/subMenuEntriesAbout';

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/'
    }
})


const { signIn, getProviders, status, data } = useAuth()
const providers = await getProviders()
const runtimeConfig = useRuntimeConfig();

const { $viewport } = useNuxtApp()
let toggleMenu = ref(false);
let isMobile = ref(false);

const handleToggleMenu = () => {
    toggleMenu.value = !toggleMenu.value;
}

function handleLogin() {
    console.log(status)
    console.log(data)
    console.log(providers)
    signIn('keycloak',  { callbackUrl: 'http://localhost:3000/bar' })
}

watch($viewport.breakpoint as string, (newBreakpoint: string, oldBreakpoint: string) => { 
    if(newBreakpoint == 'tablet' || newBreakpoint == 'mobileWide') {
        isMobile.value = true;
    } else {
        isMobile.value = false;
    }
})

function closeMenu() {
    toggleMenu.value = false;
}
</script>


<style scoped lang="scss">
.navbar {
    height: 65px;
    font-size: 18px;
    border-bottom: 1px solid rgb(229, 231, 235);
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100%;
    background-color: white;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 
    0 4px 5px 0 rgba(0, 0, 0, .14), 
    0 1px 10px 0 rgba(0, 0, 0, .12);

    .navbar-brand {
        height: 65px;
        img {
            width: 85px;
        }
    }

    .nav-link {
        font-size: 18px;
        font-weight: 500;
        padding: 22px 16px 15px 16px;
        display: flex;
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;

        &:hover {
            color: #0b579f;
        }
    }

    .nav-mobile {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        height: 55px;
        width: 70px;
    }

    .header-menu-right {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 10px;
    }

    .header-links li span {
        position: relative;
        z-index: 0;
    }

    .header-links li span::before {
        content: '';
        position: absolute;
        z-index: -1;
        bottom: 2px;
        left: -4px;
        right: -4px;
        display: block;
        height: 6px;
    }

    .header-links li.active span::before {
        background-color: #fcae04;
    }

    .header-links li:not(.active):hover span::before {
        background-color: #ccc;
    }

    .child {
        opacity: 0;
        height: 0;
        overflow: hidden;
        transform: translateY(-10%);
        padding-left: 0px;

        ul {
            padding-left: 0px;
            li {
                padding-top: 10px;
                padding-bottom: 10px;
                a {
                    text-decoration: none !important;
                    color: rgb(0, 0, 0);
                }
            }
        }
    }

    .optionsHeader{
        text-decoration: none !important;
    }

    .parent:hover .child {
        opacity: 1;
        height: auto;
        overflow: auto;
        transform: translateY(0);
    }

    #navbar-toggle {
        position: absolute;
        left: 18px;
        top: 15px;
        cursor: pointer;
        padding: 10px 35px 16px 0px;
    }

    #navbar-toggle span,
    #navbar-toggle span:before,
    #navbar-toggle span:after {
        cursor: pointer;
        border-radius: 1px;
        height: 3px;
        width: 30px;
        background: theme('colors.primary.500');
        position: absolute;
        display: block;
        content: '';
        transition: all 300ms ease-in-out;
    }

    #navbar-toggle span:before {
        top: -10px;
    }

    #navbar-toggle span:after {
        bottom: -10px;
    }

    #navbar-toggle.active span {
        background-color: transparent;
    }

    #navbar-toggle.active span:before,
    #navbar-toggle.active span:after {
        top: 0;
    }

    #navbar-toggle.active span:before {
        transform: rotate(45deg);
    }

    #navbar-toggle.active span:after {
        transform: rotate(-45deg);
    }

    .nav-offcanvas {
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100%;
        background-color: white;
        transition: left 0.3s ease-in-out;
        z-index: 2;
    }

    .nav-offcanvas.show {
        left: 0;
    }

    nav {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nav-list {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-list-items {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    .nav-list-items-ul {
        display: flex;
        flex-direction: column;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav-list-items-direct {
        display: flex !important;
        align-items: center;
        justify-content: end !important;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);

        @media only screen and (max-width: 950px) {
            position: static;
            justify-content: start !important;
            margin-top: 20px;
            width: 100%;
            padding: 10px;
            flex-direction: column;
            // border-top: 1px solid #e5e7eb;
        }
    }

.nav-offcanvas {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100%;
    background-color: white;
    transition: left 0.3s ease-in-out;
    z-index: 2;
}

.nav-offcanvas.show {
    left: 0;
}

.nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1;
    transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
    opacity: 0;
}

.nav-offcanvas.show + .nav-overlay {
    transition: width 0.3s ease-in-out, opacity 0.3s ease-in-out;
    width: 100%;
    opacity: 1;
    display: block;
}

.nav-overlay {
    display: none;
}

@media only screen and (min-width: 950px) {
    .nav-list {
        display: flex;
    }

    .nav-mobile {
        display: none;
    }

    .nav-offcanvas {
        position: static;
        width: auto;
        height: auto;
        display: flex;
        flex-direction: row;
        background-color: transparent;
        transform: none;
        transition: none;
    }

    .nav-list-items {
        flex-direction: row;
    }

    .nav-list-items-ul {
        flex-direction: row;
    }
}

@media only screen and (max-width: 950px) {
    .nav-wrapper {
        background-color: white;
    }

    .nav-list {
        display: block;
        background-color: white;
    }

    .navbar-brand {
        position: absolute;
        top: 0;
        background: transparent;
        height: 55px;
        width: 70px;
    }

    .nav-mobile {
        display: block;
    }

    .nav-list-items {
        display: block;
    }

    .nav-list-items-ul {
        display: block;
    }

    nav {
        width: 100%;
        padding: 55px 0 15px;
        flex-grow: 1;
    }

    nav ul {
        display: none;
    }

    nav ul li {
        float: none;
    }

    nav ul li a {
        padding: 15px;
        line-height: 20px;
    }

    nav ul li ul li a {
        padding-left: 30px;
    }

    .navbar-dropdown {
        position: static;
    }

    #navbar-toggle.active span::before {
        transform: rotate(45deg);
    }

    #navbar-toggle.active span::after {
        transform: rotate(-45deg);
    }

    #navbar-toggle {
        position: absolute;
        left: 0px;
        top: 15px;
        cursor: pointer;
        padding: 10px 35px 16px 0px;
        width: 45px;
    }

    #navbar-toggle span,
    #navbar-toggle span:before,
    #navbar-toggle span:after {
        cursor: pointer;
        border-radius: 1px;
        height: 3px;
        width: 30px;
        background: #0b579f;
        position: absolute;
        display: block;
        content: '';
        transition: all 300ms ease-in-out;
    }

    #navbar-toggle span:before {
        top: -10px;
    }

    #navbar-toggle span:after {
        bottom: -10px;
    }

    #navbar-toggle.active span {
        background-color: transparent;
    }

    #navbar-toggle.active span:before,
    #navbar-toggle.active span:after {
        top: 0;
    }

    #navbar-toggle.active span:before {
        transform: rotate(45deg);
        width: 30px;
    }

    #navbar-toggle.active span:after {
        transform: rotate(-45deg);
        width: 30px;
    }
}
}
</style>
