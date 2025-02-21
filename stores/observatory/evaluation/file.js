import { EDAMDict } from './EDAM_forFE_1.25.js';

import { defineStore } from 'pinia';
import { useNuxtApp } from 'nuxt/app';

export const useFileStore = defineStore('file',{
  state: () => ({
    test: 'test',
    dialogParseMetadata: false,
    parseProgressText: '',
    errorDialogParseMetadata: false,
    errorProgressText: '',
    dialogInstallApp: false,
  }),

  getters: {
    getDialogParseMetadata: (state) => state.dialogParseMetadata,
    getParseProgressText: (state) => state.parseProgressText,
    getErrorDialogParseMetadata: (state) => state.errorDialogParseMetadata,
    getErrorProgressText: (state) => state.errorProgressText,
    getDialogInstallApp: (state) => state.dialogInstallApp,
  },

  actions: {
  
    removeEmptyValues(d) {
      const result = {}
      for (const key in d) {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key]) {
          result[key] = d[key];
        }
      }
    	return result;
    },

    buildFeTopicsOperations(topics) {
      if (topics) {
        const items = [];
        for (let i = 0; i < topics.length; i++) {
			    const topic = topics[i];
          const label = topic.split(':').slice(-1)[0];
          const uri = `https://edamontology.org/${label}`;
          const newTopic = {
            term: EDAMDict[uri],
            uri,
            vocabulary: 'EDAM',
          };
          items.push(this.removeEmptyValues(newTopic));
        }
        return items;
      }else {
        return [];
      }
    },

    buildFeDescription(description){
    	// If description is a string, it will return the string in an array
      if (typeof description === 'string') {
        return [description];
      }
    	// If description is an array, it will return the array
      else if (Array.isArray(description)) {
        return description;
      }
      // If description is not present or any other type, it will return an empty array
	    return [];
    },

    buildFeLicense(licenses){
      const newLicenses = [];
      if (licenses){
        for (let i = 0; i < licenses.length; i++){
          const license = licenses[i];
          const newLicenses = {
            name: license['schema:name'],
            url: '',
          }
          newLicenses.push(newLicenses);
        }
        return newLicenses;
      } else {
        return [];
      }
    },

    buildFeAuthors(authors){
      const newAuthors = [];
      if (authors){
        for (let i = 0; i < authors.length; i++) {
          const author = authors[i];
          let type = null;
          try {
				    type = author['@type'].split('/').slice(-1)[0].toLowerCase();
            const newAuthor = {
              type,
              name: author['schema:name'],
              email: author['schema:email'],
              maintainer: false,
            };
    				newAuthors.push(removeEmptyValues(newAuthor));

          } catch (error) {
            console.debug('Author type not found, skipping author');
          }
        }
      }
    	return newAuthors;
    },

    buildFeVersion(version){
  	  console.debug('building version');
      if (version) {
        return version;
      } else {
        return '';
      }
    },

    buildFeInputOutput(inputOutput){
    	console.debug('building input output');
      if (inputOutput) {
    		const items = [];
        for (let i = 0; i < inputOutput.length; i++) {
          const io = inputOutput[i];
          const label = io['biochemas:encodingFormat'].split(':').slice(-1)[0];
          const uri = `https://edamontology.org/${label}`;
          const newIO = {
            datatype: {
              term: '',
              uri: '',
              vocabulary: '',
            },
            term: EDAMDict[uri],
            uri,
            vocabulary: 'EDAM',
          };
          items.push(removeEmptyValues(newIO));
        }
        return items;
      } else {
        return [];
      }
    },

    buildFeHelp(help) {
      console.debug('building help');
	    const newItems = [];

      if (help) {
        for (let i = 0; i < help.length; i++) {
          const item = help[i];
          if (item['@id']){
            const newItem = {
              url: item['@id'],
              type: '',
            };
            newItems.push(newItem);
          }
        }
        return newItems;
      } else {
        return [];
      }
    },

    buildFePublication(publication) {
      console.debug('building publication');
	    const newPublications = [];

      if (publication) {
        for (const pub of publication) {
          const newPub = {};
          
          if (typeof pub === 'object') {
            if (pub['@type'] === 'https://schema.org/CreativeWork') {
              try {
                newPub.url = pub['@id'];
						    newPub.title = pub['schema:name']

                if (pub['@id']) {
                  // @id is https://doi.org/{DOI}
                  newPub.doi = pub['@id'].split('https://doi.org/')[1];
                }
              } catch {
                console.debug(
                  `Publication ${pub} could not be parsed, skipping publication`
                );
              }
            }
          } else {
            console.debug(
              `Publication ${pub} could not be parsed. Unknown type. Skipping publication`
            );
          }

          if (Object.keys(newPub).length > 0) {
            newPublications.push(removeEmptyValues(newPub));
          }
        }
      }
      return newPublications;      
    },

    buildFeEdamTopicsOperations(topics) {
      console.debug('building edam topics operations');
      console.debug(topics);
      if (topics) {
        const items = [];
        for (let i = 0; i < topics.length; i++) {
          const topic = topics[i];
          const label = topic.split(':').slice(-1)[0];
          const uri = `https://edamontology.org/${label}`;
          items.push(uri);
        }
        return items;
      } else {
        return [];
      }
    },

    buildFeLinks(meta) {
      console.debug('building links');
      let newLinks = [];
      if (meta['schema:codeRepository']) {
		    newLinks = newLinks.concat(meta['schema:codeRepository']);
      }
      if (meta['schema:downloadUrl']) {
        newLinks = newLinks.concat(meta['schema:downloadUrl']);
      }
    	return newLinks;
    },

    prepareListsIds(metadata){
      const fields = [
        'edam_topics',
        'edam_operations',
        'documentation',
        'description',
        'webpage',
        'license',
        'src',
        'links',
        'topics',
        'operations',
        'input',
        'output',
        'repository',
        'dependencies',
        'os',
        'authors',
        'publication',
      ];

      for (const field of fields) {
        console.debug('Adding ids to field:', field);
        const items = metadata[field];

        // Check if the field is an array before using map
        if (Array.isArray(items)) {
          const newList = items.map((item, index) => ({
            term: item,
            id: index,
          }));
          metadata[field] = newList;
        } else if (typeof items === 'string') {
          // If it's a string, convert it into an array of one item
          metadata[field] = [{ term: items, id: 0 }];
        } else if (items) {
          // If it is something else and exists, wrap it in an array
          metadata[field] = [{ term: items, id: 0 }];
        }
      }
    
      return metadata;
    },

    // ----------------------------------------------------------------

    // For testing purposes
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    async parseFromGitHubURL(payload) {
      /*
      Download the file from the url and return the file content
      */

      const { $githubapp } = useNuxtApp();
      setDialogParseMetadata(true)
      setParseProgressText('Retrieving file...')

		  // make request to GitHub API
      try {
        const response = await $githubapp('/metadata/content', {
          method: 'POST',
          body: payload,
        });
        
        if (response) {
          const fileContent = response.content;
          this.mapMetadata(fileContent);
        } else {
          this.setErrorDialogParseMetadata(true);
          this.setErrorProgressText(
            'Something went wrong while downloading the file'
          );
        }

      } catch (error) {
        console.debug('Error while fetching metadata: ' + error);
        setDialogParseMetadata(true)
        setParseProgressText('Retrieving file...')
      }
    },

    async parseFromURL({ url }){
      const { $githubapp } = useNuxtApp();
      this.setParseProgressText('Downloading file from URL...')
      this.setDialogParseMetadata(true)

      try {
        // Crear una instancia de Axios si es necesario, o usa directamente axios
        const axiosInstance = this.$axios?.create ? this.$axios.create() : axios;
        axiosInstance.defaults.baseURL = url;

        const response = await axiosInstance.get('');
        const fileContent = response.data;

        console.debug('Downloaded file content:', fileContent);
        const parsedContent = JSON.parse(fileContent);

        // Llamar a la acción mapMetadata con el contenido parseado
        this.mapMetadata(parsedContent);
      } catch (error) {
        console.error('Error fetching or parsing file from URL:', error);
        this.setErrorDialogParseMetadata(true)
        this.setErrorProgressText(`Error fetching file from URL: ${error.message}`)
      }
    },

    importTxt(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          this.errorDialogParseMetadata = true;
          this.errorProgressText = 'No file chosen';
          reject(new Error('No file chosen'));
        } else {
          const reader = new FileReader();

          console.debug('file', file);
          reader.readAsText(file);

          reader.onload = () => {
            const data = reader.result;
            console.debug('data', data);
            resolve(data);
          };

          reader.onerror = () => {
            const errorMessage =
              'Could not read file, error code is ' + reader.error.code;
            console.error('File reading error:', reader.error);
            this.errorDialogParseMetadata = true;
            this.errorProgressText = errorMessage;
            reject(new Error(errorMessage));
          };

          reader.onabort = () => {
            const errorMessage = 'File read operation was aborted.';
            console.error('File read aborted');
            this.errorDialogParseMetadata = true;
            this.errorProgressText = errorMessage;
            reject(new Error(errorMessage));
          };
        }
      });
    },

    async downloadFile(payload) {
      this.parseProgressText = 'Downloading file from URL...';
      this.dialogParseMetadata = true;
      const { $observatory } = useNuxtApp();

      try {
        const URL = '/downloads/download-content/';

        const data = {
          url: payload.url,
        };

        console.log(data);

        const response = await $observatory.post(URL, {
          method: "POST",
          body: data,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        let fileContent = response.data.content.trim();
        fileContent = JSON.parse(fileContent);

        console.log('name', fileContent['schema:name']);
        this.mapMetadata(fileContent);
        console.debug('Downloaded file content:', fileContent);
      } catch (error) {
        console.error('Error fetching or parsing file from URL:', error);
        this.errorDialogParseMetadata = true;
        this.errorProgressText = `Error fetching file from URL: ${error.message}`;
      }
    },

    async parseMetadataFile(file) {
      this.parseProgressText = 'Parsing metadata file content...';
      this.dialogParseMetadata = true;

      let fileContent;
      try {
        fileContent = await this.importTxt(file);
      } catch (error) {
        console.error('Error importing text:', error);
        this.dialogParseMetadata = false;
        this.errorDialogParseMetadata = true;
        this.errorProgressText = `Error importing text from file:<br><br><pre>${error.message}</pre>`;
        return;
      }

      fileContent = fileContent.trim();

      let parsedContent;
      try {
        parsedContent = JSON.parse(fileContent);
        this.mapMetadata(parsedContent);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        this.dialogParseMetadata = false;
        this.errorDialogParseMetadata = true;
        this.errorProgressText = `Error parsing metadata file content:<pre>${error.message}</pre>`;
        // Reemplaza esta línea según cómo manejes la navegación en Pinia
        // this.$router.push({ name: 'evaluation-step-2' });
      }
    },

    mapMetadata(parsedContent) {
      const metadataStore = useMetadataStore();
      
      let metadata = {
        topics: buildFeTopicsOperations(
          parsedContent?.['schema:applicationSubcategory'] || []
        ),
        name: parsedContent?.['schema:name'] || '',
        webpage: parsedContent?.['schema:url'] || [],
        description: buildFeDescription(
          parsedContent?.['schema:description'] || []
        ),
        os: parsedContent?.['schema:operatingSystem'] || [],
        license: buildFeLicense(parsedContent?.['schema:license'] || []),
        authors: buildFeAuthors(parsedContent?.['schema:author'] || []),
        version: buildFeVersion(parsedContent?.['schema:softwareVersion'] || ''),
        repository: parsedContent?.['schema:codeRepository'] || [],
        operations: buildFeTopicsOperations(
          parsedContent?.['schema:featureList'] || []
        ),
        input: buildFeInputOutput(parsedContent?.['bioschemas:input'] || []),
        output: buildFeInputOutput(parsedContent?.['bioschemas:output'] || []),
        download: parsedContent?.['schema:downloadURL'] || [],
        documentation: buildFeHelp(parsedContent?.['schema:softwareHelp'] || []),
        dependencies: parsedContent?.['schema:requirements'] || [],
        registration_not_mandatory:
          parsedContent?.['schema:isAccessibleForFree'] === 'true' || false,
        edam_topics: buildFeEdamTopicsOperations(
          parsedContent?.['schema:applicationSubcategory'] || []
        ),
        edam_operations: buildFeEdamTopicsOperations(
          parsedContent?.['schema:featureList'] || []
        ),
        label: [parsedContent?.['schema:name']] || [],
        src: parsedContent?.['schema:codeRepository'] || [],
        links: buildFeLinks(parsedContent || {}),
        publication: buildFePublication(
          parsedContent?.['codemeta:referencePublication'] || []
        ),
        api_lib: false,
        type: parsedContent?.['schema:applicationCategory'] || '',
        test: [],
        source: [],
        registries: [],
        e_infrastructures: [],
        operational: null,
        inst_instr: false,
        contribPolicy: [],
        other_versions: [],
      };

      // Agregar IDs a las listas para que los v-for funcionen correctamente
      metadata = this.prepareListsIds(metadata);

      metadataStore.updateToolsMetadata(metadata);
      metadataStore.updateLoadedMetadata(true);

      // Actualizar el estado con los nuevos valores
      this.parseProgressText = 'Done';
      this.parseProgressText = '';
      this.dialogParseMetadata = false;
    },

    updateDialogParseMetadata(value){
      this.setDialogParseMetadata(value);
    },

    updateDialogInstallApp(){
      this.setDialogInstallApp(value)
    },

    cancelParse(){
      this.setDialogParseMetadata(false);
      this.setErrorDialogParseMetadata(false);
      this.setParseProgressText('Cancel');
    },

    // ----------------------------------------------------------------
    // Setters
    setDialogParseMetadata(value){
      this.dialogParseMetadata = value;
    },

    setParseProgressText(value) {
      this.parseProgressText = value;
    },
    setErrorDialogParseMetadata(value) {
      this.errorDialogParseMetadata = value;
    },
    setErrorProgressText(text) {
      this.errorProgressText = text;
    },
    setDialogInstallApp(value) {
      this.dialogInstallApp = value;
    },

    


  },
})