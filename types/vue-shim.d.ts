// types/vue-shim.d.ts
declare module "*.vue" {
	import type { DefineComponent } from "vue";

	const component: DefineComponent<object, object, unknown>;
	export default component;
}

declare module "*.svg?component" {
	import type { DefineComponent } from "vue";

	const component: DefineComponent<object, object, unknown>;
	export default component;
}