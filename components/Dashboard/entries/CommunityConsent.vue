<template>
  <div class="w-100">
    <CustomSubtitle text="Community terms of use" />
    <div class="terms-content">
      <div class="terms-intro text-gray-500">
        <h5 class="text-gray-500">
          Customize Your Experience: Create Your Own Terms of Use
        </h5>
        <div class="w-100 text-gray-500">
          <p>
            We believe in giving you control over your online experience. That's
            why we offer the unique opportunity to create and implement your own
            Terms of Use for your interactions within our platform.
          </p>
          <p>This empowers you to:</p>
          <ul class="list-disc">
            <li>
              <strong>Define your expectations:</strong> Clearly outline how you
              want users to interact with your content and profile.
            </li>
            <li>
              <strong>Set boundaries:</strong> Establish specific rules and
              guidelines to foster a respectful and positive environment.
            </li>
            <li>
              <strong>Tailor the experience:</strong> Customize the terms to
              suit your individual needs and preferences.
            </li>
          </ul>
          <p>
            Ready to take control? Click here to start crafting your own Terms
            of Use!
          </p>
        </div>
      </div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmitTerms"
      >
        <ckeditor
          v-model="state.terms"
          :editor="ClassicEditor"
          :config="config"
        />
        <div class="w-100">
          <div v-if="oks" class="ok-response">
            <div class="alert alert-success text-center">
              {{ oks }}
            </div>
          </div>
        </div>
        <div class="w-100">
          <div v-if="errors.length > 0" class="errors">
            <div class="alert alert-danger text-center">
              {{ getErrors }}
            </div>
          </div>
        </div>
        <div class="form-footer">
          <UButton type="button" color="white" variant="solid" @click="goReset">
            Reset
          </UButton>
          <UButton type="submit"> Submit </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CustomSubtitle from "@/components/Common/CustomSubtitle.vue";
import { object, string, safeParse } from "valibot";

import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Indent,
  IndentBlock,
  List,
  Link,
  Table,
  TableToolbar,
  BlockQuote,
  CodeBlock,
  HorizontalLine,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Heading,
  SourceEditing,
} from "ckeditor5";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";

const props = defineProps<{
  communityId: string;
}>();

const config = computed(() => {
  return {
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Code,
      Indent,
      IndentBlock,
      List,
      Link,
      Table,
      TableToolbar,
      BlockQuote,
      CodeBlock,
      HorizontalLine,
      SpecialCharacters,
      SpecialCharactersEssentials,
      Heading,
      SourceEditing,
    ],
    toolbar: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "sourceEditing",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "|",
      "bulletedList",
      "numberedList",
      "bulletedList ",
      "|",
      "link",
      "insertTable",
      "blockQuote",
      "codeBlock",
      "horizontalLine",
      "formatPainter",
      "specialCharacters",
    ],
  };
});
const textDescription =
  "Why do we use it?" +
  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." +
  "Where does it come from?" +
  "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32." +
  "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham." +
  "Where can I get some?" +
  "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.";
const state = ref({
  terms: textDescription,
});
const errors = ref<string[]>([]);
const oks = ref<string>("");

const schema = object({
  terms: string(),
});

async function onSubmitTerms(event: FormSubmitEvent<Schema>) {
  const result = safeParse(schema, state.value);
  if (result.success) {
    const customErrors = validateRequiredFields(state.value);
    if (customErrors.length > 0) {
      errors.value = customErrors;
    } else {
      errors.value = [];
      oks.value = "Community created successfully";
      const msg = "Your community terms of use have been successfully saved.";
      await showOkMessage(msg);
    }
  }
}

function validateRequiredFields(data: any): string[] {
  const requiredFields = ["terms"];
  const errorMessages: string[] = [];

  requiredFields.forEach((field) => {
    if (typeof data[field] === "string" && data[field].trim() === "") {
      errorMessages.push(`${field} cannot be empty`);
    }
  });
  return errorMessages;
}

const getErrors = computed(() => errors.value.join(", "));

function goReset() {
  state.value.terms = textDescription;
}

async function showOkMessage(msg: string) {
  oks.value = msg;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      oks.value = "";
      resolve("done");
    }, 5000);
  });
}
</script>

<style lang="scss" scoped>
.terms-content {
  paddig-bottom: 6px;
  .terms-intro {
    color: var(--color-gray-500);
    padding-bottom: 20px;
    font-size: 15px;
    h5 {
      font-size: 16px;
      font-weight: bold;
      text-decoration: underline;
    }
  }
}
</style>
