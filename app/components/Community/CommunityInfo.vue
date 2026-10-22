<template>
	<div class="community-info">
		<div class="community-info__header">
			<UAccordion
				class="intro-accordion"
				:items="HEADER_ITEM"
				:default-value="HEADER_ITEM[0]?.value"
			>
				<template #default="{ item }">
					<div>
						<h2 class="intro-accordion-title">{{ item.label }}</h2>
						<div class="text-left community-info__subtitle mt-2">
							{{ community.name }}
						</div>
					</div>
				</template>
				<template #trailing="{ open }">
					<UIcon
						name="i-heroicons-chevron-right-20-solid"
						class="intro-accordion-icon"
						:class="[open && 'rotate-90']"
					/>
				</template>
				<template #acronym>
					<div class="community-info__header__body">
						<div class="row">
							<!-- Col for Image: Hidden on small screens -->
							<div class="col-2 d-none d-md-flex community-info__header__body__left">
								<img :src="logo" alt="welcome-header-image" />
							</div>
							<!-- Col for Text: Full width on small screens, majority width on larger screens -->
							<div class="col-12 col-md-10 community-info__header__body__right">
								<div class="w-100 community-info__header__body__right__row">
									{{ community.description }}
								</div>
								<div v-if="community.keywords" class="community-info__header__body__right__row">
									<span class="font-semibold">Keywords:</span>
									<span class="font-bold">{{ community.keywords.join(', ') }}</span>
								</div>
								<div
									v-if="communityReferences && communityReferences.length > 0"
									class="community-info__header__body__right__row"
								>
									<div class="w-100 d-flex">
										<span class="font-semibold">References:</span>
										<div
											v-for="(reference, index) in communityReferences"
											:key="index"
											class="community-info__header__link text-primaryOeb-500"
										>
											<a :href="reference.href" target="_blank">
												<span title="Go to Reference">
													{{ reference.doi }}
												</span>
											</a>
										</div>
									</div>
								</div>
								<div
									v-if="communityLinks && communityLinks.length > 0"
									class="community-info__header__body__right__row"
								>
									<div class="w-100 d-flex">
										<span class="font-semibold">Links:</span>
										<div
											v-for="(link, index) in communityLinks"
											:key="index"
											class="community-info__header__link text-primaryOeb-500"
										>
											<span :title="`Go to ${link.label}`">
												<a :href="link.uri" target="_blank">{{ link.label }}</a>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</UAccordion>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	community: any;
	communityReferences: any[] | null;
}>();

console.log(props.community);

const HEADER_ITEM = [
	{
		label: props.community.acronym ? props.community.acronym : '',
		value: props.community.acronym || 'community',
		description: props.community.description,
		slot: 'acronym',
	},
];

const logo = computed(() => {
	const imgLogo = props.community?.logo;

	if (imgLogo) {
		return imgLogo;
	}

	const logoLink = props.community?.links?.find(
		(link: { label?: string; comment?: string }) =>
			link.label === 'Logo' || link.comment === '@logo'
	);

	return logoLink?.uri ?? null;
});

const communityLinks = computed(() => {
	if (!props.community.links) return [];
	return props.community.links.filter((link: { comment: string }) => {
		if (link.comment !== '@logo') {
			return link;
		}
	});
});
</script>

<style scoped lang="scss">
.community-info {
	padding-bottom: 40px;
	width: 100%;

	.community-info__header {
		&__collapse__btn {
			padding: 0;
			&:hover {
				background-color: white;
			}
		}
		&__link {
			padding-right: 10px;
		}
	}
	.community-info__header__body {
		padding-bottom: 20px;
		padding-top: 10px;
		&__right {
			&__row {
				padding-top: 10px;
				padding-bottom: 10px;
				span {
					padding-right: 10px;
				}
				a {
					text-decoration: none;
					color: var(--color-gray-500);
					font-weight: 600;
					&:hover {
						color: var(--color-primary-300);
					}
				}
			}
		}
		&__left {
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 100%;
				max-width: 400px;
			}
		}
	}
	.community-info {
		&__title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			&__icon {
				font-size: 30px;
				line-height: 20px;
			}
		}
		&__subtitle {
			font-size: 16px;
			font-weight: 400;
			padding-bottom: 5px;
			color: black;
		}
	}
	.label-btn {
		white-space: nowrap;
		width: 100%;
	}
}
</style>
